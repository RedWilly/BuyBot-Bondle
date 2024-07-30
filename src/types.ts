export interface TokenEvent {
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    amount: string;
    ethAmount: string;
    txHash: string;
  }
  
  export interface TokenCreationEvent {
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    creator: string;
}