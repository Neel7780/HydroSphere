"use client";

import React from "react";
import { Github, Twitter, Linkedin, Mail, Globe, Zap, Users, Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative w-full bg-black/50 backdrop-blur-sm border-t border-green-400/60 mt-20" style={{
      boxShadow: '0 0 120px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.25), 0 0 40px rgba(34, 197, 94, 0.15), inset 0 2px 0 rgba(34, 197, 94, 0.5)',
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(8, 110, 52, 0.3) 30%, rgba(34, 197, 94, 0.2) 50%, rgba(8, 110, 52, 0.3) 70%, rgba(0, 0, 0, 0.7) 100%)'
    }}>
      {/* Enhanced gradient overlay for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-transparent pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-green-400">HYDROSPHERE</h3>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-sm" style={{
              textShadow: '0 0 10px rgba(34, 197, 94, 0.3)'
            }}>
              Revolutionizing collaboration with real-time editing, seamless version control, and advanced features for modern teams.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 hover:border-green-400/50 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-green-400" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 hover:border-green-400/50 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-green-400" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 hover:border-green-400/50 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-green-400" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2" style={{
              textShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
            }}>
              <Code className="w-5 h-5 text-green-400" />
              <span>Product</span>
            </h4>
            <ul className="space-y-3">
              {[
                "Collaborative Editing",
                "Real-time Updates",
                "Version Control",
                "Advanced Features",
                "API Documentation",
                "Integrations"
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                    style={{
                      textShadow: '0 0 6px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2" style={{
              textShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
            }}>
              <Users className="w-5 h-5 text-green-400" />
              <span>Company</span>
            </h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Careers",
                "Blog",
                "Press Kit",
                "Contact",
                "Support"
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                    style={{
                      textShadow: '0 0 6px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2" style={{
              textShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
            }}>
              <Mail className="w-5 h-5 text-green-400" />
              <span>Stay Connected</span>
            </h4>
            <p className="text-gray-400 text-sm" style={{
              textShadow: '0 0 6px rgba(34, 197, 94, 0.2)'
            }}>
              Get the latest updates and features delivered to your inbox.
            </p>
            <div className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-black/50 border border-green-400/30 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400/60 focus:bg-black/70 transition-all duration-300"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-black font-semibold rounded-r-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 hover:scale-105">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500" style={{
                textShadow: '0 0 4px rgba(34, 197, 94, 0.15)'
              }}>
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-green-400/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400" style={{
              textShadow: '0 0 6px rgba(34, 197, 94, 0.2)'
            }}>
              <span>© 2024 Hydrosphere. All rights reserved.</span>
              <a href="#" className="hover:text-green-400 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-green-400 transition-colors duration-300">Terms of Service</a>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400" style={{
              textShadow: '0 0 6px rgba(34, 197, 94, 0.2)'
            }}>
              <Globe className="w-4 h-4 text-green-400" />
              <span>Built with passion for collaboration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intense glow effect for maximum background visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-400/35 via-green-400/20 to-green-400/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/15 via-green-400/25 to-green-400/15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-green-400/20 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.18) 30%, rgba(34, 197, 94, 0.08) 60%, transparent 80%)'
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'conic-gradient(from 0deg at 50% 50%, rgba(34, 197, 94, 0.1) 0deg, rgba(34, 197, 94, 0.2) 90deg, rgba(34, 197, 94, 0.15) 180deg, rgba(34, 197, 94, 0.25) 270deg, rgba(34, 197, 94, 0.1) 360deg)'
      }} />
    </footer>
  );
}
