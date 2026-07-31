# WEB CHAT APP

## Chức năng chính

| Mã  | Chức năng                 | Mô tả                                                                                                                |
| --- | ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| F01 | Nhắn tin riêng tư (1-1)   | Cho phép 2 người dùng trao đổi tin nhắn trực tiếp với nhau                                                           |
| F02 | Nhắn tin nhóm             | Cho phép nhiều người dùng trò chuyện chung trong một nhóm                                                            |
| F03 | Gửi tệp đính kèm          | Cho phép gửi kèm hình ảnh, tài liệu, hoặc ghi âm/gửi file audio (mp3/mp4) trong tin nhắn                             |
| F04 | Trả lời tin nhắn          | Cho phép phản hồi trực tiếp một tin nhắn cụ thể (của bản thân hoặc người khác), giữ ngữ cảnh hội thoại               |
| F05 | Thu hồi tin nhắn          | Cho phép người dùng thu hồi (gỡ) tin nhắn đã gửi                                                                     |
| F06 | Trạng thái online/offline | Hiển thị trạng thái kết nối hiện tại của người dùng (đang hoạt động/ngoại tuyến) theo thời gian thực                 |
| F07 | Gửi lời mời kết bạn       | Cho phép người dùng gửi yêu cầu kết bạn đến người dùng khác, người được mời có thể đồng ý hoặc từ chối               |
| F08 | Hủy kết bạn               | Cho phép người dùng gỡ bỏ mối quan hệ bạn bè đã thiết lập trước đó với người khác                                    |
| F09 | Quản lý nhóm trò chuyện   | Cho phép tạo nhóm mới, chỉnh sửa thông tin nhóm, quản lý thành viên và phân quyền theo chức vụ trong nhóm trò chuyện |

## Chức vụ trong nhóm trò chuyện

| Hành động          | Owner | Admin | Member |
| ------------------ | :---: | :---: | :----: |
| Đổi tên nhóm       |  ✅   |  ✅   |   ❌   |
| Đổi ảnh nhóm       |  ✅   |  ✅   |   ❌   |
| Thêm thành viên    |  ✅   |  ✅   |   ❌   |
| Xóa thành viên     |  ✅   |  ✅   |   ❌   |
| Bổ nhiệm Admin     |  ✅   |  ❌   |   ❌   |
| Gỡ quyền Admin     |  ✅   |  ❌   |   ❌   |
| Chuyển quyền Owner |  ✅   |  ❌   |   ❌   |
| Xóa nhóm           |  ✅   |  ❌   |   ❌   |

## Quy tắc trả về API cho tin nhắn

| #   | Rule                                              | Mô tả                                                                                                                                                                                                            |
| --- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Tin nhắn thường                                   | Phải có ít nhất một trong hai: `content` hoặc `attachments`. Không được để cả hai cùng rỗng, trừ khi tin nhắn đã bị thu hồi.                                                                                     |
| 2   | Tin nhắn bị thu hồi (`is_recalled: true`)         | Không trả về `content` và `attachments`. Response chỉ giữ các metadata như `message_id`, `sender_id`, `conversation_id`, `created_at`,...                                                                        |
| 3   | `reply_message` là snapshot độc lập               | `reply_message` lưu dữ liệu của tin nhắn gốc tại thời điểm gửi reply, không tham chiếu trực tiếp đến tin nhắn gốc. Nếu tin gốc bị thu hồi hoặc thay đổi sau đó thì dữ liệu trong `reply_message` vẫn giữ nguyên. |
| 4   | Reply vào tin đã thu hồi trước khi reply được tạo | `reply_message` chỉ còn `message_id` và `sender_name`. Không có `content` hoặc `attachments` vì tại thời điểm reply, dữ liệu gốc đã không còn.                                                                   |
| 5   | Reply vào tin đã bị xoá hẳn                       | `reply_message` chỉ còn `message_id`. `sender_name`, `content` và `attachments` đều không có vì tin nhắn gốc không còn tồn tại trong hệ thống.                                                                   |
| 6   | `seen_by`                                         | Chỉ chứa danh sách người khác người gửi đã xem tin nhắn. Nếu chưa ai xem thì trả về mảng rỗng (`[]`).                                                                                                            |
| 7   | `is_seen`                                         | `true` khi có ít nhất một người khác người gửi đã xem tin nhắn. Khi `is_seen = true` thì `seen_by` nên có ít nhất một phần tử.                                                                                   |
