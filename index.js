require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Intentsを設定してDiscordクライアントを初期化
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers, // 必要に応じて追加
    ]
});

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    // ボット自身のメッセージや、メッセージ内容が空の場合は無視
    if (message.author.bot || !message.content) return;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(message.content);
        const response = await result.response;
        const text = await response.text(); // 応答をテキストとして取得

        // 応答が長すぎる場合は、切り捨てまたは適切に処理
        const replyText = text.length > 2000 ? text.substring(0, 1997) + '...' : text;
        
        message.channel.send(replyText);
    } catch (error) {
        console.error('Error responding to message:', error);
        message.channel.send('エラーが発生しました。');
    }
});

client.login(process.env.BOT_TOKEN);
