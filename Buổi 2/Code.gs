// ============================================
// CODE.GS - Server-side Logic
// Google Apps Script Web App - Order Management
// ============================================

// ---- CẤU HÌNH ----
// Thay SPREADSHEET_ID bằng ID Google Sheets thực tế của bạn
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Tên các sheet
var SHEET_DEPARTMENTS = 'Departments';
var SHEET_CUSTOMERS = 'Customers';
var SHEET_PRODUCTS = 'Products';
var SHEET_ORDERS = 'Orders';

// ---- WEB APP ENTRY POINTS ----

function doGet() {
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('Quản Lý Đơn Hàng')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ---- HELPER FUNCTIONS ----

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheetData(sheetName) {
  var sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet "' + sheetName + '" không tồn tại!');
  }
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    row._rowIndex = i + 1; // 1-based row number in sheet
    result.push(row);
  }
  return result;
}

function generateId(prefix, sheetName) {
  var sheet = getSpreadsheet().getSheetByName(sheetName);
  var lastRow = sheet.getLastRow();
  var nextNum = 1;
  if (lastRow > 1) {
    var lastId = sheet.getRange(lastRow, 1).getValue().toString();
    var numPart = lastId.replace(/[^0-9]/g, '');
    nextNum = parseInt(numPart, 10) + 1;
  }
  var padded = ('000' + nextNum).slice(-3);
  return prefix + padded;
}

// ============================================
// CUSTOMERS CRUD
// ============================================

function getCustomers() {
  try {
    return getSheetData(SHEET_CUSTOMERS);
  } catch (e) {
    throw new Error('Lỗi khi lấy danh sách khách hàng: ' + e.message);
  }
}

function addCustomer(data) {
  try {
    var sheet = getSpreadsheet().getSheetByName(SHEET_CUSTOMERS);
    var customerId = generateId('KH', SHEET_CUSTOMERS);
    sheet.appendRow([customerId, data.customerName, data.phone, data.memberLevel]);
    return { success: true, message: 'Thêm khách hàng thành công! ID: ' + customerId };
  } catch (e) {
    return { success: false, message: 'Lỗi: ' + e.message };
  }
}

function updateCustomer(data) {
  try {
    var sheet = getSpreadsheet().getSheetByName(SHEET_CUSTOMERS);
    var rowIndex = parseInt(data.rowIndex);
    sheet.getRange(rowIndex, 2).setValue(data.customerName);
    sheet.getRange(rowIndex, 3).setValue(data.phone);
    sheet.getRange(rowIndex, 4).setValue(data.memberLevel);
    return { success: true, message: 'Cập nhật khách hàng thành công!' };
  } catch (e) {
    return { success: false, message: 'Lỗi: ' + e.message };
  }
}

function deleteCustomer(rowIndex) {
  try {
    var sheet = getSpreadsheet().getSheetByName(SHEET_CUSTOMERS);
    sheet.deleteRow(parseInt(rowIndex));
    return { success: true, message: 'Xóa khách hàng thành công!' };
  } catch (e) {
    return { success: false, message: 'Lỗi: ' + e.message };
  }
}

// ============================================
// PRODUCTS CRUD
// ============================================

function getProducts() {
  try {
    return getSheetData(SHEET_PRODUCTS);
  } catch (e) {
    throw new Error('Lỗi khi lấy danh sách sản phẩm: ' + e.message);
  }
}

function addProduct(data) {
  try {
    var sheet = getSpreadsheet().getSheetByName(SHEET_PRODUCTS);
    var productId = generateId('SP', SHEET_PRODUCTS);
    sheet.appendRow([productId, data.productName, parseFloat(data.price)]);
    return { success: true, message: 'Thêm sản phẩm thành công! ID: ' + productId };
  } catch (e) {
    return { success: false, message: 'Lỗi: ' + e.message };
  }
}

function updateProduct(data) {
  try {
    var sheet = getSpreadsheet().getSheetByName(SHEET_PRODUCTS);
    var rowIndex = parseInt(data.rowIndex);
    sheet.getRange(rowIndex, 2).setValue(data.productName);
    sheet.getRange(rowIndex, 3).setValue(parseFloat(data.price));
    return { success: true, message: 'Cập nhật sản phẩm thành công!' };
  } catch (e) {
    return { success: false, message: 'Lỗi: ' + e.message };
  }
}

