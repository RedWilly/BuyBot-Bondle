import TelegramBot from 'node-telegram-bot-api';
import { TokenEvent, TokenCreationEvent } from './types';
import { getEthPrice } from './priceService';
import { formatNumber, formatEthAmount, shortenAddress } from './utils';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in the environment variables.');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

async function sendTelegramMessageWithImage(message: string, imagePath: string) {
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
  } catch (error) {
    console.error('Error sending message with image:', error);
  }
}

function weiToEth(wei: string): number {
  return Number(wei) / 1e18;
}

function getImagePath(type: 'buy' | 'sell' | 'newToken', amount?: number): string {
  const basePath = path.join(__dirname, '..', 'images');
  
  if (type === 'newToken') {
    return path.join(basePath, 'newtoken.jpg');
  }

  if (type === 'sell') {
    return path.join(basePath, amount && amount < 20 ? 'sell1.jpg' : 'sell1.jpg');
  }

//   if (type === 'buy') {
//     if (amount && amount < 20) return path.join(basePath, 'buy1.jpg');
//     if (amount && amount >= 20 && amount < 121) return path.join(basePath, 'buy2.jpg');
//     if (amount && amount >= 121 && amount < 200) return path.join(basePath, 'buy3.jpg');
//     return path.join(basePath, 'buy4.jpg');
//   }
  if (type === 'buy') {
    if (amount && amount < 20) return path.join(basePath, 'buy1.jpg');
    // if (amount && amount >= 20 && amount < 121) return path.join(basePath, 'buy2.jpg');
    // if (amount && amount >= 121 && amount < 200) return path.join(basePath, 'buy3.jpg');
    return path.join(basePath, 'buy2.jpg');
  }

  throw new Error('Invalid image type');
}

function getViewChartLink(address: string): string {
  return `<a href="https://www.bondle.xyz/token/${address}"><b><u>📊 View Chart 📊</u></b></a>`;
}

export async function sendTokenCreatedNotification(event: TokenCreationEvent) {
  const message = `
<b>🎉 New Token Launched:</b>
-----------------------
🆕 Token Name: ${event.tokenName}
🔤 Symbol: ${event.tokenSymbol}
📍 Address: <b>${shortenAddress(event.tokenAddress)}</b>
👤 Creator: <b>${shortenAddress(event.creator)}</b>

${getViewChartLink(event.tokenAddress)}
-----------------------
`;

  await sendTelegramMessageWithImage(message, getImagePath('newToken'));
}

export async function sendTokenBuyNotification(event: TokenEvent) {
  const ethPrice = await getEthPrice();
  const ethAmount = weiToEth(event.ethAmount);
  const usdValue = ethAmount * ethPrice;
  const tokenAmount = weiToEth(event.amount);

  const message = `
<b>💹 New Buy Transaction:</b>
--------------------
🚀 ${event.tokenName} (${event.tokenSymbol})
<b>💰 Amount:</b> ${formatNumber(tokenAmount)} ${event.tokenSymbol}
<b>💸 With:</b> ${formatEthAmount(ethAmount.toString())} BONE
<b>💵 Value in USD:</b> $${formatNumber(usdValue)}

${getViewChartLink(event.tokenAddress)}
--------------------
`;

  await sendTelegramMessageWithImage(message, getImagePath('buy', ethAmount));
}

export async function sendTokenSellNotification(event: TokenEvent) {
  const ethPrice = await getEthPrice();
  const ethAmount = weiToEth(event.ethAmount);
  const usdValue = ethAmount * ethPrice;
  const tokenAmount = weiToEth(event.amount);

  const message = `
<b>📉 New Sell Transaction:</b>
---------------------
🚀 ${event.tokenName} (${event.tokenSymbol})
<b>💰 Amount:</b> ${formatNumber(tokenAmount)} ${event.tokenSymbol}
<b>💸 Received:</b> ${formatEthAmount(ethAmount.toString())} BONE
<b>💵 Value in USD:</b> $${formatNumber(usdValue)}

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