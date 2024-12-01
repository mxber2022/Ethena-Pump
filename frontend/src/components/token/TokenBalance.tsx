import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

interface TokenBalanceProps {
  balance: string;
  insufficientBalance: boolean;
}

export function TokenBalance({ balance, insufficientBalance }: TokenBalanceProps) {
  return (
    <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-500/20">
            <FiDollarSign className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Your USDE Balance</p>
            <p className="text-lg font-semibold text-white">
              {parseFloat(balance).toFixed(4)} USDE
            </p>
          </div>
        </div>
        {insufficientBalance && (
          <span className="text-sm text-red-400">
            Insufficient balance
          </span>
        )}
      </div>
    </div>
  );
}