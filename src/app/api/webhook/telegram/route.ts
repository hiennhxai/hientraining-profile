import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if it's a callback query (button click)
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const data = callbackQuery.data;
      const chatId = callbackQuery.message.chat.id;
      const messageId = callbackQuery.message.message_id;
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

      let responseText = '';

      if (data.startsWith('approve_')) {
        const phone = data.replace('approve_', '');
        const text = callbackQuery.message.text || '';
        
        // Parse the text to find if there is a booking
        const dateMatch = text.match(/Lịch hẹn:\s*([0-9\-]+)\s*lúc\s*([0-9:]+)/);
        const nameMatch = text.match(/Khách hàng:\s*(.+)/);
        const emailMatch = text.match(/Email:\s*(.+)/);
        const typeMatch = text.match(/Hình thức:\s*(Online|Offline)/i);
        const locMatch = text.match(/Hình thức:\s*Offline\s*\((.+)\)/i);

        if (dateMatch && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
          try {
            const bookingDate = dateMatch[1].trim();
            const bookingTime = dateMatch[2].trim();
            const clientName = nameMatch ? nameMatch[1].trim() : 'Khách';
            let clientEmail = emailMatch ? emailMatch[1].trim() : '';
            if (clientEmail === 'N/A') clientEmail = '';
            const meetingType = typeMatch ? typeMatch[1] : 'Online';
            const location = locMatch ? locMatch[1].trim() : (meetingType === 'Offline' ? 'Tại Studio' : 'Google Meet');

            const auth = new JWT({
              email: process.env.GOOGLE_CLIENT_EMAIL,
              key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
              scopes: ['https://www.googleapis.com/auth/calendar'],
            });
            const calendar = google.calendar({ version: 'v3', auth: auth as any });
            
            const startDateTime = new Date(`${bookingDate}T${bookingTime}:00+07:00`);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
            
            const eventBody: any = {
              summary: `Tư vấn - ${clientName}`,
              description: text,
              start: { dateTime: startDateTime.toISOString() },
              end: { dateTime: endDateTime.toISOString() },
              attendees: clientEmail ? [{ email: clientEmail }] : [],
              location: meetingType === 'Offline' ? location : undefined,
            };

            if (meetingType === 'Online') {
              eventBody.conferenceData = {
                createRequest: { 
                  requestId: `${Date.now()}_${phone.replace(/\\D/g, '')}`,
                  conferenceSolutionKey: { type: 'hangoutsMeet' } 
                }
              };
            }

            const res = await calendar.events.insert({
              calendarId: 'xuanhien.info@gmail.com',
              requestBody: eventBody,
              conferenceDataVersion: 1
            });
            
            const event = res.data;
            const hangoutLink = event.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri;
            
            responseText = `✅ Đã phê duyệt! Lịch đã tạo trên Google Calendar.`;
            if (hangoutLink) responseText += `\n🔗 Meet: ${hangoutLink}`;
            
            // Send Email 2
            if (clientEmail && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
              });
              
              const meetHtml = hangoutLink ? `\n<p><strong>Link Google Meet:</strong> <a href="${hangoutLink}">${hangoutLink}</a></p>` : (meetingType === 'Offline' ? `\n<p><strong>Địa điểm:</strong> ${location}</p>` : '');
              
              await transporter.sendMail({
                from: `"Hiến Training" <${process.env.SMTP_EMAIL}>`,
                to: clientEmail,
                subject: 'Xác nhận Yêu cầu Đặt lịch - Hiến Training',
                html: `
                  <div style="font-family: sans-serif; color: #333;">
                    <h2 style="color: #ea580c;">Xác nhận cuộc hẹn</h2>
                    <p>Cảm ơn bạn đã đặt lịch hẹn tại <strong>hientraining.com</strong>.</p>
                    <p>Yêu cầu tư vấn của bạn đã được phê duyệt thành công.</p>
                    <p><strong>Thời gian:</strong> ${new Date(event.start?.dateTime as string).toLocaleString('vi-VN')}</p>
                    ${meetHtml}
                    <p>Đội ngũ Hiến Training sẽ gặp bạn đúng giờ nhé.</p>
                  </div>
                `,
              });
            }
          } catch (e) {
            console.error('Google API Error in Webhook:', e);
            responseText = `⚠️ Lỗi khi tạo Google Calendar.`;
          }
        } else {
          responseText = `✅ Đã phê duyệt tư vấn cho SĐT: ${phone}`;
        }
      } else if (data.startsWith('reject_')) {
        const phone = data.replace('reject_', '');
        const text = callbackQuery.message.text || '';
        const emailMatch = text.match(/Email:\s*(.+)/);
        let clientEmail = emailMatch ? emailMatch[1].trim() : '';
        if (clientEmail === 'N/A') clientEmail = '';

        responseText = `❌ Đã bỏ qua khách SĐT: ${phone}`;

        // Send Email 3 (Rejection)
        if (clientEmail && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
          try {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
            });
            
            await transporter.sendMail({
              from: `"Hiến Training" <${process.env.SMTP_EMAIL}>`,
              to: clientEmail,
              subject: 'Phản hồi Yêu cầu Đặt lịch - Hiến Training',
              html: `
                <div style="font-family: sans-serif; color: #333;">
                  <h2 style="color: #ea580c;">Phản hồi đặt lịch</h2>
                  <p>Cảm ơn bạn đã đặt lịch hẹn tại <strong>hientraining.com</strong>.</p>
                  <p>Rất xin lỗi bạn, hiện tại khung giờ bạn đã chọn chúng tôi không thể xác nhận được do lịch trình bị trùng đột xuất.</p>
                  <p>Đội ngũ Hiến Training sẽ chủ động liên hệ lại với bạn qua số điện thoại sớm nhất để trao đổi thêm thông tin và sắp xếp một lịch hẹn phù hợp khác nhé.</p>
                  <p>Trân trọng,<br/><strong>Hiến Training</strong></p>
                </div>
              `,
            });
            responseText += `\n📧 Đã gửi email báo hủy cho khách.`;
          } catch (e) {
            console.error('Email Error in Webhook Reject:', e);
            responseText += `\n⚠️ Lỗi khi gửi email báo hủy.`;
          }
        }
      }

      // Update the message to remove the buttons and show the result
      if (telegramBotToken && responseText) {
        const editMessageUrl = `https://api.telegram.org/bot${telegramBotToken}/editMessageText`;
        await fetch(editMessageUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            text: callbackQuery.message.text + `\n\n<b>Trạng thái:</b> ${responseText}`,
            parse_mode: 'HTML',
          }),
        });

        // Answer the callback query to remove loading state
        const answerCallbackUrl = `https://api.telegram.org/bot${telegramBotToken}/answerCallbackQuery`;
        await fetch(answerCallbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: responseText,
          }),
        });
      }
    }

    // Handle normal messages
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text;
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

      if (text === '/start' && telegramBotToken) {
        const sendMessageUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        await fetch(sendMessageUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `Xin chào MC Xuân Hiến! Hệ thống Bot đã sẵn sàng nhận lệnh.\n\n<b>CHAT ID của anh là:</b> <code>${chatId}</code>\n\nHãy copy Chat ID này dán vào biến TELEGRAM_CHAT_ID trong file .env.local nhé!`,
            parse_mode: 'HTML',
          }),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
