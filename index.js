const TelegramBot = require('node-telegram-bot-api');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

const token = "8612845950:AAGb8-sgRn0nd5gXLxlGreVxTU7P5Kk6bu8"; // ⚠️ coloque seu token aqui

const bot = new TelegramBot(token, { polling: true });

console.log("🔥 DJ ADS Bot iniciado...");

// =========================
// 🎵 COMANDO /PLAY
// =========================
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

// =========================
// 🚀 COMANDO /START
// =========================
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🔥 DJ ADS 2026.1 ativo!\nUse /play nome da música 🎵");
});

// =========================
// 😂 ZOEIRAS + MODO INTELIGENTE
// =========================
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase();

  if (!text) return;

  // Evita conflito com /play
  if (text.startsWith("/play")) return;
  if (text.startsWith("/start")) return;

  // 🔥 Zoeiras automáticas
  if (text.includes("calouro")) {
    return bot.sendMessage(chatId, "👶 Calouro detectado. Favor entregar a carteirinha de estudante.");
  }

  if (text.includes("dp")) {
    return bot.sendMessage(chatId, "📉 DP já virou patrimônio histórico do ADS.");
  }

  if (text.includes("unit")) {
    return bot.sendMessage(chatId, "🏛 UNIT pagando boleto desde 2001.");
  }

  if (text.includes("augusto")) {
    return bot.sendMessage(chatId, "👑 Augusto é o CEO oficial do ADS 2026.1.");
  }

  if (text.includes("prova")) {
    return bot.sendMessage(chatId, "📝 Prova surpresa detectada. Preparem o psicológico.");
  }

  // 🧠 Resposta inteligente básica
  if (text.endsWith("?")) {
    return bot.sendMessage(chatId, "🧠 Boa pergunta... estou analisando isso com meu cérebro de silício.");
  }
});
