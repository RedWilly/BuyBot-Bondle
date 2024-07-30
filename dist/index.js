"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const blockchain_1 = require("./blockchain");
const bot_1 = require("./bot");
dotenv_1.default.config();
console.log('Starting Token Monitor Telegram Bot...');
(0, blockchain_1.setupBlockchainListeners)(bot_1.sendTokenCreatedNotification, bot_1.sendTokenBuyNotification, bot_1.sendTokenSellNotification);
console.log('Blockchain listeners set up. Waiting for events...');
