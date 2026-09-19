import { NextResponse } from 'next/server';

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
        responseText = `✅ Đã phê duyệt tư vấn cho SĐT: ${phone}`;
        // Here we will later trigger Phase 3: Google Calendar + Meet creation
      } else if (data.startsWith('reject_')) {
        const phone = data.replace('reject_', '');
        responseText = `❌ Đã bỏ qua khách SĐT: ${phone}`;
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

    // Handle normal messages (like /start to get chat ID)
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
