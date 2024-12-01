import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiGithub, FiTwitter } from 'react-icons/fi';
import { WalletConnect } from '../WalletConnect';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <FiZap className="h-8 w-8 text-purple-500 glow group-hover:text-purple-400 transition-colors" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-fuchsia-400 group-hover:to-pink-400 transition-all"
                whileHover={{ scale: 1.05 }}
              >
                EthenaPump
              </motion.h1>
              <p className="text-xs text-purple-500/80 group-hover:text-purple-400/80 transition-colors">
                Pump Your Dreams
              </p>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {['Create Token', 'Browse Tokens', 'Docs'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-400 hover:text-purple-400 transition-colors relative group"
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4">
              {[
                { icon: FiGithub, href: 'https://github.com' },
                { icon: FiTwitter, href: 'https://twitter.com' }
              ].map(({ icon: Icon, href }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 15,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}