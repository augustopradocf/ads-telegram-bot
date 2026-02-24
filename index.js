const TelegramBot = require('node-telegram-bot-api');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');

const token = "8612845950:AAGb8-sgRn0nd5gXLxlGreVxTU7P5Kk6bu8";

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/play (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  bot.sendMessage(chatId, "🔎 Buscando música...");

  try {
    const search = await yts(query);
    const video = search.videos[0];

    if (!video) {
      return bot.sendMessage(chatId, "❌ Música não encontrada.");
    }

    const stream = ytdl(video.url, { filter: 'audioonly' });

    bot.sendAudio(chatId, stream, {
      title: video.title
    });

  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, "❌ Erro ao buscar música.");
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🔥 Bot DJ ADS ativo!\nUse /play nome da música 🎵");
});
