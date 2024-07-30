// import dotenv from 'dotenv';
// import { setupBlockchainListeners } from './blockchain';
// import {
//   sendTokenCreatedNotification,
//   sendTokenBuyNotification,
//   sendTokenSellNotification,
// } from './bot';

// dotenv.config();

// console.log('Starting Token Monitor Telegram Bot...');

// setupBlockchainListeners(
//   sendTokenCreatedNotification,
//   sendTokenBuyNotification,
//   sendTokenSellNotification
// );

// console.log('Blockchain listeners set up. Waiting for events...');
import dotenv from 'dotenv';
import { setupBlockchainListeners } from './blockchain';
import {
  sendTokenCreatedNotification,
  sendTokenBuyNotification,
  sendTokenSellNotification,
} from './bot';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Simple route for health check
app.get('/', (req, res) => {
  res.send('Token Monitor Telegram Bot is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Starting Token Monitor Telegram Bot...');

  setupBlockchainListeners(
    sendTokenCreatedNotification,
    sendTokenBuyNotification,
    sendTokenSellNotification
  );

  console.log('Blockchain listeners set up. Waiting for events...');
});