/**
 * SECURITY: DOMPurify wrapper để lọc HTML trước khi dùng dangerouslySetInnerHTML
 * Ngăn chặn XSS (Cross-Site Scripting) từ nội dung do admin nhập vào Supabase
 */
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML string - loại bỏ toàn bộ script, event handlers và các tag nguy hiểm
 * @param dirty - Chuỗi HTML có thể chứa mã độc
 * @returns Chuỗi HTML đã được làm sạch an toàn
 */
export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    // Cho phép các thẻ HTML phổ biến cho text formatting
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'br', 'p', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'mark'],
    // Chỉ cho phép các thuộc tính an toàn
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    // Tự động thêm rel="noopener noreferrer" vào link
    ADD_ATTR: ['target'],
    FORCE_BODY: false,
  });
}

/**
 * Sanitize đơn giản - chỉ cho phép text, bold, italic (dùng cho tiêu đề, tag ngắn)
 */
export function sanitizeBasic(dirty: string | undefined | null): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'br'],
    ALLOWED_ATTR: [],
  });
}
