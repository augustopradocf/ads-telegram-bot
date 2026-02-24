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
  bot.sendMessage(msg.chat.id, "🔥 DJ ADS 2026.1 ativo!\n\n🎵 Use /play nome da música\n🚫 Use /ban respondendo alguém\n😈 Cuidado com as zoeiras...");
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
// 🚫 COMANDO /BAN (SÓ ADMIN)
// =========================
bot.onText(/\/ban/, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.chat.type === "private") {
    return bot.sendMessage(chatId, "❌ Esse comando só funciona em grupo.");
  }

  if (!msg.reply_to_message) {
    return bot.sendMessage(chatId, "❌ Responda a mensagem da pessoa que deseja banir.");
  }

  try {
    const admins = await bot.getChatAdministrators(chatId);
    const isAdmin = admins.some(admin => admin.user.id === msg.from.id);

    if (!isAdmin) {
      return bot.sendMessage(chatId, "🚫 Apenas administradores podem usar /ban.");
    }

    const userId = msg.reply_to_message.from.id;

    await bot.banChatMember(chatId, userId);

    bot.sendMessage(chatId, "🚫 Usuário banido com sucesso.");
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, "❌ Não consegui banir. Verifique permissões.");
  }
});

// =========================
// 😂 ZOEIRAS + MODO INTELIGENTE
// =========================
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase();

  if (!text) return;

  // Evita conflito com comandos
  if (text.startsWith("/play")) return;
  if (text.startsWith("/start")) return;
  if (text.startsWith("/ban")) return;

  // 🔥 Zoeiras automáticas
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

  // 🧠 Resposta inteligente simples
  if (text.endsWith("?")) {
    return bot.sendMessage(chatId, "🧠 Boa pergunta... estou analisando isso com meu cérebro de silício.");
  }
});
