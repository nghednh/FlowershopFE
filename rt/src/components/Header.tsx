import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            {/* Desktop */}
            <div className="header-left desktop-only">
                <button className="header-button">
                    Shop
                </button>
                <button className="header-button">
                    Contact
                </button>
            </div>
            <div className="header-right desktop-only">
                <button className="header-button">
                    Sign in
                </button>
                <button className="header-button"
                    onClick={() =>
                        alert('Cart functionality not implemented yet.'
                        )}
                >
                    Cart
                </button>
            </div>
            {/* Mobile */}
            <div className="header-mobile mobile-only">
                <button className="header-icon-btn" aria-label="Menu">
                    <img src="/menu.svg" alt="Menu" className="header-icon" />
                </button>
                <button className="header-icon-btn" aria-label="Cart"
                    onClick={() =>
                        alert('Cart functionality not implemented yet.'
                        )}
                >
                    <img src="/shopping-bag.svg" alt="Cart" className="header-icon" />
                </button>
            </div>
        </header>
    );
};

export default Header;
