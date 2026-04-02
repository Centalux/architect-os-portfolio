// ============================================
// CODE.GS - Server-side Logic
// Trợ Lý Báo Phẩm - Quản lý nguồn thực phẩm
// ============================================

// ---- CẤU HÌNH ----
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// ---- WEB APP ENTRY POINTS ----

function doGet() {
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('Trợ Lý Báo Phẩm')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ---- HELPER ----

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// ============================================
// QUÂN SỐ - Đọc từ Google Sheets
// ============================================

/**
 * Đọc quân số theo tuần từ sheet "Quân số tuần {weekNum}"
 * Trả về object: { "Thứ Hai": {sang: N, trua: N, chieu: N}, ... }
 */
function getQuanSoTuan(weekNum) {
  try {
    var sheetName = 'Quân số tuần ' + weekNum;
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      // Nếu không có sheet tuần đó, trả về object rỗng
      return {};
    }
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return {};

    var result = {};
    // Row 0 = headers: Thứ | Sáng | Trưa | Chiều
    for (var i = 1; i < data.length; i++) {
      var thu = data[i][0] ? data[i][0].toString().trim() : '';
      if (thu) {
        result[thu] = {
          sang: parseInt(data[i][1]) || 0,
          trua: parseInt(data[i][2]) || 0,
          chieu: parseInt(data[i][3]) || 0
        };
      }
    }
    return result;
  } catch (e) {
    Logger.log('Lỗi getQuanSoTuan(' + weekNum + '): ' + e.message);
    return {};
  }
}

/**
 * Đọc quân số tất cả các tuần (1-5)
 * Trả về: { 1: {...}, 2: {...}, ... }
 */
function getAllQuanSo() {
  var all = {};
  for (var w = 1; w <= 5; w++) {
    all[w] = getQuanSoTuan(w);
  }
  return all;
}

// ============================================
// BÁO GIÁ - CRUD trên Google Sheets
// ============================================

function getBaoGiaSheetName() {
  return 'Báo giá';
}

function ensureBaoGiaSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(getBaoGiaSheetName());
  if (!sheet) {
    sheet = ss.insertSheet(getBaoGiaSheetName());
    sheet.appendRow(['Tên thực phẩm', 'Đơn vị tính', 'Giá thị trường', 'Giá tăng gia']);
  }
  return sheet;
}

/**
 * Lưu toàn bộ danh mục báo giá (ghi đè)
 * data: [{ten, dvt, giaTT, giaTG}, ...]
 */
function saveBaoGia(data) {
  try {
    var sheet = ensureBaoGiaSheet();
    // Xóa dữ liệu cũ (giữ header)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 4).clear();
    }
    // Ghi dữ liệu mới
    if (data && data.length > 0) {
      var rows = data.map(function(item) {
        return [item.ten, item.dvt, parseFloat(item.giaTT) || 0, parseFloat(item.giaTG) || 0];
      });
      sheet.getRange(2, 1, rows.length, 4).setValues(rows);
    }
    return { success: true, message: 'Đã lưu ' + (data ? data.length : 0) + ' mục báo giá.' };
  } catch (e) {
    return { success: false, message: 'Lỗi lưu báo giá: ' + e.message };
  }
}

/**
 * Đọc toàn bộ danh mục báo giá
 * Trả về: [{ten, dvt, giaTT, giaTG}, ...]
 */
function loadBaoGia() {
  try {
    var sheet = ensureBaoGiaSheet();
    var data = sheet.getDataRange().getValues();
    var result = [];
    for (var i = 1; i < data.length; i++) {
      var ten = data[i][0] ? data[i][0].toString().trim() : '';
      if (ten) {
        result.push({
          ten: ten,
          dvt: data[i][1] ? data[i][1].toString().trim() : '',
          giaTT: parseFloat(data[i][2]) || 0,
          giaTG: parseFloat(data[i][3]) || 0
        });
      }
    }
    return result;
  } catch (e) {
    Logger.log('Lỗi loadBaoGia: ' + e.message);
    return [];
  }
}

// ============================================
// MENU DATA - Lưu/Load state thực đơn
// ============================================

function getMenuSheetName() {
  return 'Menu Data';
}

/**
 * Lưu toàn bộ state thực đơn dưới dạng JSON string
 */
function saveMenuData(jsonStr) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(getMenuSheetName());
    if (!sheet) {
      sheet = ss.insertSheet(getMenuSheetName());
    }
    sheet.clear();
    // Chia JSON thành nhiều ô (giới hạn 50000 chars/ô)
    var CHUNK = 50000;
    var chunks = [];
    for (var i = 0; i < jsonStr.length; i += CHUNK) {
      chunks.push(jsonStr.substring(i, i + CHUNK));
    }
    sheet.getRange(1, 1).setValue(chunks.length);
    for (var j = 0; j < chunks.length; j++) {
      sheet.getRange(j + 2, 1).setValue(chunks[j]);
    }
    return { success: true, message: 'Đã lưu thực đơn.' };
  } catch (e) {
    return { success: false, message: 'Lỗi lưu thực đơn: ' + e.message };
  }
}

/**
 * Đọc lại state thực đơn
 */
function loadMenuData() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(getMenuSheetName());
    if (!sheet) return null;
    var numChunks = parseInt(sheet.getRange(1, 1).getValue()) || 0;
    if (numChunks === 0) return null;
    var jsonStr = '';
    for (var i = 0; i < numChunks; i++) {
      jsonStr += sheet.getRange(i + 2, 1).getValue().toString();
    }
    return jsonStr;
  } catch (e) {
    Logger.log('Lỗi loadMenuData: ' + e.message);
    return null;
  }
}

// ============================================
// INIT DATA - Load tất cả khi mở app
// ============================================

/**
 * Trả về tất cả dữ liệu cần thiết khi mở app
 */
function getInitData() {
  try {
    return {
      quanSo: getAllQuanSo(),
      baoGia: loadBaoGia(),
      menuJson: loadMenuData()
    };
  } catch (e) {
    return {
      quanSo: {},
      baoGia: [],
      menuJson: null,
      error: e.message
    };
  }
}
