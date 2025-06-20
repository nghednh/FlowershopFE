import React from 'react';
import './Menu.css';

interface MenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="menu-overlay" onClick={onClose} />
            <div className="menu">
                <div className="menu-header">
                    <button onClick={onClose} className="close-button">
                        <img src="/close-button-menu.svg" />
                    </button>
                </div>

                <div className="menu-content">
                    <ul className="menu-list">
                        <li>
                            <a href="/login">Sign in</a>
                        </li>
                        <li>
                            <a href="/shop">Shop</a>
                        </li>
                        <li>
                            <a href="/contact">Contact</a>
                        </li>
                        <li>
                            <a href="/about">About Us</a>
                        </li>
                    </ul>
                    <ul className="menu-service-list">
                        <li>
                            <a href="/faq">Shipping & returns</a>
                        </li>
                        <li>
                            <a href="/terms">Terms & conditions</a>
                        </li>
                        <li>
                            <a href="/privacy">Privacy policy</a>
                        </li>
                    </ul>
                    <ul className="menu-social-list">
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
            </div>
        </>
    );
    
};

export default Menu;
