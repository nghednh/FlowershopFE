import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserLoyaltyInfo } from '../config/api';
import { IUserLoyalty } from '../types/backend';
import { APP_ICON } from '../config';
import { performLogout, isUserLoggedIn, getCurrentUser } from '../services/authServices';
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
    const isLoggedIn = isUserLoggedIn();
    const userData = getCurrentUser();

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

    const handleLogout = async () => {
        await performLogout(navigate);
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
            {/* Desktop Layout */}
            <div className="desktop-only">
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
                            <img src={APP_ICON} alt="FlowerShop" className="brand-icon" />
                            <span className="brand-name">FlowerShop</span>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="header-nav">
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
                    <div className="header-actions">
                        {isLoggedIn && (
                            <>
                                <span>Welcome, </span>
                                <span className="welcome-text">
                                    {userData?.userName || userData?.name || userData?.firstName || 'User'}
                                </span>
                            </>
                        )}
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
                </header>
            </div>

            {/* Mobile Layout */}
            <div className="mobile-only">
                {/* Mobile Loyalty Points Bar - Only show if logged in */}
                {isLoggedIn && (
                    <div className="mobile-loyalty-bar">
                        <div className="mobile-loyalty-content">
                            {loading ? (
                                <div className="loading-rewards">
                                    <div className="loading-spinner"></div>
                                    <span>Loading...</span>
                                </div>
                            ) : loyaltyInfo ? (
                                <div className="mobile-loyalty-info">
                                    <span className="trophy-icon">🏆</span>
                                    <span className="mobile-points-text">{loyaltyInfo.currentPoints} Points</span>
                                    <span>Hi, </span>
                                    <span className="mobile-user-name">{userData?.userName || userData?.name || userData?.firstName || 'User'}!</span>
                                </div>
                            ) : (
                                <span className="loyalty-unavailable">Rewards unavailable</span>
                            )}
                        </div>
                    </div>
                )}

                <header className="mobile-header">
                    <div className="mobile-brand" onClick={handleHome}>
                        <img src={APP_ICON} alt="FlowerShop" className="mobile-brand-icon" />
                        <span className="mobile-brand-name">FlowerShop</span>
                    </div>
                    
                    <div className="mobile-actions">
                        {!isLoggedIn && (
                            <button className="mobile-sign-in-btn" onClick={handleSignIn}>
                                Sign in
                            </button>
                        )}
                        <button className="header-icon-btn cart-btn" aria-label="Cart" onClick={toggleCart}>
                            <img src="/shopping-bag.svg" alt="Cart" className="header-icon" />
                        </button>
                        <button className="header-icon-btn menu-btn" aria-label="Menu" onClick={toggleMenu}>
                            <img src="/menu.svg" alt="Menu" className="header-icon" />
                        </button>
                    </div>
                </header>
            </div>
        </div>
    );
};

export default Header;
