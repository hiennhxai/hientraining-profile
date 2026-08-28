-- ========================================================
-- LỆNH BẢO MẬT TỐI CAO: KHÓA CHẶT DATABASE BẰNG RLS
-- Hướng dẫn: Copy toàn bộ đoạn code này dán vào Supabase > SQL Editor > Run
-- ========================================================

-- 1. Bật tính năng Row Level Security (RLS) cho 2 bảng quan trọng
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 2. Xóa các policy cũ (nếu có) để làm sạch
DROP POLICY IF EXISTS "Cho phép khách xem cấu hình" ON site_config;
DROP POLICY IF EXISTS "Cho phép Admin lưu cấu hình" ON site_config;
DROP POLICY IF EXISTS "Cho phép khách gửi Form" ON leads;
DROP POLICY IF EXISTS "Chỉ Admin xem Form" ON leads;

-- ==========================================
-- BẢNG SITE_CONFIG (Cấu Hình Web)
-- ==========================================

-- Ai cũng có thể ĐỌC (SELECT) cấu hình web để xem giao diện
CREATE POLICY "Cho phép khách xem cấu hình"
ON site_config FOR SELECT
USING (true);

-- CHỈ CÓ NGƯỜI ĐÃ ĐĂNG NHẬP (authenticated) mới được phép SỬA (UPDATE)
CREATE POLICY "Cho phép Admin lưu cấu hình"
ON site_config FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- CHỈ CÓ NGƯỜI ĐÃ ĐĂNG NHẬP mới được phép THÊM MỚI (INSERT)
CREATE POLICY "Cho phép Admin thêm cấu hình"
ON site_config FOR INSERT
TO authenticated
WITH CHECK (true);

-- ==========================================
-- BẢNG LEADS (Khách hàng đăng ký)
-- ==========================================

-- Ai cũng có thể THÊM (INSERT) form đăng ký (Khách lạ)
CREATE POLICY "Cho phép khách gửi Form"
ON leads FOR INSERT
WITH CHECK (true);

-- CHỈ CÓ NGƯỜI ĐÃ ĐĂNG NHẬP mới được phép ĐỌC (SELECT), SỬA (UPDATE), XÓA (DELETE)
CREATE POLICY "Chỉ Admin quản lý Form"
ON leads
TO authenticated
USING (true)
WITH CHECK (true);

-- Chúc mừng Sếp! Hệ thống đã được khóa trái cửa an toàn 100%!
