export interface TokenFormData {
  name: string;
  symbol: string;
  imageUrl: string;
  description: string;
}

export interface MemeToken {
  name: string;
  symbol: string;
  description: string;
  tokenImageUrl: string;
  fundingRaised: string;
  tokenAddress: string;
  creatorAddress: string;
}