import dotenv from 'dotenv';
import { setupBlockchainListeners } from './blockchain';
import {
  sendTokenCreatedNotification,
  sendTokenBuyNotification,
  sendTokenSellNotification,
} from './bot';

dotenv.config();

console.log('Starting Token Monitor Telegram Bot...');

setupBlockchainListeners(
  sendTokenCreatedNotification,
  sendTokenBuyNotification,
  sendTokenSellNotification
);

console.log('Blockchain listeners set up. Waiting for events...');