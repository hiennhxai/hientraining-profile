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
        const id = data.replace('approve_', '');
        
        // If it looks like a Google Event ID (contains letters)
        if (/[a-zA-Z]/.test(id) && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
          try {
            const auth = new JWT({
              email: process.env.GOOGLE_CLIENT_EMAIL,
              key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
              scopes: ['https://www.googleapis.com/auth/calendar'],
            });
            const calendar = google.calendar({ version: 'v3', auth: auth as any });
            
            // Get the event
            const eventRes = await calendar.events.get({
              calendarId: 'xuanhien.info@gmail.com',
              eventId: id
            });
            const event = eventRes.data;
            
            // Update summary
            event.summary = (event.summary || '').replace('[CHỜ XÁC NHẬN] ', '');
            
            await calendar.events.update({
              calendarId: 'xuanhien.info@gmail.com',
              eventId: id,
              requestBody: event
            });
            
            const hangoutLink = event.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri;
            const clientEmail = event.attendees?.[0]?.email;
            
            responseText = `✅ Đã phê duyệt! Lịch đã chốt trên Google Calendar.`;
            if (hangoutLink) responseText += `\n🔗 Meet: ${hangoutLink}`;
            
            // Send Email 2
            if (clientEmail && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
              });
              
              const meetHtml = hangoutLink ? `\n<p><strong>Link Google Meet:</strong> <a href="${hangoutLink}">${hangoutLink}</a></p>` : '';
              
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
            responseText = `⚠️ Đã duyệt trên Telegram nhưng có lỗi khi update Google Calendar.`;
          }
        } else {
          responseText = `✅ Đã phê duyệt tư vấn cho SĐT: ${id}`;
        }
      } else if (data.startsWith('reject_')) {
        const id = data.replace('reject_', '');
        if (/[a-zA-Z]/.test(id) && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
          try {
            const auth = new JWT({
              email: process.env.GOOGLE_CLIENT_EMAIL,
              key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
              scopes: ['https://www.googleapis.com/auth/calendar'],
            });
            const calendar = google.calendar({ version: 'v3', auth: auth as any });
            
            await calendar.events.delete({
              calendarId: 'xuanhien.info@gmail.com',
              eventId: id
            });
            responseText = `❌ Đã từ chối và xóa lịch chờ.`;
          } catch (e) {
            console.error('Delete Event Error:', e);
            responseText = `❌ Đã bỏ qua, nhưng lỗi khi xóa Calendar.`;
          }
        } else {
          responseText = `❌ Đã bỏ qua khách SĐT: ${id}`;
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
