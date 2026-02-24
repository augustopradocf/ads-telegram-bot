const TelegramBot = require('node-telegram-bot-api');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

const token = "8612845950:AAGb8-sgRn0nd5gXLxlGreVxTU7P5Kk6bu8"; // 🔥 coloque seu token aqui

const bot = new TelegramBot(token, { polling: true });

console.log("🔥 DJ ADS Bot iniciado...");

// =========================
// 🚀 COMANDO /START
// =========================
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 
    "🔥 DJ ADS 2026.1 ativo!\n\n" +
    "🎵 /play nome da música\n" +
    "🚫 /ban (respondendo alguém)\n" +
    "😈 Cuidado com a guerra das linguagens..."
  );
});

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
// 🚫 COMANDO /BAN
// =========================
bot.onText(/\/ban/, async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.reply_to_message) {
    return bot.sendMessage(chatId, "❌ Responda a mensagem da pessoa que deseja banir.");
  }

  try {
    const userId = msg.reply_to_message.from.id;

    await bot.banChatMember(chatId, userId, {
      revoke_messages: true
    });

    bot.sendMessage(chatId, "🚫 Usuário removido com sucesso.");
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, "❌ Não consegui banir.");
  }
});

// =========================
// 😂 ZOEIRAS + GUERRA DAS LINGUAGENS
// =========================
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase();

  if (!text) return;

  if (text.startsWith("/")) return;

  // ADS zoeiras
  if (text.includes("calouro")) {
    return bot.sendMessage(chatId, "👶 Calouro detectado. Favor entregar a carteirinha.");
  }

  if (text.includes("dp")) {
    return bot.sendMessage(chatId, "📉 DP já virou patrimônio histórico do ADS.");
  }

  if (text.includes("unit")) {
    return bot.sendMessage(chatId, "🏛 UNIT pagando boleto desde 2001.");
  }

  if (text.includes("augusto")) {
    return bot.sendMessage(chatId, "👑 Augusto é oficialmente o CEO do ADS 2026.1.");
  }

  if (text.includes("prova")) {
    return bot.sendMessage(chatId, "📝 Prova surpresa detectada. Preparem o psicológico.");
  }

  // ☕ Java
  if (text.includes("java")) {
    return bot.sendMessage(chatId, "☕ Java detectado. Runtime: 3 horas. Erro: faltou ponto e vírgula.");
  }

  // 🐍 Python
  if (text.includes("python")) {
    return bot.sendMessage(chatId, "🐍 Python detectado. Indentação errada e o caos começa.");
  }

  // 💻 C++
  if (text.includes("c++")) {
    return bot.sendMessage(chatId, "💻 C++ detectado. Segmentation fault incoming...");
  }

  // 🌐 JavaScript
  if (text.includes("javascript") || text.includes("js")) {
    return bot.sendMessage(chatId, "🌐 JavaScript detectado. Funciona... até parar de funcionar.");
  }

  // 🧠 Resposta inteligente básica
  if (text.endsWith("?")) {
    return bot.sendMessage(chatId, "🧠 Boa pergunta... estou analisando isso com meu cérebro de silício.");
  }
});
