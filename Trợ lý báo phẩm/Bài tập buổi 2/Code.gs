// ============================================
// CODE.GS - Server-side Logic
// Quản Lý Nguồn Thực Phẩm Trong Tuần
// ============================================

// ---- CẤU HÌNH ----
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_HEADCOUNT = 'số lượng người ăn trong tuần';
var SHEET_TIEUCHUAN = 'tiêu chuẩn';

// ---- WEB APP ENTRY POINTS ----

function doGet() {
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('Quản Lý Nguồn Thực Phẩm')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ---- LẤY DỮ LIỆU SỐ LƯỢNG NGƯỜI ĂN ----

function getHeadcountData() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_HEADCOUNT);
    if (!sheet) return getDefaultHeadcount();

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return getDefaultHeadcount();

    var result = {};
    for (var i = 1; i < data.length; i++) {
      var dayName = data[i][0].toString().trim();
      result[dayName] = {
        sang: parseInt(data[i][1]) || 0,
        trua: parseInt(data[i][2]) || 0,
        chieu: parseInt(data[i][3]) || 0
      };
    }
    return result;
  } catch (e) {
    Logger.log('Lỗi getHeadcountData: ' + e.message);
    return getDefaultHeadcount();
  }
}

function getDefaultHeadcount() {
  var days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  var result = {};
  for (var i = 0; i < days.length; i++) {
    result[days[i]] = { sang: 100, trua: 100, chieu: 100 };
  }
  return result;
}

// ---- LẤY DỮ LIỆU TIÊU CHUẨN ----

function getTieuChuanData() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_TIEUCHUAN);
    if (!sheet) return getDefaultTieuChuan();

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return getDefaultTieuChuan();

    var result = {};
    for (var i = 1; i < data.length; i++) {
      var dayName = data[i][0].toString().trim();
      result[dayName] = {
        sang: parseFloat(data[i][1]) || 0,
        trua: parseFloat(data[i][2]) || 0,
        chieu: parseFloat(data[i][3]) || 0
      };
    }
    return result;
  } catch (e) {
    Logger.log('Lỗi getTieuChuanData: ' + e.message);
    return getDefaultTieuChuan();
  }
}

function getDefaultTieuChuan() {
  var days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  var result = {};
  for (var i = 0; i < days.length; i++) {
    result[days[i]] = { sang: 15000, trua: 25000, chieu: 25000 };
  }
  return result;
}
