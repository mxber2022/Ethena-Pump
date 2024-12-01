import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { useEthereum } from '../hooks/useEthereum';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { WalletStatus } from './wallet/WalletStatus';
import { WalletButton } from './wallet/WalletButton';

export function WalletConnect() {
  const { address, connectWallet, disconnectWallet, isConnecting } = useEthereum();

  if (!address) {
    return (
      <WalletButton 
        onClick={connectWallet} 
        isConnecting={isConnecting}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <WalletStatus address={address} />
      <Button 
        onClick={disconnectWallet}
        gradient="secondary"
        className="!p-2"
      >
        <FiLogOut className="w-5 h-5" />
      </Button>
    </motion.div>
  );
}