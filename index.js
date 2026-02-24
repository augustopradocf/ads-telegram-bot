const TelegramBot = require('node-telegram-bot-api');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

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

    const info = `🎵 ${video.title}
⏱ ${video.timestamp}
📺 ${video.url}

🎧 Preview abaixo 👇`;

    await bot.sendMessage(chatId, info);

    const stream = ytdl(video.url, {
      filter: 'audioonly',
      quality: 'lowestaudio',
      highWaterMark: 1 << 25
    });

    bot.sendAudio(chatId, stream, {
      title: video.title
    });

  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, "❌ Erro ao gerar preview.");
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🔥 DJ ADS ativo!\nUse /play nome da música 🎵");
});
