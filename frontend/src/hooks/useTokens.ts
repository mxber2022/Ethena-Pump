import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useEthereum } from './useEthereum';
import { MemeToken } from '../contracts/types';
import toast from 'react-hot-toast';

export function useTokens() {
  const { contract } = useEthereum();
  const [tokens, setTokens] = useState<MemeToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTokens = async () => {
    if (!contract) return;
    
    setIsLoading(true);
    try {
      const tokenAddresses: string[] = [];
      let index = 0;
      
      while (true) {
        try {
          const address = await contract.memeTokenAddresses(index);
          tokenAddresses.push(address);
          index++;
        } catch (error) {
          break;
        }
      }

      const tokenPromises = tokenAddresses.map(async (address) => {
        const [name, symbol, description, imageUrl, fundingRaised, tokenAddress, creatorAddress] = 
          await contract.addressToMemeTokenMapping(address);
        
        return {
          name,
          symbol,
          description,
          tokenImageUrl: imageUrl,
          fundingRaised: ethers.utils.formatEther(fundingRaised),
          tokenAddress,
          creatorAddress
        };
      });

      const tokens = await Promise.all(tokenPromises);
      setTokens(tokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast.error('Failed to fetch tokens');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchTokens();
    }
  }, [contract]);

  return { tokens, isLoading, refreshTokens: fetchTokens };
}