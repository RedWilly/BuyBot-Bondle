"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokenCreatedNotification = sendTokenCreatedNotification;
exports.sendTokenBuyNotification = sendTokenBuyNotification;
exports.sendTokenSellNotification = sendTokenSellNotification;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const priceService_1 = require("./priceService");
const utils_1 = require("./utils");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in the environment variables.');
    process.exit(1);
}
const bot = new node_telegram_bot_api_1.default(TELEGRAM_BOT_TOKEN, { polling: true });
async function sendTelegramMessageWithImage(message, imagePath) {
    try {
        if (!TELEGRAM_CHAT_ID) {
            throw new Error('TELEGRAM_CHAT_ID is not defined');
        }
        await bot.sendPhoto(TELEGRAM_CHAT_ID, imagePath, {
            caption: message,
            parse_mode: 'HTML'
        }, {
            contentType: 'image/jpeg'
        });
    }
    catch (error) {
        console.error('Error sending message with image:', error);
    }
}
function weiToEth(wei) {
    return Number(wei) / 1e18;
}
function getImagePath(type, amount) {
    const basePath = path_1.default.join(__dirname, '..', 'images');
    if (type === 'newToken') {
        return path_1.default.join(basePath, 'newtoken.jpg');
    }
    if (type === 'sell') {
        return path_1.default.join(basePath, amount && amount < 20 ? 'sell1.jpg' : 'sell1.jpg');
    }
    //   if (type === 'buy') {
    //     if (amount && amount < 20) return path.join(basePath, 'buy1.jpg');
    //     if (amount && amount >= 20 && amount < 121) return path.join(basePath, 'buy2.jpg');
    //     if (amount && amount >= 121 && amount < 200) return path.join(basePath, 'buy3.jpg');
    //     return path.join(basePath, 'buy4.jpg');
    //   }
    if (type === 'buy') {
        if (amount && amount < 20)
            return path_1.default.join(basePath, 'buy1.jpg');
        // if (amount && amount >= 20 && amount < 121) return path.join(basePath, 'buy2.jpg');
        // if (amount && amount >= 121 && amount < 200) return path.join(basePath, 'buy3.jpg');
        return path_1.default.join(basePath, 'buy2.jpg');
    }
    throw new Error('Invalid image type');
}
function getViewChartLink(address) {
    return `<a href="https://www.bondle.xyz/token/${address}"><b><u>📊 View Chart 📊</u></b></a>`;
}
async function sendTokenCreatedNotification(event) {
    const message = `
<b>🎉 New Token Launched:</b>
-----------------------
🆕 Token Name: ${event.tokenName}
🔤 Symbol: ${event.tokenSymbol}
📍 Address: <b>${(0, utils_1.shortenAddress)(event.tokenAddress)}</b>
👤 Creator: <b>${(0, utils_1.shortenAddress)(event.creator)}</b>

${getViewChartLink(event.tokenAddress)}
-----------------------
`;
    await sendTelegramMessageWithImage(message, getImagePath('newToken'));
}
async function sendTokenBuyNotification(event) {
    const ethPrice = await (0, priceService_1.getEthPrice)();
    const ethAmount = weiToEth(event.ethAmount);
    const usdValue = ethAmount * ethPrice;
    const tokenAmount = weiToEth(event.amount);
    const message = `
<b>💹 New Buy Transaction:</b>
--------------------
🚀 ${event.tokenName} (${event.tokenSymbol})
<b>💰 Amount:</b> ${(0, utils_1.formatNumber)(tokenAmount)} ${event.tokenSymbol}
<b>💸 With:</b> ${(0, utils_1.formatEthAmount)(ethAmount.toString())} BONE
<b>💵 Value in USD:</b> $${(0, utils_1.formatNumber)(usdValue)}

${getViewChartLink(event.tokenAddress)}
--------------------
`;
    await sendTelegramMessageWithImage(message, getImagePath('buy', ethAmount));
}
async function sendTokenSellNotification(event) {
    const ethPrice = await (0, priceService_1.getEthPrice)();
    const ethAmount = weiToEth(event.ethAmount);
    const usdValue = ethAmount * ethPrice;
    const tokenAmount = weiToEth(event.amount);
    const message = `
<b>📉 New Sell Transaction:</b>
---------------------
🚀 ${event.tokenName} (${event.tokenSymbol})
<b>💰 Amount:</b> ${(0, utils_1.formatNumber)(tokenAmount)} ${event.tokenSymbol}
<b>💸 Received:</b> ${(0, utils_1.formatEthAmount)(ethAmount.toString())} BONE
<b>💵 Value in USD:</b> $${(0, utils_1.formatNumber)(usdValue)}

${getViewChartLink(event.tokenAddress)}
---------------------
`;
    await sendTelegramMessageWithImage(message, getImagePath('sell', ethAmount));
}
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});
bot.on('error', (error) => {
    console.error('General error:', error);
});
console.log('Telegram bot initialized successfully.');
