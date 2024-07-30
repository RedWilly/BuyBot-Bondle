import { createPublicClient, http, parseAbi } from 'viem';
import { shibarium } from 'viem/chains';
import { TokenEvent, TokenCreationEvent } from './types';

const CONTRACT_ADDRESS = '0x6Cb47Ef9b8482c3303C25F1164DCE03d2d2bd9A1';

const ABI = parseAbi([
  'event TokenCreated(address indexed tokenAddress, address indexed creator, string name, string symbol)',
  'event TokensBought(address indexed token, address indexed buyer, uint256 ethAmount, uint256 tokenAmount)',
  'event TokensSold(address indexed token, address indexed seller, uint256 tokenAmount, uint256 ethAmount)',
]);

const client = createPublicClient({
  chain: shibarium,
  transport: http(),
});

export async function getTokenInfo(tokenAddress: string): Promise<{ name: string; symbol: string }> {
  const nameResult = await client.readContract({
    address: tokenAddress as `0x${string}`,
    abi: parseAbi(['function name() view returns (string)']),
    functionName: 'name',
  });

  const symbolResult = await client.readContract({
    address: tokenAddress as `0x${string}`,
    abi: parseAbi(['function symbol() view returns (string)']),
    functionName: 'symbol',
  });

  return {
    name: nameResult as string,
    symbol: symbolResult as string,
  };
}

export function setupBlockchainListeners(
  onTokenCreated: (event: TokenCreationEvent) => void,
  onTokensBought: (event: TokenEvent) => void,
  onTokensSold: (event: TokenEvent) => void
) {
  client.watchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'TokenCreated',
    onLogs: async (logs) => {
      for (const log of logs) {
        const { tokenAddress, creator, name, symbol } = log.args;
        onTokenCreated({
          tokenAddress: tokenAddress as string,
          creator: creator as string,
          tokenName: name as string,
          tokenSymbol: symbol as string,
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
        const { name, symbol } = await getTokenInfo(token as string);
        onTokensBought({
          tokenAddress: token as string,
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
        const { name, symbol } = await getTokenInfo(token as string);
        onTokensSold({
          tokenAddress: token as string,
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