import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            {/* Reminders/Newsletter */}
            <div className="footer-content">
                <p className="reminder-text">
                    Remember to offer beautiful flowers from Kyiv LuxeBouquets Valentines Day, Mothers Day, Christmas...<br />
                    Reminds you 7 days before. No spam or sharing your address.
                </p>
                <form className="newsletter-form">
                    <input type="email" placeholder="Your email" />
                    <button type="submit">Remind</button>
                </form>
            </div>
            {/* Contact Us */}
            <div className="footer-content">
                <h3 className="footer-title">Contact Us</h3>
                <div className="info-wrapper">
                    <p className="footer-sub-title">Address</p>
                    <p className="footer-info">15/4 Khreshchatyk Street, Kyiv</p>
                </div>
                <div className="info-wrapper">
                    <p className="footer-sub-title">Phone</p>
                    <p className="footer-info">+380 44 123 4567</p>
                </div>
                <div className="info-wrapper">
                    <p className="footer-sub-title">General Enquiry</p>
                    <p className="footer-info">Kiev.Florist.Studio@gmail.com</p>
                </div>
                <h3 className="footer-title">Follow Us</h3>
                <ul className="footer-social-list">
                    <li>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <img src="/Instagram.svg" alt="Instagram" />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                            <img src="/Pinterest.svg" alt="Pinterest" />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <img src="/Facebook.svg" alt="Facebook" />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <img src="/Twitter.svg" alt="Twitter" />
                        </a>
                    </li>
                    <li>
                        <a href="https://t.me/yourchannel" target="_blank" rel="noopener noreferrer">
                            <img src="/Telegram.svg" alt="Telegram" />
                        </a>
                    </li>
                </ul>
            </div>
            {/* Shop */}
            <div className="footer-content">
                <h3 className="footer-title">Shop</h3>
                <ul className="footer-menu-list">
                    <li>
                        <a href="/">All Products</a>
                    </li>
                    <li>
                        <a href="/">Fresh Flowers</a>
                    </li>
                    <li>
                        <a href="/">Dried Flowers</a>
                    </li>
                    <li>
                        <a href="/">Live Plants</a>
                    </li>
                    <li>
                        <a href="/">Live Plants</a>
                    </li>
                    <li>
                        <a href="/">Aroma Candles</a>
                    </li>
                    <li>
                        <a href="/">Freshener Diffuser</a>
                    </li>
                </ul>
                <h3 className="footer-title">Services</h3>
                <ul className="footer-menu-list">
                    <li>
                        <a href="/">Flower Subcription</a>
                    </li>
                    <li>
                        <a href="/">Wedding & Event Decor</a>
                    </li>
                </ul>
            </div>
            {/* About Us */}
            <div className="footer-content">
                <h3 className="footer-title">About Us</h3>
                <ul className="footer-menu-list">
                    <li>
                        <a href="/">Our Story</a>
                    </li>
                    <li>
                        <a href="/">Blog</a>
                    </li>
                </ul>
                <ul className="footer-menu-list">
                    <li>
                        <a href="/">Shipping & returns</a>
                    </li>
                    <li>
                        <a href="/">Terms & conditions</a>
                    </li>
                    <li>
                        <a href="/">Privacy policy</a>
                    </li>
                </ul>
            </div>
        </footer >
    );
};

export default Footer;
