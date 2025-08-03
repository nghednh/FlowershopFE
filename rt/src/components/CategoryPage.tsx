import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import Footer from "./Footer";

export default function CategoryPage() {
    const navigate = useNavigate();

    const handleShopNow = (category?: string) => {
        // Navigate to products page with optional category filter
        if (category) {
            navigate(`/list?categories=${category}`);
        } else {
            navigate('/list');
        }
    };

    const flowerCategories = [
        { name: "Fresh Roses", image: "🌹", color: "bg-red-100" },
        { name: "Sunflowers", image: "🌻", color: "bg-yellow-100" },
        { name: "Tulips", image: "🌷", color: "bg-pink-100" },
        { name: "Lilies", image: "🪷", color: "bg-purple-100" },
        { name: "Daisies", image: "🌼", color: "bg-white" },
        { name: "Orchids", image: "🌺", color: "bg-purple-100" },
        { name: "Carnations", image: "🌸", color: "bg-pink-100" },
        { name: "Peonies", image: "🌺", color: "bg-red-100" },
        { name: "Hydrangeas", image: "💐", color: "bg-blue-100" },
        { name: "Mixed Bouquet", image: "💐", color: "bg-green-100" }
    ];

    return (
        <div className="min-h-screen">
            <div className="sticky top-0 z-50 bg-gray-100">
            </div>
            
            {/* Main Content */}
            <div className="w-full flex flex-col lg:flex-row">
                {/* Featured Flower Section */}
                <div className="w-full lg:w-1/2 aspect-square bg-gradient-to-br from-pink-200 to-rose-300 border border-gray-400 relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div className="text-8xl mb-4">🌹</div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Premium Rose Collection</h1>
                        <p className="text-lg text-gray-600 text-center mb-6">
                            Discover our exquisite selection of fresh, hand-picked roses perfect for any occasion
                        </p>
                        <button 
                            onClick={() => handleShopNow('roses')}
                            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Shop Premium Roses →
                        </button>
                    </div>
                </div>
                
                {/* Flower Grid */}
                <div className="w-full md:grid md:grid-cols-2 lg:w-1/2">
                    {flowerCategories.map((flower, index) => (
                        <div 
                            key={index}
                            className={`aspect-square ${flower.color} border border-gray-400 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105`}
                            onClick={() => handleShopNow(flower.name.toLowerCase())}
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {flower.image}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                                    {flower.name}
                                </h3>
                                <p className="text-sm text-gray-600 text-center mb-3">
                                    Beautiful {flower.name.toLowerCase()} for every occasion
                                </p>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-sm text-gray-700 font-medium">
                                        Shop Now →
                                    </span>
                                </div>
                            </div>
                            
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-white bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="w-full md:grid md:grid-cols-2 lg:flex lg:flex-row">
                {/* Email Reminder */}
                <div className="lg:flex-1 aspect-2/3 bg-yellow-200 border border-gray-400 relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div className="text-6xl mb-4">💌</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Flower Reminders</h3>
                        <p className="text-gray-600 text-center mb-6">
                            Never miss special occasions! Get reminded for Valentine's Day, Mother's Day, and more.
                        </p>
                        <div className="w-full max-w-sm">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <button className="w-full bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                                Set Reminders
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Us */}
                <div className="lg:flex-1 bg-purple-200 border border-gray-400 relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div className="text-6xl mb-4">📞</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Contact Us</h3>
                        <div className="text-center space-y-3">
                            <p className="text-gray-600">
                                <span className="font-semibold">Phone:</span> +0123456789
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Email:</span> FlowerShop.Shop@gmail.com
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Hours:</span> 8 AM - 11 PM
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate('/contact')}
                            className="mt-6 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                        >
                            Get in Touch
                        </button>
                    </div>
                </div>

                {/* Shop Categories */}
                <div className="lg:flex-1 bg-pink-200 border border-gray-400 relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div className="text-6xl mb-4">🛍️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Shop by Category</h3>
                        <div className="space-y-2 text-center">
                            <button 
                                onClick={() => handleShopNow('fresh')} 
                                className="block w-full text-gray-700 hover:text-gray-900 hover:underline transition-colors duration-300"
                            >
                                Fresh Flowers
                            </button>
                            <button 
                                onClick={() => handleShopNow('dried')} 
                                className="block w-full text-gray-700 hover:text-gray-900 hover:underline transition-colors duration-300"
                            >
                                Dried Flowers
                            </button>
                            <button 
                                onClick={() => handleShopNow('plants')} 
                                className="block w-full text-gray-700 hover:text-gray-900 hover:underline transition-colors duration-300"
                            >
                                Live Plants
                            </button>
                            <button 
                                onClick={() => handleShopNow('arrangements')} 
                                className="block w-full text-gray-700 hover:text-gray-900 hover:underline transition-colors duration-300"
                            >
                                Custom Arrangements
                            </button>
                        </div>
                    </div>
                </div>

                {/* About Us */}
                <div className="lg:flex-1 bg-blue-200 border border-gray-400 relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div className="text-6xl mb-4">🌿</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">About FlowerShop</h3>
                        <p className="text-gray-600 text-center mb-6">
                            We're passionate about bringing beauty and joy through fresh, quality flowers. 
                            Founded with love for nature's artistry.
                        </p>
                        <div className="space-y-2 text-center">
                            <p className="text-sm text-gray-600">✓ Fresh, hand-picked flowers</p>
                            <p className="text-sm text-gray-600">✓ Same-day delivery</p>
                            <p className="text-sm text-gray-600">✓ Expert floral arrangements</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="h-[15vh] bg-gray-100 flex items-center justify-center">
                <p className="text-gray-600 text-center">
                    Discover the perfect flowers for every moment at FlowerShop
                </p>
            </section>
        </div>
    )
}