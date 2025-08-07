import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserLoyaltyInfo } from '../config/api';
import { IUserLoyalty } from '../types/backend';
import './Header.css';

interface HeaderProps {
    toggleCart: () => void;
    toggleMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleCart, toggleMenu }) => {
    const navigate = useNavigate();
    const [loyaltyInfo, setLoyaltyInfo] = useState<IUserLoyalty | null>(null);
    const [loading, setLoading] = useState(false);

    // Check if user is logged in
    const user = localStorage.getItem('user');
    const isLoggedIn = user && user !== 'null';
    const userData = isLoggedIn ? JSON.parse(user) : null;

    const loadLoyaltyInfo = async () => {
        if (!isLoggedIn) return;
        
        try {
            setLoading(true);
            const response = await getUserLoyaltyInfo();
            setLoyaltyInfo(response);
        } catch (error) {
            console.error('Error loading loyalty info:', error);
            // Don't show error in header, just fail silently
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLoyaltyInfo();
    }, [isLoggedIn]);

    const handleSignIn = () => {
        if (isLoggedIn) {
            // User is logged in, navigate to profile or show user menu
            if (userData.role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/profile'); // Navigate to user profile page
            }
        } else {
            // User not logged in, redirect to login
            navigate('/login');
        }
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user.role');
        
        // Navigate to login page
        navigate('/login');
    };

    const handleShop = () => {
        navigate('/list');
    };

    const handleContact = () => {
        navigate('/contact');
    };

    const handleHome = () => {
        navigate('/home');
    };

    return (
        <div>
            {/* Loyalty Points Bar - Only show if logged in */}
            {isLoggedIn && (
                <div className="loyalty-bar">
                    <div className="loyalty-content">
                        {loading ? (
                            <div className="loading-rewards">
                                <div className="loading-spinner"></div>
                                <span>Loading rewards...</span>
                            </div>
                        ) : loyaltyInfo ? (
                            <div className="loyalty-info">
                                <div className="points-display">
                                    <span className="trophy-icon">🏆</span>
                                    <span className="points-text">{loyaltyInfo.currentPoints} Points</span>
                                </div>
                            </div>
                        ) : (
                            <span className="loyalty-unavailable">Loyalty rewards unavailable</span>
                        )}
                    </div>
                </div>
            )}
            
            <header className="header">
                {/* Brand Logo/Name */}
                <div className="header-brand">
                    <button className="brand-button" onClick={handleHome}>
                        <img src="/flower.svg" alt="FlowerShop" className="brand-icon" />
                        <span className="brand-name">FlowerShop</span>
                    </button>
                </div>

                {/* Desktop Navigation */}
                <div className="header-nav desktop-only">
                    <button className="nav-button" onClick={handleHome}>
                        <span>Home</span>
                    </button>
                    <button className="nav-button" onClick={handleShop}>
                        <span>Shop</span>
                    </button>
                    <button className="nav-button" onClick={handleContact}>
                        <span>Contact</span>
                    </button>
                </div>
                {/* Desktop User Actions */}
                <div className="header-actions desktop-only">
                    <button className="action-button primary" onClick={handleSignIn}>
                        {isLoggedIn 
                            ? (userData?.role === 'Admin' ? 'Admin CMS' : 'My Profile')
                            : 'Sign in'
                        }
                    </button>
                    {isLoggedIn && (
                        <button className="action-button" onClick={() => navigate('/orderhistory')}>
                            Order History
                        </button>
                    )}
                    {isLoggedIn && (
                        <button className="action-button logout" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                    <button className="action-button cart" onClick={toggleCart}>
                        <img src="/shopping-bag.svg" alt="Cart" className="cart-icon" />
                        <span>Cart</span>
                    </button>
                </div>

                {/* Mobile */}
                <div className="header-mobile mobile-only">
                    <div className="mobile-brand">
                        <img src="/flower.svg" alt="FlowerShop" className="mobile-brand-icon" />
                        <span className="mobile-brand-name">FlowerShop</span>
                    </div>
                    <div className="mobile-actions">
                        <button className="header-icon-btn" aria-label="Menu" onClick={toggleMenu}>
                            <img src="/menu.svg" alt="Menu" className="header-icon" />
                        </button>
                        <button className="header-icon-btn" aria-label="Cart" onClick={toggleCart}>
                            <img src="/shopping-bag.svg" alt="Cart" className="header-icon" />
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
