import { CourseItem } from '../types';

export const coursesData: CourseItem[] = [
  {
    id: 'setup-livestream',
    code: 'CRS.01',
    title: 'Kỹ Thuật Setup Live Stream',
    subtitle: 'Build thiết bị & Setup Studio Livestream chuyên nghiệp từ A → Z',
    formatOffline: 'Offline 1-1 tại Studio Giảng Viên (Nhấp để xem địa chỉ)',
    formatOnline: 'Online 1:1 qua Google Meet/Zoom (Dành cho học viên bận rộn hoặc phần lý thuyết)',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '5 đến 6 buổi (Tùy thực lực học viên)',
    badge: 'Kỹ thuật Studio & OBS/Vmix',
    bgImage: '/images/covers/thumb_course_1.png',
    bannerImage: '/images/covers/course_banner_1.png',
    thumbnailUrl: '/images/covers/thumb_course_1.png',
                            lessons: [
      {
        lessonTitle: 'BÀI 1: Thiết bị & Kết nối cơ bản',
        points: [
          'Setup tiêu chuẩn 1 phòng livestream',
          'Tìm hiểu về các thiết bị livestream cơ bản từ điện thoại cho đến camera chuyên nghiệp',
          'Kết nối thiết bị và kỹ thuật truyền dẫn hình ảnh',
          'Tìm hiểu thông số tiêu chuẩn của máy livestream',
          'Setup buổi livestream cơ bản'
        ]
      },
      {
        lessonTitle: 'BÀI 2: Bố cục, Ánh sáng & Nền tảng Live',
        points: [
          'Setup không gian live từ A đến Z',
          'Setup ánh sáng livestream (hướng sáng, nguồn sáng, góc đèn)',
          'Setup bố cục live stream và bố cục sản phẩm khi lên live',
          'Tìm hiểu về phần mềm live OBS với các nền tảng Facebook, Shopee, TikTok...',
          'Hướng dẫn kết nối cơ bản với nền tảng bán hàng'
        ]
      },
      {
        lessonTitle: 'BÀI 3: OBS Nâng cao, Canva Pro & Multi-Cam',
        points: [
          'Hướng dẫn sử dụng OBS từ A đến Z với các thông số tiêu chuẩn',
          'Học viên tự setup 1 buổi live cơ bản',
          'Hướng dẫn thiết kế nhanh với Canva Pro để livestream thương hiệu',
          'Hướng dẫn setup live stream chuyên nghiệp với bàn trộn và nhiều máy quay'
        ]
      },
      {
        lessonTitle: 'BÀI 4: Bàn Trộn Âm Thanh & Backup Tình Huống',
        points: [
          'Hướng dẫn sử dụng bàn trộn cơ bản và cách kết nối âm thanh đa dạng thiết bị vào bàn trộn hoặc máy tính',
          'Các phương án backup, xử lý tình huống sự cố cơ bản khi setup và trong khi live'
        ]
      },
      {
        lessonTitle: 'BÀI 5: Vmix Chuyên Nghiệp & Thực Hành Tổng Ôn',
        points: [
          'Hướng dẫn sử dụng phần mềm Vmix cơ bản',
          'Học viên thực hành setup và vận hành live trực tiếp trên Vmix'
        ]
      }
    ]
  },
  {
    id: 'ban-hang-livestream',
    code: 'CRS.02',
    title: 'Kỹ Năng - Bán Hàng Live Stream',
    subtitle: 'Trở thành người bán hàng "Đa Nhân Cách" tự tin trước ống kính',
    formatOffline: 'Offline 1-1 tại Studio Giảng Viên',
    formatOnline: 'Online 1:1 qua Google Meet/Zoom',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '5 buổi thực chiến',
    badge: 'Kịch bản & Bán hàng',
    bgImage: '/images/covers/thumb_course_2.png',
    bannerImage: '/images/covers/course_banner_2.png',
    thumbnailUrl: '/images/covers/thumb_course_2.png',
                            lessons: [
      {
        lessonTitle: 'BÀI 1: Tổng Quan & Tâm Lý Bán Hàng Online',
        points: [
          'Tổng quan về livestream & So sánh sự khác biệt giữa các nền tảng (TikTok, FB, Shopee)',
          'Định vị "Bạn là ai?" trong mắt khán giả',
          'Tâm lý bán hàng online & Giải mã rào cản sợ ống kính',
          'Phân tích điểm tự tin & thiếu tự tin của bản thân',
          'Phân tích tâm lý cá nhân giúp bạn tự tin vào bản thân'
        ]
      },
      {
        lessonTitle: 'BÀI 2: Chân Dung Khách Hàng & Xây Dựng Câu Chuyện',
        points: [
          'Phân tích người mua (Chân dung KH) dựa trên sản phẩm của bạn',
          'Kết nối bản thân với KH thông qua các thông tin đã nắm bắt',
          'Câu chuyện về ai đó sử dụng sản phẩm',
          'Trải nghiệm bản thân với sản phẩm',
          'Kiến thức xã hội liên quan đến sản phẩm & Kết nối kỹ năng giải trí của bản thân'
        ]
      },
      {
        lessonTitle: 'BÀI 3 - 4: Xây Dựng Kịch Bản Live Thu Hút',
        points: [
          'Các yếu tố thu hút khách hàng xem livestream ngay 3 giây đầu',
          'Kịch bản livestream chuẩn cho mọi phiên live',
          'Phân tích cấu trúc phiên live bán hàng thành công',
          'Setup phiên live & Kỹ thuật Demo sản phẩm trực tiếp'
        ]
      },
      {
        lessonTitle: 'BÀI 5: Lên Kịch Bản Live - Thực Hành Trực Tiếp',
        points: [
          'Hướng dẫn lên 2 kịch bản livestream thực tế cho sản phẩm của bạn',
          'Thực hành setup phiên live trên nền tảng cá nhân dưới sự cố vấn 1-1'
        ]
      }
    ]
  },
  {
    id: 'long-tieng-quang-cao',
    code: 'CRS.03',
    title: 'Kỹ Năng - Lồng Tiếng Quảng Cáo / Giọng Nói Hay',
    subtitle: 'Sức mạnh giọng nói — "Kiếm tiền bằng thanh âm"',
    formatOffline: 'Offline 1-1 (Free bán kính 5km / Tại Studio / Quán Cafe)',
    formatOnline: 'Online 1:1',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '11 - 12 buổi',
    badge: 'Luyện Giọng & Voice Talent',
    bgImage: '/images/covers/thumb_course_3.png',
    bannerImage: '/images/covers/course_banner_3.png',
    thumbnailUrl: '/images/covers/thumb_course_3.png',
                lessons: [
      {
        lessonTitle: 'Bài 1: Khám Giọng & Định Hướng Phát Triển (1 buổi)',
        points: ['Kiểm tra chất giọng hiện tại', 'Nhận diện điểm mạnh, điểm yếu', 'Định hướng phong cách lồng tiếng phù hợp']
      },
      {
        lessonTitle: 'Bài 2: Tập Luyện Hơi Thở & Giọng Nói (5 buổi)',
        points: [
          'Tập hơi thở bụng sâu và bền',
          'Học khẩu hình miệng chuẩn',
          'Tập luyện phát âm, giọng nói tròn và vang',
          'Kỹ thuật kiểm soát tốc độ nói và ngữ điệu'
        ]
      },
      {
        lessonTitle: 'Bài 3: Các Thể Loại Lồng Tiếng Quảng Cáo (3-4 buổi)',
        points: [
          'Kể chuyện truyền cảm',
          'Các kiểu đọc quảng cáo TVC, viral, chương trình',
          'Kỹ thuật đưa cảm xúc và hồn vào giọng đọc'
        ]
      },
      {
        lessonTitle: 'Bài 4: Phần Mềm & Thiết Bị Thu Âm (1 buổi)',
        points: ['Tìm hiểu và lựa chọn thiết bị thu âm cá nhân', 'Sử dụng phần mềm thu âm và xử lý cơ bản']
      },
      {
        lessonTitle: 'Bài 5: Quy Trình Sản Xuất Audio (1 buổi)',
        points: ['Quy trình biên tập, xử lý tiếng ồn và xuất file audio chất lượng cao']
      }
    ]
  },
  {
    id: 'dan-chuong-trinh-mc',
    code: 'CRS.04',
    title: 'Kỹ Năng - Dẫn Chương Trình (MC)',
    subtitle: '"Quản Trị Sự Tự Tin" trước đám đông & Sân khấu chuyên nghiệp',
    formatOffline: 'Offline 1-1 (Tại Studio / Nhà Học Viên / Cafe Share)',
    formatOnline: 'Online 1:1',
    feeNotice: 'Liên hệ tư vấn & báo phí qua SĐT: 0813.13.13.85',
    duration: '15 - 18 buổi',
    badge: 'Nghề MC & Kỹ Năng Sân Khấu',
    bgImage: '/images/covers/thumb_course_4.png',
    bannerImage: '/images/covers/course_banner_4.png',
    thumbnailUrl: '/images/covers/thumb_course_4.png',
                lessons: [
      {
        lessonTitle: 'Bài 1: Tư Vấn & Định Hướng - Mind Map Cá Nhân (1 buổi)',
        points: ['Xây dựng bản đồ tư duy sự nghiệp MC', 'Phân tích mục tiêu cá nhân']
      },
      {
        lessonTitle: 'Bài 2: Định Hình Phong Cách Cá Nhân (1 buổi)',
        points: ['Tìm kiếm phong cách riêng phù hợp với ngoại hình và tính cách']
      },
      {
        lessonTitle: 'Bài 3: Xây Dựng Hình Ảnh Offline & Online (1 buổi)',
        points: ['Thời trang sân khấu, kiểu tóc, style trang phục và nhân hiệu số']
      },
      {
        lessonTitle: 'Bài 4: Phong Thái & Di Chuyển Sân Khấu (1 buổi)',
        points: ['Tập luyện phong thái đứng, đi lại, ngôn ngữ cơ thể trên sân khấu']
      },
      {
        lessonTitle: 'Bài 5: Tập Luyện Hơi Thở & Giọng Nói MC (4 buổi)',
        points: ['Luyện hơi thở sâu, lực giọng sân khấu, khả năng phát âm chuẩn']
      },
      {
        lessonTitle: 'Bài 6: Các Thể Loại Dẫn Chương Trình (5-6 buổi)',
        points: [
          'Event: Hội nghị, ra mắt sản phẩm...',
          'Talk show chuyên sâu',
          'Teambuilding & Sự kiện ngoài trời',
          'Dẫn tin tức truyền hình',
          'Dẫn chuyện truyền cảm'
        ]
      },
      {
        lessonTitle: 'Bài 7: Kỹ Năng Nghề MC & Xử Lý Tình Huống (2-4 buổi)',
        points: ['Xây dựng kịch bản MC chuyên nghiệp', 'Xử lý sự cố sân khấu linh hoạt', 'Kiến thức về tổ chức sự kiện']
      }
    ]
  }
];
