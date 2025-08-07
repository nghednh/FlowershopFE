import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

interface MenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    // Check if user is logged in
    const user = localStorage.getItem('user');
    const isLoggedIn = user && user !== 'null';
    const userData = isLoggedIn ? JSON.parse(user) : null;

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user.role');
        
        // Close menu and navigate to login page
        onClose();
        navigate('/login');
    };

    const handleMenuItemClick = (path: string) => {
        onClose();
        navigate(path);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="menu-overlay" onClick={onClose} />
            <div className="menu">
                <div className="menu-header">
                    <div className="menu-user-info">
                        {isLoggedIn && (
                            <div className="menu-welcome">
                                <span className="welcome-text">{userData?.userName || userData?.name || userData?.firstName || 'User'}</span>
                                {userData?.role === 'Admin' && (
                                    <span className="admin-badge">Admin</span>
                                )}
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="close-button">
                        <img src="/close-button-menu.svg" alt="Close" />
                    </button>
                </div>

                <div className="menu-content">
                    {/* Main Navigation */}
                    <ul className="menu-list">
                        <li>
                            <a onClick={() => handleMenuItemClick('/home')}>Home</a>
                        </li>
                        <li>
                            <a onClick={() => handleMenuItemClick('/list')}>Shop</a>
                        </li>
                        <li>
                            <a onClick={() => handleMenuItemClick('/contact')}>Contact</a>
                        </li>
                    </ul>

                    {/* User Actions */}
                    <ul className="menu-user-actions">
                        {!isLoggedIn ? (
                            <li>
                                <a className="primary-action" onClick={() => handleMenuItemClick('/login')}>
                                    Sign in
                                </a>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <a onClick={() => handleMenuItemClick(userData?.role === 'Admin' ? '/admin' : '/profile')}>
                                        {userData?.role === 'Admin' ? 'Admin CMS' : 'My Profile'}
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => handleMenuItemClick('/orderhistory')}>Order History</a>
                                </li>
                                <li>
                                    <a className="logout-action" onClick={handleLogout}>
                                        Logout
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Service Links */}
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

                    {/* Social Links */}
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
