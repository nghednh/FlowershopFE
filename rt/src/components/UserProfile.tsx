import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserLoyaltyInfo } from '../config/api';
import { IUserLoyalty } from '../types/backend';

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [loyaltyInfo, setLoyaltyInfo] = useState<IUserLoyalty | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        // Get user data from localStorage
        const user = localStorage.getItem('user');
        const parsedUserData = user && user !== 'null' ? JSON.parse(user) : null;
        
        if (!parsedUserData) {
            navigate('/login');
            return;
        }

        console.log('User Data:', parsedUserData);
        setUserData(parsedUserData);

        // Initialize form data with user information
        setFormData({
            name: parsedUserData.name || '',
            email: parsedUserData.email || '',
            phone: parsedUserData.phone || '',
            address: parsedUserData.address || ''
        });

        loadLoyaltyInfo();
    }, [navigate]); // Remove userData from dependency array

    const loadLoyaltyInfo = async () => {
        try {
            setLoading(true);
            const response = await getUserLoyaltyInfo();
            console.log('Loyalty Info:', response);
            setLoyaltyInfo(response);
        } catch (error) {
            console.error('Error loading loyalty info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = () => {
        // In a real application, you would send this data to your API
        console.log('Saving profile data:', formData);
        
        // Update localStorage with new data
        const updatedUser = {
            ...userData,
            name: formData.name,
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        
        // Show success message (you can replace with a proper toast notification)
        alert('Profile updated successfully!');
    };

    if (!userData) {
        return null; // User will be redirected to login
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-3xl font-bold text-purple-600">
                                    {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                                </span>
                            </div>
                            <div className="text-white">
                                <h1 className="text-3xl font-bold">{formData.name || 'User'}</h1>
                                <p className="text-purple-100 text-lg">{formData.email}</p>
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mt-2">
                                    {userData.role || 'Customer'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-gray-50 px-8 py-6 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                    {loading ? '...' : loyaltyInfo?.currentPoints || 0}
                                </div>
                                <div className="text-gray-600">Loyalty Points</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                    {loading ? '...' : loyaltyInfo?.transactions?.length || 0}
                                </div>
                                <div className="text-gray-600">Transactions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                    {userData?.role === 'Admin' ? 'Admin' : 'Customer'}
                                </div>
                                <div className="text-gray-600">Account Type</div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="px-8 py-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="space-x-3">
                                    <button
                                        onClick={handleSaveProfile}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your full name"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                        {formData.name || 'Not provided'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your email"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                        {formData.email || 'Not provided'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your phone number"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                        {formData.phone || 'Not provided'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your address"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[84px]">
                                        {formData.address || 'Not provided'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-50 px-8 py-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => navigate('/orderhistory')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                            >
                                View Order History
                            </button>
                            <button
                                onClick={() => navigate('/list')}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                            >
                                Shop Now
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
