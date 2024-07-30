"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenInfo = getTokenInfo;
exports.setupBlockchainListeners = setupBlockchainListeners;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const CONTRACT_ADDRESS = '0x6Cb47Ef9b8482c3303C25F1164DCE03d2d2bd9A1';
const ABI = (0, viem_1.parseAbi)([
    'event TokenCreated(address indexed tokenAddress, address indexed creator, string name, string symbol)',
    'event TokensBought(address indexed token, address indexed buyer, uint256 ethAmount, uint256 tokenAmount)',
    'event TokensSold(address indexed token, address indexed seller, uint256 tokenAmount, uint256 ethAmount)',
]);
const client = (0, viem_1.createPublicClient)({
    chain: chains_1.shibarium,
    transport: (0, viem_1.http)(),
});
async function getTokenInfo(tokenAddress) {
    const nameResult = await client.readContract({
        address: tokenAddress,
        abi: (0, viem_1.parseAbi)(['function name() view returns (string)']),
        functionName: 'name',
    });
    const symbolResult = await client.readContract({
        address: tokenAddress,
        abi: (0, viem_1.parseAbi)(['function symbol() view returns (string)']),
        functionName: 'symbol',
    });
    return {
        name: nameResult,
        symbol: symbolResult,
    };
}
function setupBlockchainListeners(onTokenCreated, onTokensBought, onTokensSold) {
    client.watchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        eventName: 'TokenCreated',
        onLogs: async (logs) => {
            for (const log of logs) {
                const { tokenAddress, creator, name, symbol } = log.args;
                onTokenCreated({
                    tokenAddress: tokenAddress,
                    creator: creator,
                    tokenName: name,
                    tokenSymbol: symbol,
                });
            }
        },
    });
    client.watchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        eventName: 'TokensBought',
        onLogs: async (logs) => {
            for (const log of logs) {
                const { token, buyer, ethAmount, tokenAmount } = log.args;
                const { name, symbol } = await getTokenInfo(token);
                onTokensBought({
                    tokenAddress: token,
                    tokenName: name,
                    tokenSymbol: symbol,
                    amount: tokenAmount ? tokenAmount.toString() : '0',
                    ethAmount: ethAmount ? ethAmount.toString() : '0',
                    txHash: log.transactionHash,
                });
            }
        },
    });
    client.watchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        eventName: 'TokensSold',
        onLogs: async (logs) => {
            for (const log of logs) {
                const { token, seller, tokenAmount, ethAmount } = log.args;
                const { name, symbol } = await getTokenInfo(token);
                onTokensSold({
                    tokenAddress: token,
                    tokenName: name,
                    tokenSymbol: symbol,
                    amount: tokenAmount ? tokenAmount.toString() : '0',
                    ethAmount: ethAmount ? ethAmount.toString() : '0',
                    txHash: log.transactionHash,
                });
            }
        },
    });
}
