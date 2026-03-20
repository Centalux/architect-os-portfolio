---
name: tao-tin-nhan-zalo
description: "Soạn thảo tin nhắn Zalo chuyên nghiệp. Ngoại lệ: Được phép sử dụng duy nhất một icon nhỏ ở tiêu đề để tạo sự chú ý, nhưng vẫn tuân thủ định dạng đặc biệt cho Tiêu đề, Kính gửi, Thời gian và Các chỉ mục."
---

# Zalo Message Composer (Soạn tin nhắn Zalo)

## Giới thiệu

Skill này giúp soạn thảo tin nhắn tối ưu cho Zalo PC, tập trung vào tính chuyên nghiệp, cấu trúc rõ ràng và dễ copy. Output là tin nhắn có định dạng markdown (in đậm, in nghiêng, gạch chân) để người dùng dễ dàng copy và paste.

## Nguyên tắc định dạng chuẩn

BẮT BUỘC tuân thủ chặt chẽ cấu trúc format sau:

1. **Tiêu đề chính**: Phải có một Icon nhỏ đứng đầu, tiếp theo là phần Tiêu Đề được **in đậm** và [đặt trong ngoặc vuông].
   - _Mẫu:_ `[Icon] **[THÔNG BÁO GO-LIVE / RA MẮT]**`
2. **Kính gửi (Người nhận)**: Từ "Kính gửi:" in nghiêng, tên nhóm người nhận in đậm.
   - _Mẫu:_ `_Kính gửi:_ **Toàn thể nhân viên**`
3. **Thời gian**: Nhãn thời gian kết hợp in nghiêng, còn nội dung thời gian cụ thể thì in đậm.
   - _Mẫu:_ `_Thời gian áp dụng:_ **08:00, Thứ Hai 10/02/2026**`
4. **Các chỉ mục / Đề mục con**: Phải được in đậm để phân chia rõ ràng các phần.
   - _Mẫu:_ `**Nội dung chương trình đào tạo:**` hoặc `**Yêu cầu chuẩn bị:**`

### Lưu ý quan trọng về Zalo PC:

- Khi paste vào Zalo PC ở chế độ "Chỉnh văn bản", mỗi lần Enter sẽ tạo khoảng cách lớn
- Khuyến nghị: Dùng **Shift + Enter** để xuống dòng gần nhau hơn
- Hoặc: Tắt chế độ chỉnh văn bản, paste text thuần, rồi format thủ công

## Bộ Header Thường Dùng (Văn bản có Icon)

- [Icon] **[THÔNG BÁO GO-LIVE / RA MẮT]**
- [Icon] **[THƯ MỜI HỌP]**
- [Icon] **[BÁO CÁO TIẾN ĐỘ]**
- [Icon] **[NHẮC NHỞ]**
- [Icon] **[CẢNH BÁO / KHẨN CẤP]**
- [Icon] **[THÔNG BÁO CHUNG]**
- [Icon] **[HOÀN THÀNH / CHỐT]**
- [Icon] **[LỊCH HỌC / ĐÀO TẠO]**

## Hướng dẫn sử dụng cho Agent

### Step 1: Phân tích yêu cầu

- Xác định loại tin nhắn (Họp, Báo cáo, Thông báo, Nhắc nhở, Cảnh báo, Lịch học)
- Trích xuất thông tin: Thời gian, Người liên quan, Nội dung, Hành động

### Step 2: Soạn tin nhắn trực tiếp

**QUAN TRỌNG - Output format:**

1. **KHÔNG** đặt tin nhắn trong code block
2. **BẮT BUỘC** áp dụng chính xác các quy tắc định dạng (Tiêu đề, Kính gửi, Thời gian, Mục con) đã nêu ở phần `Nguyên tắc định dạng chuẩn`.
3. Viết tin nhắn trực tiếp để người dùng copy luôn.

### Step 3: Thêm hướng dẫn ngắn (nếu cần)

