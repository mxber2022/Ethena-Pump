import { useState } from 'react';
import { ethers } from 'ethers';
import { useEthereum } from './useEthereum';
import { useTransaction } from './useTransaction';
import { TokenFormData } from '../types/token';
import { MEMETOKEN_CREATION_FEE } from '../contracts/types';

export function useTokenCreation() {
  const { contract, approveUsde } = useEthereum();
  const { execute } = useTransaction();
  const [showCelebration, setShowCelebration] = useState(false);

  const createToken = async (formData: TokenFormData): Promise<boolean> => {
    if (!contract) return false;

    // First approve USDE spending
    const approved = await execute(
      () => approveUsde(MEMETOKEN_CREATION_FEE),
      {
        loadingMessage: 'Approving USDE spending...',
        successMessage: 'USDE spending approved! 🎉',
        errorMessage: 'Failed to approve USDE spending'
      }
    );

    if (!approved) return false;

    // Then create the token
    const success = await execute(
      async () => {
        const tx = await contract.createMemeToken(
          formData.name,
          formData.symbol,
          formData.imageUrl,
          formData.description
        );
        await tx.wait();
        return true;
      },
      {
        loadingMessage: 'Creating your meme token...',
        successMessage: '🎉 Token Created Successfully!',
        errorMessage: 'Failed to create token'
      }
    );

    if (success) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }

    return !!success;
  };

  return {
    createToken,
    showCelebration
  };
}