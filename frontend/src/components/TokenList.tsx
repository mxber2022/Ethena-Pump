import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTokens } from '../hooks/useTokens';
import { TokenCard } from './TokenCard';

export function TokenList() {
  const { tokens, isLoading } = useTokens();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          🌀
        </motion.div>
        <p className="mt-2 text-gray-600">Loading tokens...</p>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-gray-600"
      >
        No tokens found. Be the first to create one! 🚀
      </motion.div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
        Available Meme Tokens 🎭
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {tokens.map((token, index) => (
            <TokenCard key={token.tokenAddress} token={token} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}