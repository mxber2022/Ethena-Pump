import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { useEthereum } from '../hooks/useEthereum';
import { useTokenCreation } from '../hooks/useTokenCreation';
import { Celebration } from './effects/Celebration';
import { TokenCreationForm } from './token/TokenCreationForm';
import { TokenBalance } from './token/TokenBalance';
import { TokenFormData } from '../types/token';

export function CreateMemeToken() {
  const { usdeContract, address } = useEthereum();
  const { createToken, showCelebration } = useTokenCreation();
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    imageUrl: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [usdeBalance, setUsdeBalance] = useState('0');

  useEffect(() => {
    const fetchBalance = async () => {
      if (usdeContract && address) {
        try {
          const balance = await usdeContract.balanceOf(address);
          setUsdeBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error('Error fetching USDE balance:', error);
        }
      }
    };

    fetchBalance();
  }, [usdeContract, address]);

  const handleFormChange = (data: Partial<TokenFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await createToken(formData);
    
    if (success) {
      setFormData({
        name: '',
        symbol: '',
        imageUrl: '',
        description: ''
      });
    }
    
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto relative"
    >
      <AnimatePresence>
        {showCelebration && <Celebration />}
      </AnimatePresence>

      <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Create Your Meme Token
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Launch your own meme token in minutes! Fee: 1 USDE
          </p>

          <TokenBalance 
            balance={usdeBalance}
            insufficientBalance={parseFloat(usdeBalance) < 1}
          />

          <TokenCreationForm
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isDisabled={parseFloat(usdeBalance) < 1}
          />
        </div>
      </div>
    </motion.div>
  );
}