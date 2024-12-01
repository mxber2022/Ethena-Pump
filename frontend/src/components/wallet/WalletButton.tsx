import React from 'react';
import { Button } from '../ui/Button';

interface WalletButtonProps {
  onClick: () => void;
  isConnecting: boolean;
}

export function WalletButton({ onClick, isConnecting }: WalletButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      gradient="primary"
      disabled={isConnecting}
      className="ml-4"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet 🦊'}
    </Button>
  );
}