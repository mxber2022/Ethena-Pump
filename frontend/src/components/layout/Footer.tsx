import React from "react";
import { FiGithub, FiTwitter, FiZap, FiHeart } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="bg-black/20 border-t border-white/10 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FiZap className="h-6 w-6 text-purple-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MemeToken Factory
              </span>
            </div>
            <p className="text-sm text-gray-400">
              The next generation platform for creating and trading meme tokens
              on the blockchain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#create"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Create Token
                </a>
              </li>
              <li>
                <a
                  href="#tokens"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Browse Tokens
                </a>
              </li>
              <li>
                <a
                  href="#docs"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#faq"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#guide"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  User Guide
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiGithub className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 MemeToken Factory. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400 mt-4 sm:mt-0">
              <span>Made with</span>
              <FiHeart className="h-4 w-4 text-red-500" />
              <span>by MX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
