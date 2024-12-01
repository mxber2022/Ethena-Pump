import React from 'react';
import { FiUser } from 'react-icons/fi';
import { truncateAddress } from '../../utils/address';

interface WalletStatusProps {
  address: string;
}

export function WalletStatus({ address }: WalletStatusProps) {
  return (
    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
      <FiUser className="text-purple-400" />
      <span className="text-sm text-gray-300">
        {truncateAddress(address)}
      </span>
    </div>
  );
}