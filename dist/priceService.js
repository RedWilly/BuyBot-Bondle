"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEthPrice = getEthPrice;
const axios_1 = __importDefault(require("axios"));
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds
let cachedPrice = null;
let lastFetchTime = 0;
async function fetchEthPrice() {
    try {
        const response = await axios_1.default.get('https://pump.rooni.site/api/price');
        return parseFloat(response.data.price);
    }
    catch (error) {
        console.error('Error fetching ETH price:', error);
        throw error;
    }
}
async function getEthPrice() {
    const now = Date.now();
    if (!cachedPrice || (now - lastFetchTime) > CACHE_DURATION) {
        cachedPrice = await fetchEthPrice();
        lastFetchTime = now;
    }
    return cachedPrice;
}
