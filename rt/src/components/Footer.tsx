import React, { useEffect, useState } from "react";
import { getUserLoyaltyInfo } from "../config/api";
import { IUserLoyalty } from "../types/backend";
import "./Footer.css";

const Footer: React.FC = () => {
  const [loyaltyInfo, setLoyaltyInfo] = useState<IUserLoyalty | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in
  const user = localStorage.getItem("user");
  const isLoggedIn = user && user !== "null";

  const loadLoyaltyInfo = async () => {
    if (!isLoggedIn) return;
    
    try {
      setLoading(true);
      const response = await getUserLoyaltyInfo();
      console.log("Loyalty Info Response:", response);
      setLoyaltyInfo(response);
    } catch (error) {
      console.error('Error loading loyalty info:', error);
      // Don't show error in footer, just fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoyaltyInfo();
  }, [isLoggedIn]);

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loyalty Points Section - Only show if logged in */}
        {isLoggedIn && (
          <div className="mb-6 pb-6 border-b border-gray-600">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Your Loyalty Points
              </h3>
              {loading ? (
                <div className="text-gray-300">Loading...</div>
              ) : loyaltyInfo ? (
                <div className="flex justify-center items-center space-x-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-bold">
                    🏆 Current Points: {loyaltyInfo.currentPoints}
                  </div>
                  <div className="text-sm text-gray-300">
                    <span>Total Earned: {loyaltyInfo.totalEarned}</span>
                    <span className="mx-2">|</span>
                    <span>Total Redeemed: {loyaltyInfo.totalRedeemed}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Unable to load loyalty points</div>
              )}
            </div>
          </div>
        )}

        {/* Existing footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">FlowerShop</h3>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted partner for beautiful flowers and arrangements.
              Creating memorable moments since our founding.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <img src="/Facebook.svg" alt="Facebook" className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <img src="/Instagram.svg" alt="Instagram" className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <img src="/Twitter.svg" alt="Twitter" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/home"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/list"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/category"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 Somewhere on Earth</p>
              <p>📞 +0123456789</p>
              <p>✉️ FlowerShop.Shop@gmail.com</p>
              <p>🕒 8 AM - 11 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-600 text-center text-sm text-gray-300">
          <p>&copy; 2024 FlowerShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;