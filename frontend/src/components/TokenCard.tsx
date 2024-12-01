import React, { useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { MemeToken } from "../contracts/types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useEthereum } from "../hooks/useEthereum";
import toast from "react-hot-toast";
import { FiInfo, FiDollarSign, FiUser, FiShoppingCart } from "react-icons/fi";

interface TokenCardProps {
  token: MemeToken;
  index: number;
}

export function TokenCard({ token, index }: TokenCardProps) {
  const { contract, usdeContract, address, approveUsde } = useEthereum();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    if (!contract || !usdeContract || !address || !amount) return;

    setIsLoading(true);
    try {
      const parsedAmount = ethers.utils.parseEther(amount);

      // First approve USDE spending
      await approveUsde(parsedAmount);

      // Then buy tokens
      console.log("token.tokenAddress: ", token.tokenAddress);
      //0x934A353c3292e527e45Ec62c0d4849e5c85AD910
      const id = toast.loading("Buying tokens... 🛍️");
      const tx = await contract.buyMemeToken(token.tokenAddress, amount);
      await tx.wait();
      toast.dismiss(id);
      toast.success("Tokens purchased successfully! 🎉");

      setAmount("");
    } catch (error: any) {
      console.error("Error buying tokens:", error);
      if (error.reason) {
        toast.error(`Failed to buy tokens: ${error.reason}`);
      } else {
        toast.error("Failed to buy tokens. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300"
    >
      <div className="relative h-48">
        <img
          src={token.tokenImageUrl}
          alt={token.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x300?text=🎭";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white mb-1">{token.name}</h3>
          <div className="flex items-center gap-2">
            <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/10">
              {token.symbol}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-400 text-sm mb-6 line-clamp-2">
          {token.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <FiDollarSign className="text-purple-400" />
              <span className="text-sm text-gray-400">Raised</span>
            </div>
            <div className="font-medium text-white">
              {parseFloat(token.fundingRaised).toFixed(2)} USDE
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <FiUser className="text-cyan-400" />
              <span className="text-sm text-gray-400">Creator</span>
            </div>
            <div className="font-medium text-white">
              {token.creatorAddress.slice(0, 6)}...
              {token.creatorAddress.slice(-4)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Amount to Buy"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
            icon={<FiShoppingCart />}
          />
          <Button
            onClick={handleBuy}
            disabled={isLoading || !amount}
            gradient="secondary"
            fullWidth
          >
            {isLoading ? "Processing..." : "Buy Tokens 🌟"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
