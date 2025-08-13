import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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

    const location = useLocation();
    // Hide footer on /product/<productId> page
    const hideFooter = /^\/product\/[\w-]+$/.test(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            <Header toggleCart={toggleCart} toggleMenu={toggleMenu} />
            <main className="flex-grow">
                <Outlet />
            </main>
            {!hideFooter && <Footer />}

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