Chỉ thêm hướng dẫn khi có định dạng đặc biệt cần lưu ý.

## Ví dụ Output

### Ví dụ 1: Thông báo lịch học

🎓 **[THÔNG BÁO LỊCH HỌC AI CHAMPION]**

_Kính gửi:_ **Các thành viên nhóm AI Champion**

_Thời gian:_ **19:00 - 21:00, Thứ Sáu 06/02/2026**

**Nội dung buổi học:**

- Ôn tập và thực hành công cụ AI
- Chia sẻ kinh nghiệm triển khai thực tế
- Giải đáp thắc mắc và hỗ trợ kỹ thuật

**Chuẩn bị:**

1. Đăng nhập sẵn tài khoản AI Platform
2. Chuẩn bị câu hỏi/case study muốn thảo luận

_Lưu ý: Vui lòng react tin nhắn để xác nhận tham dự._

**>> Liên hệ hỗ trợ: 0901.xxx.xxx**

### Ví dụ 2: Thư mời họp

🤝 **[THƯ MỜI HỌP: Review Dự Án ABC]**

_Kính gửi:_ **Team Dự Án ABC**

_Thời gian:_ **14:00 - 15:30, Thứ Hai 10/02/2026**
_Địa điểm:_ **Phòng họp A3 / Google Meet**

**Nội dung:**

- Review tiến độ Sprint 5
- Demo tính năng mới
- Lập kế hoạch Sprint 6

_Lưu ý: Vui lòng chuẩn bị báo cáo cá nhân trước buổi họp._

**>> Xác nhận tham dự trước 17:00 hôm nay.**

### Ví dụ 3: Nhắc nhở deadline

⚠️ **[NHẮC NHỞ: Hạn Nộp Báo Cáo Tháng]**

_Deadline nộp bài báo cáo:_ **17:00 hôm nay (05/02/2026)**

**Các bạn chưa nộp:**

1. Nguyễn Văn A - Phòng Kỹ thuật
2. Trần Thị B - Phòng Kinh doanh
3. Lê Văn C - Phòng Marketing

_Vui lòng nộp báo cáo qua link Google Drive dự án._

**>> Liên hệ ngay nếu cần hỗ trợ: 0901.xxx.xxx**

### Ví dụ 4: Thông báo Go-live

🚀 **[THÔNG BÁO GO-LIVE: Hệ Thống CRM Mới]**

_Kính gửi:_ **Toàn thể nhân viên**

_Thời gian áp dụng:_ **08:00, Thứ Hai 10/02/2026**

**Thay đổi chính:**

- Giao diện mới, thân thiện hơn
- Tích hợp AI hỗ trợ tìm kiếm
- Đồng bộ realtime với hệ thống kế toán

**Hành động cần làm:**

1. Đổi mật khẩu lần đầu đăng nhập
2. Cập nhật thông tin cá nhân
3. Hoàn thành khóa training online (30 phút)

_Tài liệu hướng dẫn: Link Google Doc_

**>> Liên hệ IT Support nếu gặp sự cố: hotline 1900.xxxx**

## Nguyên tắc quan trọng

1. **Direct Output:** Viết tin nhắn trực tiếp, KHÔNG dùng code block.
2. **Smart Formatting:** Dùng in đậm/nghiêng/list phù hợp và ĐÚNG CHUẨN ĐỊNH DẠNG TỪNG PHẦN.
3. **Smart Icon:** Chỉ sử dụng duy nhất một icon ở ngay trước tiêu đề chính, các phần khác tuyệt đối không sử dụng icon để giữ tính chuyên nghiệp.
4. **Professional Tone:** Giọng văn chuyên nghiệp, ngắn gọn.
5. **Vietnamese:** Luôn sử dụng tiếng Việt có dấu.
6. **Shift+Enter Tip:** Nhắc người dùng dùng Shift+Enter khi paste vào Zalo nếu cần.
