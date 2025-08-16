import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserLoyaltyInfo, getUserAddresses, updateAddress } from '../config/api';
import { AddressService } from '../api/address.api';
import { IUserLoyalty } from '../types/backend';
import { UserService } from '../api/user.api';

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [loyaltyInfo, setLoyaltyInfo] = useState<IUserLoyalty | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        userName: '',
        role: '',
    });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });

    // Address management
    const [addresses, setAddresses] = useState<any[]>([]);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        streetAddress: '',
        city: '',
        phoneNumber: ''
    });
    const [addressSearchTerm, setAddressSearchTerm] = useState('');

    // Password change
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await UserService.getUserProfile();
                setUserData({
                    userName: response.data.userName || '',
                    role: response.data.role || ''
                });
                setFormData({
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    email: response.data.email || '',
                    phoneNumber: response.data.phoneNumber || '',
                });
                console.log('Form data:', formData);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                navigate('/login');
            }
        };

        fetchProfileData();
        loadLoyaltyInfo();
        loadAddresses();
    }, [navigate]);

    const loadLoyaltyInfo = async () => {
        try {
            setLoading(true);
            const response = await getUserLoyaltyInfo();
            setLoyaltyInfo(response);
        } catch (error) {
            console.error('Error loading loyalty info:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const response = await getUserAddresses();
            setAddresses(response);
        } catch (error) {
            console.error('Error loading addresses:', error);
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

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditAddress = (address: any) => {
        setEditingAddressId(address.id);
        setAddressForm({
            fullName: address.fullName,
            streetAddress: address.streetAddress,
            city: address.city,
            phoneNumber: address.phoneNumber
        });
    };

    const handleSaveAddress = async () => {
        if (editingAddressId === null) return;
        try {
            setLoading(true);
            await updateAddress(editingAddressId, addressForm);
            setEditingAddressId(null);
            loadAddresses();
            alert('Address updated successfully!');
        } catch (error) {
            console.error('Error updating address:', error);
            alert('Failed to update address');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEditAddress = () => {
        setEditingAddressId(null);
    };

    const handleSaveProfile = async () => {
        const updatedUser = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
        };
        await UserService.updateUserProfile(updatedUser);
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const handleDeleteAddress = async (addressId: number) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        setLoading(true);
        try {
            await AddressService.deleteAddress(addressId);
            loadAddresses();
            alert('Address deleted successfully!');
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete address');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
        setPasswordError(null);
        setPasswordSuccess(null);
    };

    const handleSubmitChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
            setPasswordError("All fields are required.");
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        try {
            await UserService.changeUserPassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmNewPassword: passwordForm.confirmNewPassword
            });
            setPasswordSuccess("Password changed successfully!");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        } catch (error: any) {
            setPasswordError(error.message || "Failed to change password.");
        }
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
                                    {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : '?'}
                                </span>
                            </div>
                            <div className="text-white">
                                <h1 className="text-3xl font-bold">{userData.userName || 'User'}</h1>
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
                                    {userData?.role === 'Admin' ? 'Admin' : 'User'}
                                </div>
                                <div className="text-gray-600">Role</div>
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
                                    First Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your first name"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                        {formData.firstName || 'Not provided'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your last name"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                        {formData.lastName || 'Not provided'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                    {formData.email || 'Not provided'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your phone number"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                        {formData.phoneNumber || 'Not provided'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="px-8 py-8 border-t">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Addresses</h2>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={addressSearchTerm}
                                onChange={e => setAddressSearchTerm(e.target.value)}
                                placeholder="Search address by name..."
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>
                        {loading ? (
                            <div>Loading addresses...</div>
                        ) : (
                            <div
                                className="overflow-y-auto"
                                style={{ maxHeight: '320px', minHeight: '160px' }}
                            >
                                {addresses
                                    .filter(address =>
                                        address.fullName
                                            .toLowerCase()
                                            .includes(addressSearchTerm.toLowerCase())
                                    )
                                    .length === 0 ? (
                                    <div>No addresses found.</div>
                                ) : (
                                    addresses
                                        .filter(address =>
                                            address.fullName
                                                .toLowerCase()
                                                .includes(addressSearchTerm.toLowerCase())
                                        )
                                        .map(address => (
                                            <div key={address.id} className="mb-4 p-4 bg-gray-100 rounded flex flex-col">
                                                {editingAddressId === address.id ? (
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="fullName"
                                                            value={addressForm.fullName}
                                                            onChange={handleAddressChange}
                                                            placeholder="Full Name"
                                                            className="mb-2 w-full px-2 py-1 border rounded"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="streetAddress"
                                                            value={addressForm.streetAddress}
                                                            onChange={handleAddressChange}
                                                            placeholder="Street Address"
                                                            className="mb-2 w-full px-2 py-1 border rounded"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="city"
                                                            value={addressForm.city}
                                                            onChange={handleAddressChange}
                                                            placeholder="City"
                                                            className="mb-2 w-full px-2 py-1 border rounded"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="phoneNumber"
                                                            value={addressForm.phoneNumber}
                                                            onChange={handleAddressChange}
                                                            placeholder="Phone Number"
                                                            className="mb-2 w-full px-2 py-1 border rounded"
                                                        />
                                                        <button
                                                            onClick={handleSaveAddress}
                                                            className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEditAddress}
                                                            className="px-3 py-1 bg-gray-400 text-white rounded"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div><strong>Name:</strong> {address.fullName}</div>
                                                        <div><strong>Street:</strong> {address.streetAddress}</div>
                                                        <div><strong>City:</strong> {address.city}</div>
                                                        <div><strong>Phone:</strong> {address.phoneNumber}</div>
                                                        <div className="mt-2 flex gap-2">
                                                            <button
                                                                onClick={() => handleEditAddress(address)}
                                                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAddress(address.id)}
                                                                className="px-3 py-1 bg-red-600 text-white rounded"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Change Password Section */}
                    <div className="px-8 py-8 border-t">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                        </div>
                        <div className="mt-8">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowChangePassword(!showChangePassword)}
                            >
                                {showChangePassword ? "Hide Change Password" : "Change Password"}
                            </button>
                            {showChangePassword && (
                                <form className="mt-4 space-y-4" onSubmit={handleSubmitChangePassword}>
                                    <div>
                                        <label className="block font-medium mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="auth-input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            className="auth-input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmNewPassword"
                                            value={passwordForm.confirmNewPassword}
                                            onChange={handlePasswordChange}
                                            className="auth-input"
                                            required
                                        />
                                    </div>
                                    {passwordError && <div className="error-message">{passwordError}</div>}
                                    {passwordSuccess && <div className="auth-message success">{passwordSuccess}</div>}
                                    <button type="submit" className="auth-button">Update Password</button>
                                </form>
                            )}
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
