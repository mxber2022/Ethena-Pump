import { ethers } from 'ethers';
import { MAX_SUPPLY, INIT_SUPPLY } from '../contracts/types';

export const calculateAvailableSupply = (currentSupply: ethers.BigNumber): ethers.BigNumber => {
  return MAX_SUPPLY.sub(currentSupply);
};

export const formatTokenAmount = (amount: ethers.BigNumber): string => {
  return parseFloat(ethers.utils.formatEther(amount)).toLocaleString();
};

export const parseTokenAmount = (amount: string): ethers.BigNumber => {
  try {
    return ethers.utils.parseEther(amount);
  } catch (error) {
    throw new Error('Invalid token amount');
  }
};

export const validateTokenAmount = (amount: string, availableSupply: ethers.BigNumber): boolean => {
  try {
    const parsedAmount = parseTokenAmount(amount);
    return parsedAmount.gt(0) && parsedAmount.lte(availableSupply);
  } catch {
    return false;
  }
};

export const getTokenInfo = () => ({
  maxSupply: formatTokenAmount(MAX_SUPPLY),
  initialSupply: formatTokenAmount(INIT_SUPPLY)
});