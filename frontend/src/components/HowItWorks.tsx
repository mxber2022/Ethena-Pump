import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart,
  FiBarChart2,
  FiZap,
} from "react-icons/fi";

const steps = [
  {
    icon: <FiShoppingCart className="w-6 h-6" />,
    title: "Pick Your Favorite Coin",
    description:
      "Browse through our collection of meme tokens and choose the one that catches your eye.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <FiTrendingUp className="w-6 h-6" />,
    title: "Buy on the Bonding Curve",
    description:
      "Purchase tokens using our innovative bonding curve - the earlier you buy, the better the price!",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: <FiDollarSign className="w-6 h-6" />,
    title: "Trade Anytime",
    description:
      "Sell your tokens at any time to lock in your profits or cut your losses.",
    gradient: "from-rose-500 to-orange-500",
  },
  {
    icon: <FiBarChart2 className="w-6 h-6" />,
    title: "Watch It Grow",
    description: "As more people buy, the token reaches a market cap of $100K.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: <FiZap className="w-6 h-6" />,
    title: "Automatic Uniswap Listing",
    description:
      "$20K of liquidity is automatically added to Uniswap, and remaining tokens are burned.",
    gradient: "from-amber-500 to-yellow-500",
  },
];

export function HowItWorks() {
  return (
    <div className="py-24 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg">
            Your journey to meme token success in 5 simple steps
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.gradient} p-3 mb-4 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
