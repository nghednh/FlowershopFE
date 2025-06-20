import React, { useState } from 'react';
import Header from './Header';
import ShoppingCart from './ShoppingCart';
import Menu from './Menu';
import { Outlet } from 'react-router-dom';
import Footer from './Footer'

const Layout: React.FC = () => {
    const [showCart, setShowCart] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const toggleCart = () => {
        setShowCart(!showCart);
    }

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header toggleCart={toggleCart} toggleMenu={toggleMenu} />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />

            <Menu
                isOpen={showMenu}
                onClose={toggleMenu}
            />

            <ShoppingCart
                isOpen={showCart}
                onClose={toggleCart}
            />
        </div>
    );
};

export default Layout;
