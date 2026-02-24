const TelegramBot = require('node-telegram-bot-api');

const token = "8612845950:AAGb8-sgRn0nd5gXLxlGreVxTU7P5Kk6bu8";

const bot = new TelegramBot(token, { polling: true });

console.log("Bot iniciado...");

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === '/start') {
    bot.sendMessage(chatId, '🔥 Bot ADS 2026.1 ativo!\n\nDigite o nome da música 🎵');
  } else {
    bot.sendMessage(chatId, `Você digitou: ${msg.text}`);
  }
});
