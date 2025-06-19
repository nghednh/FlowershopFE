import React, { useState } from 'react';
import Header from './Header';
import ShoppingCart from './ShoppingCart';
import { Outlet } from 'react-router-dom';
// import Footer from './Footer'; 

const Layout: React.FC = () => {
    const [showCart, setShowCart] = useState(false);

    const toggleCart = () => {
        setShowCart(!showCart);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header toggleCart={toggleCart} />
            <main className="flex-grow">
                <Outlet />
            </main>
            {/* <Footer /> */}

            <ShoppingCart
                isOpen={showCart}
                onClose={toggleCart}
            />
        </div>
    );
};

export default Layout;
