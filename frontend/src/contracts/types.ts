import { ethers } from "ethers";

export interface MemeToken {
  name: string;
  symbol: string;
  description: string;
  tokenImageUrl: string;
  fundingRaised: string;
  tokenAddress: string;
  creatorAddress: string;
}

export const TOKEN_FACTORY_ABI = [
  "function createMemeToken(string memory name, string memory symbol, string memory imageUrl, string memory description) public returns(address)",
  "function buyMemeToken(address memeTokenAddress, uint tokenQty) public",
  "function memeTokenAddresses(uint) public view returns (address)",
  "function addressToMemeTokenMapping(address) public view returns (string, string, string, string, uint256, address, address)",
  "function calculateCost(uint currentSupply, uint tokenQty) public pure returns (uint)",
];

export const USDE_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
];

// Contract Addresses
export const TOKEN_FACTORY_ADDRESS =
  "0x934a353c3292e527e45ec62c0d4849e5c85ad910";
export const USDE_ADDRESS = "0xf805ce4F96e0EdD6f0b6cd4be22B34b92373d696";

// Contract Constants
export const DECIMALS = 18;
export const MAX_SUPPLY = ethers.utils.parseEther("1000000"); // 1M tokens
export const INIT_SUPPLY = ethers.utils.parseEther("200000"); // 200K tokens (20% of MAX_SUPPLY)
export const MEMETOKEN_CREATION_FEE = ethers.utils.parseEther("1"); // 1 USDE
export const MEMECOIN_FUNDING_GOAL = ethers.utils.parseEther("1"); // 1 USDE for testing
