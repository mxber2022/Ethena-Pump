import React, { useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useEthereum } from "../hooks/useEthereum";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function BuyMemeToken() {
  const { contract } = useEthereum();
  const [formData, setFormData] = useState({
    tokenAddress: "",
    amount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("hello");
    if (!contract) return;

    try {
      console.log("formData.tokenAddress:", formData.tokenAddress);
      const tx = await contract.buyMemeToken(
        formData.tokenAddress,
        ethers.utils.parseEther(formData.amount)
      );
      toast.loading("Buying meme tokens... 💸");
      await tx.wait();
      toast.success("Tokens purchased successfully! 🎉");
    } catch (error) {
      console.error("Error buying tokens:", error);
      toast.error("Failed to buy tokens 😢");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Buy Meme Tokens 💎
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Token Address"
          type="text"
          value={formData.tokenAddress}
          onChange={(e) =>
            setFormData({ ...formData, tokenAddress: e.target.value })
          }
          required
        />
        <Input
          label="Amount"
          type="number"
          step="0.000000000000000001"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
        <Button type="submit" gradient="secondary" fullWidth>
          Buy Tokens 🌟
        </Button>
      </form>
    </motion.div>
  );
}
