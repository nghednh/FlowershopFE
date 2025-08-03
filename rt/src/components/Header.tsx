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
                navigate('/orderhistory'); // or user profile page
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
        navigate('/products');
    };

    const handleContact = () => {
        navigate('/contact');
    };

    return (
        <div>
            {/* Loyalty Points Bar - Only show if logged in */}
            {isLoggedIn && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 text-sm">
                    <div className="max-w-7xl mx-auto flex justify-center items-center space-x-6">
                        {loading ? (
                            <span>Loading rewards...</span>
                        ) : loyaltyInfo ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold"> 🏆 {loyaltyInfo.currentPoints} Points</span>
                                </div>
                            </>
                        ) : (
                            <span className="text-xs">Loyalty rewards unavailable</span>
                        )}
                    </div>
                </div>
            )}
            
            <header className="header">
                {/* Desktop */}
                <div className="header-left desktop-only">
                    <button className="header-button" onClick={handleShop}>
                        Shop
                    </button>
                    <button className="header-button" onClick={handleContact}>
                        Contact
                    </button>
                </div>
                <div className="header-right desktop-only">
                    <button className="header-button" onClick={handleSignIn}>
                        {isLoggedIn 
                            ? (userData?.role === 'Admin' ? 'Admin CMS' : 'Order History')
                            : 'Sign in'
                        }
                    </button>
                    {isLoggedIn && (
                        <button className="header-button" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                    <button className="header-button" onClick={toggleCart}>
                        Cart
                    </button>
                </div>

                {/* Mobile */}
                <div className="header-mobile mobile-only">
                    <button className="header-icon-btn" aria-label="Menu" onClick={toggleMenu}>
                        <img src="/menu.svg" alt="Menu" className="header-icon" />
                    </button>
                    <button className="header-icon-btn" aria-label="Cart" onClick={toggleCart}>
                        <img src="/shopping-bag.svg" alt="Cart" className="header-icon" />
                    </button>
                </div>
            </header>
        </div>
    );
};

export default Header;
