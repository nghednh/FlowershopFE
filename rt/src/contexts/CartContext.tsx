import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addToCart, getCartItemCount, getCartDetails, removeFromCart as removeCartItem, updateCartItem as updateCartItemAPI, getDynamicPrice } from '../config/api';

interface CartItem {
    id: number;
    cartId: number;
    productId: number;
    productName: string;
    price: number;
    basePrice: number; // Add base price
    dynamicPrice?: number; // Add dynamic price
    quantity: number;
    subTotal: number;
    productImage: string;
}

interface CartContextType {
    cartItemCount: number;
    cartItems: CartItem[];
    totalAmount: number;
    refreshCart: () => Promise<void>;
    addItemToCart: (productId: number, quantity: number) => Promise<boolean>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItemCount, setCartItemCount] = useState<number>(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const refreshCart = async () => {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        const isLoggedIn = user && user !== 'null';
        
        if (!isLoggedIn) {
            // Reset cart state for unlogged users
            setCartItemCount(0);
            setCartItems([]);
            setTotalAmount(0);
            return;
        }

        try {
            setIsLoading(true);
            const response = await getCartDetails();
            console.log('Cart details response:', response);

            // Fetch dynamic prices for each cart item
            const cartItemsWithDynamicPrices = await Promise.all(
                (response?.cartItems || []).map(async (item: any) => {
                    try {
                        const currentTime = new Date().toISOString();
                        const priceResponse = await getDynamicPrice(item.productId, currentTime);

                        return {
                            ...item,
                            basePrice: item.price, // Assuming current price is base price
                            dynamicPrice: priceResponse?.dynamicPrice || undefined
                        };
                    } catch (error) {
                        console.error(`Error fetching dynamic price for product ${item.productId}:`, error);
                        return {
                            ...item,
                            basePrice: item.price,
                            dynamicPrice: undefined
                        };
                    }
                })
            );

            setCartItemCount(response.totalItems || 0);
            setCartItems(cartItemsWithDynamicPrices);
            setTotalAmount(response.totalAmount || 0);

        } catch (error) {
            console.error('Error fetching cart details:', error);
            // Fallback to just getting count
            try {
                const countResponse = await getCartItemCount();
                console.log('Cart item count response:', countResponse);
                setCartItemCount(countResponse?.count || 0);
            } catch (countError) {
                console.error('Error fetching cart count:', countError);
                // Set empty cart for unlogged users
                setCartItemCount(0);
                setCartItems([]);
                setTotalAmount(0);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const addItemToCart = async (productId: number, quantity: number): Promise<boolean> => {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        const isLoggedIn = user && user !== 'null';
        
        if (!isLoggedIn) {
            // Show login prompt for unlogged users
            if (window.confirm('Please sign in to add items to your cart. Would you like to go to the login page?')) {
                window.location.href = '/login';
            }
            return false;
        }

        setIsLoading(true);
        try {
            const response = await addToCart(productId, quantity);
            console.log('Add to cart response:', response);
            await refreshCart();

            return true;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        setIsLoading(true);
        try {
            const response = await removeCartItem(cartItemId);
            console.log('Remove from cart response:', response);
            // Refresh cart data after removing item
            await refreshCart();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateCartItem = async (cartItemId: number, quantity: number) => {
        setIsLoading(true);
        try {
            const response = await updateCartItemAPI(cartItemId, quantity);
            console.log('Update cart item response:', response);
            // Refresh cart data after updating item
            await refreshCart();
        } catch (error) {
            console.error('Error updating cart item:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider value={{
            cartItemCount,
            cartItems,
            totalAmount,
            refreshCart,
            addItemToCart,
            removeFromCart,
            updateCartItem,
            isLoading
        }}>
            {children}
        </CartContext.Provider>
    );
};