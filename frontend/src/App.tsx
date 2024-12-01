import React from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CreateMemeToken } from './components/CreateMemeToken';
import { TokenList } from './components/TokenList';
import { useEthereum } from './hooks/useEthereum';
import { FiArrowDown, FiZap, FiTrendingUp, FiShield } from 'react-icons/fi';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

function App() {
  const { address } = useEthereum();

  const features = [
    {
      icon: <FiZap className="h-6 w-6 text-green-400" />,
      title: "Launch Instantly",
      description: "Create your meme token in minutes with just a few clicks"
    },
    {
      icon: <FiTrendingUp className="h-6 w-6 text-emerald-400" />,
      title: "Pump It Up",
      description: "Watch your token soar with our advanced trading features"
    },
    {
      icon: <FiShield className="h-6 w-6 text-teal-400" />,
      title: "Secure Platform",
      description: "Built on blockchain with audited smart contracts"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid rgba(16, 185, 129, 0.1)'
          }
        }}
      />
      
      <Navbar />
      
      <div className="relative">
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-3xl"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-4xl mx-auto text-center z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 backdrop-blur-sm">
                🚀 The Future of Token Creation is Here
              </span>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6 gradient-text"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Create & Pump
              <br />
              Your Token Dreams
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-400 mb-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Launch your token in minutes with EthenaPump.
              <br />
              No coding required, just pure pumping magic! ✨
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="glass-card rounded-2xl p-6 gradient-border"
                >
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-3 inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {!address && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              >
                <FiArrowDown className="text-4xl animate-bounce text-emerald-500/50" />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Content Section */}
        {address && (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="mb-16" id="create">
              <CreateMemeToken />
            </div>
            <div id="tokens">
              <TokenList />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;