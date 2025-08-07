import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-wave">
      </div>

      <div className="footer-content-wrapper">
        <div className="footer-main">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-section company-info">
              <div className="company-logo">
                <h3 className="brand-title">🌸 FlowerShop</h3>
                <div className="logo-accent"></div>
              </div>
              <p className="company-description">
                Your trusted partner for beautiful flowers and arrangements.
                Creating memorable moments since our founding.
              </p>
              <div className="social-links">
                <a href="#" className="social-link facebook" aria-label="Facebook">
                  <img src="/Facebook.svg" alt="Facebook" />
                  <span className="social-tooltip">Facebook</span>
                </a>
                <a href="#" className="social-link instagram" aria-label="Instagram">
                  <img src="/Instagram.svg" alt="Instagram" />
                  <span className="social-tooltip">Instagram</span>
                </a>
                <a href="#" className="social-link twitter" aria-label="Twitter">
                  <img src="/Twitter.svg" alt="Twitter" />
                  <span className="social-tooltip">Twitter</span>
                </a>
                <a href="#" className="social-link pinterest" aria-label="Pinterest">
                  <img src="/Pinterest.svg" alt="Pinterest" />
                  <span className="social-tooltip">Pinterest</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="section-title">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="/home" className="footer-link">🏠 Home</a></li>
                <li><a href="/list" className="footer-link">🛍️ Shop</a></li>
                <li><a href="/contact" className="footer-link">📞 Contact</a></li>
                <li><a href="/category" className="footer-link">🌺 Categories</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h3 className="section-title">Customer Service</h3>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">📦 Shipping & Returns</a></li>
                <li><a href="#" className="footer-link">📋 Terms & Conditions</a></li>
                <li><a href="#" className="footer-link">🔒 Privacy Policy</a></li>
                <li><a href="#" className="footer-link">❓ FAQ</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h3 className="section-title">Contact Info</h3>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">📍 Somewhere on Earth</a></li>
                <li><a href="#" className="footer-link">📞 +0123456789</a></li>
                <li><a href="mailto:FlowerShop.Shop@gmail.com" className="footer-link">✉️ FlowerShop.Shop@gmail.com</a></li>
                <li><a href="#" className="footer-link">🕒 8 AM - 11 PM</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 FlowerShop. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#" className="bottom-link">Sitemap</a>
              <span className="separator">•</span>
              <a href="#" className="bottom-link">Accessibility</a>
              <span className="separator">•</span>
              <a href="#" className="bottom-link">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;