"use strict";
// import dotenv from 'dotenv';
// import { setupBlockchainListeners } from './blockchain';
// import {
//   sendTokenCreatedNotification,
//   sendTokenBuyNotification,
//   sendTokenSellNotification,
// } from './bot';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// console.log('Starting Token Monitor Telegram Bot...');
// setupBlockchainListeners(
//   sendTokenCreatedNotification,
//   sendTokenBuyNotification,
//   sendTokenSellNotification
// );
// console.log('Blockchain listeners set up. Waiting for events...');
const dotenv_1 = __importDefault(require("dotenv"));
const blockchain_1 = require("./blockchain");
const bot_1 = require("./bot");
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Simple route for health check
app.get('/', (req, res) => {
    res.send('Token Monitor Telegram Bot is running!');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Starting Token Monitor Telegram Bot...');
    (0, blockchain_1.setupBlockchainListeners)(bot_1.sendTokenCreatedNotification, bot_1.sendTokenBuyNotification, bot_1.sendTokenSellNotification);
    console.log('Blockchain listeners set up. Waiting for events...');
});