function deleteProduct(rowIndex) {
  try {
    var sheet = getSpreadsheet().getSheetByName(SHEET_PRODUCTS);
    sheet.deleteRow(parseInt(rowIndex));
    return { success: true, message: 'Xóa sản phẩm thành công!' };
  } catch (e) {
    return { success: false, message: 'Lỗi: ' + e.message };
  }
}

// ============================================
// ORDERS
// ============================================

function getOrders() {
  try {
    var orders = getSheetData(SHEET_ORDERS);
    var customers = getSheetData(SHEET_CUSTOMERS);
    var products = getSheetData(SHEET_PRODUCTS);

    // Map customer and product names
    var customerMap = {};
    customers.forEach(function(c) {
      customerMap[c.Customer_ID] = c.Customer_Name;
    });
    var productMap = {};
    products.forEach(function(p) {
      productMap[p.Product_ID] = p.Product_Name;
    });

    orders.forEach(function(order) {
      order.Customer_Name = customerMap[order.Customer_ID] || order.Customer_ID;
      order.Product_Name = productMap[order.Product_ID] || order.Product_ID;
      // Format date
      if (order.Created_At instanceof Date) {
        order.Created_At_Display = Utilities.formatDate(order.Created_At, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
      } else {
        order.Created_At_Display = order.Created_At.toString();
      }
    });

    return orders;
  } catch (e) {
    throw new Error('Lỗi khi lấy danh sách đơn hàng: ' + e.message);
  }
}

function createOrder(data) {
  try {
    var sheet = getSpreadsheet().getSheetByName(SHEET_ORDERS);
    var orderId = generateId('DH', SHEET_ORDERS);

    // Get product price
    var products = getSheetData(SHEET_PRODUCTS);
    var product = null;
    for (var i = 0; i < products.length; i++) {
      if (products[i].Product_ID === data.productId) {
        product = products[i];
        break;
      }
    }
    if (!product) {
      return { success: false, message: 'Sản phẩm không tồn tại!' };
    }

    var quantity = parseInt(data.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return { success: false, message: 'Số lượng phải là số dương!' };
    }

    var totalAmount = parseFloat(product.Price) * quantity;
    var createdAt = new Date();
    var status = 'Mới';

    sheet.appendRow([orderId, data.customerId, data.productId, quantity, totalAmount, status, createdAt]);

    // Get customer name and product name for email
    var customers = getSheetData(SHEET_CUSTOMERS);
    var customerName = data.customerId;
    for (var j = 0; j < customers.length; j++) {
      if (customers[j].Customer_ID === data.customerId) {
        customerName = customers[j].Customer_Name;
        break;
      }
    }

    // Send notification email
    sendOrderNotification({
      orderId: orderId,
      customerName: customerName,
      productName: product.Product_Name,
      quantity: quantity,
      totalAmount: totalAmount,
      createdAt: Utilities.formatDate(createdAt, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss')
    });

    return {
      success: true,
      message: 'Tạo đơn hàng thành công! ID: ' + orderId + '. Email thông báo đã được gửi.'
    };
  } catch (e) {
    return { success: false, message: 'Lỗi khi tạo đơn hàng: ' + e.message };
  }
}

// ============================================
// EMAIL NOTIFICATION
// ============================================

function sendOrderNotification(orderInfo) {
  try {
    var departments = getSheetData(SHEET_DEPARTMENTS);
    var allEmails = [];

    departments.forEach(function(dept) {
      if (dept.Emails && dept.Emails.toString().trim() !== '') {
        var emails = dept.Emails.toString().split(',');
        emails.forEach(function(email) {
          var trimmed = email.trim();
          if (trimmed !== '' && allEmails.indexOf(trimmed) === -1) {
            allEmails.push(trimmed);
          }
        });
      }
    });

    if (allEmails.length === 0) {
      Logger.log('Không có email nào trong Departments để gửi thông báo.');
      return;
    }

    var subject = '📦 Đơn hàng mới: ' + orderInfo.orderId;

    var body = '══════════════════════════════════════\n';
    body += '       THÔNG BÁO ĐƠN HÀNG MỚI\n';
    body += '══════════════════════════════════════\n\n';
    body += '🆔 Mã đơn hàng  : ' + orderInfo.orderId + '\n';
    body += '👤 Khách hàng    : ' + orderInfo.customerName + '\n';
    body += '📦 Sản phẩm      : ' + orderInfo.productName + '\n';
    body += '🔢 Số lượng      : ' + orderInfo.quantity + '\n';
    body += '💰 Tổng tiền     : ' + formatCurrency(orderInfo.totalAmount) + '\n';
    body += '📅 Ngày tạo đơn  : ' + orderInfo.createdAt + '\n\n';
    body += '══════════════════════════════════════\n';
    body += 'Hệ thống Quản lý Đơn hàng - Tự động gửi\n';

    var htmlBody = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">';
    htmlBody += '<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:30px;text-align:center;border-radius:12px 12px 0 0;">';
    htmlBody += '<h1 style="color:#fff;margin:0;font-size:24px;">📦 ĐƠN HÀNG MỚI</h1>';
    htmlBody += '</div>';
    htmlBody += '<div style="background:#fff;padding:30px;border:1px solid #e0e0e0;">';
    htmlBody += '<table style="width:100%;border-collapse:collapse;">';
    htmlBody += '<tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;color:#555;">🆔 Mã đơn hàng</td><td style="padding:12px;border-bottom:1px solid #eee;color:#333;">' + orderInfo.orderId + '</td></tr>';
    htmlBody += '<tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;color:#555;">👤 Khách hàng</td><td style="padding:12px;border-bottom:1px solid #eee;color:#333;">' + orderInfo.customerName + '</td></tr>';
    htmlBody += '<tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;color:#555;">📦 Sản phẩm</td><td style="padding:12px;border-bottom:1px solid #eee;color:#333;">' + orderInfo.productName + '</td></tr>';
    htmlBody += '<tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;color:#555;">🔢 Số lượng</td><td style="padding:12px;border-bottom:1px solid #eee;color:#333;">' + orderInfo.quantity + '</td></tr>';
    htmlBody += '<tr><td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;color:#555;">💰 Tổng tiền</td><td style="padding:12px;border-bottom:1px solid #eee;color:#333;font-size:18px;font-weight:bold;color:#e74c3c;">' + formatCurrency(orderInfo.totalAmount) + '</td></tr>';
    htmlBody += '<tr><td style="padding:12px;font-weight:bold;color:#555;">📅 Ngày tạo</td><td style="padding:12px;color:#333;">' + orderInfo.createdAt + '</td></tr>';
    htmlBody += '</table>';
    htmlBody += '</div>';
    htmlBody += '<div style="background:#f8f9fa;padding:15px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e0e0e0;border-top:none;">';
    htmlBody += '<p style="margin:0;color:#888;font-size:12px;">Hệ thống Quản lý Đơn hàng - Email tự động</p>';
    htmlBody += '</div>';
    htmlBody += '</div>';

    allEmails.forEach(function(email) {
      try {
        MailApp.sendEmail({
          to: email,
          subject: subject,
          body: body,
          htmlBody: htmlBody
        });
        Logger.log('Đã gửi email tới: ' + email);
      } catch (mailError) {
        Logger.log('Lỗi gửi email tới ' + email + ': ' + mailError.message);
      }
    });

  } catch (e) {
    Logger.log('Lỗi trong sendOrderNotification: ' + e.message);
  }
}

// ---- FORMAT HELPER ----

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// ---- DATA FOR ORDER FORM ----

function getOrderFormData() {
  try {
    var customers = getSheetData(SHEET_CUSTOMERS);
    var products = getSheetData(SHEET_PRODUCTS);
    return {
      customers: customers,
      products: products
    };
  } catch (e) {
    throw new Error('Lỗi khi lấy dữ liệu form đơn hàng: ' + e.message);
  }
}
