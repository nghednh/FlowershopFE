import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
    toggleCart: () => void;
    toggleMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleCart, toggleMenu }) => {
    const navigate = useNavigate();

    // Check if user is logged in
    const user = localStorage.getItem('user');
    const isLoggedIn = user && user !== 'null';
    const userData = isLoggedIn ? JSON.parse(user) : null;

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
        navigate('/list');
    };

    const handleContact = () => {
        navigate('/contact');
    };

    return (
        <header className="header">
            {/* Desktop */}
            <div className="header-left desktop-only">
                <button className="header-button" onClick={handleShop}
                >
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
                <button className="header-button"
                    onClick={toggleCart}
                >
                    Cart
                </button>
            </div>

            {/* Mobile */}
            <div className="header-mobile mobile-only">
                <button className="header-icon-btn" aria-label="Menu"
                    onClick={toggleMenu}
                >
                    <img src="/menu.svg" alt="Menu" className="header-icon" />
                </button>
                <button className="header-icon-btn" aria-label="Cart"
                    onClick={toggleCart}
                >
                    <img src="/shopping-bag.svg" alt="Cart" className="header-icon" />
                </button>
            </div>
        </header>
    );
};

export default Header;
