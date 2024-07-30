"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = formatNumber;
exports.formatEthAmount = formatEthAmount;
exports.shortenAddress = shortenAddress;
function formatNumber(num) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
function formatEthAmount(ethAmount) {
    return Number(ethAmount).toFixed(3);
}
function shortenAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
