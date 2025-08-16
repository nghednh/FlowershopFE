import instance from "../config/axios-customize";

export const UserService = {
    getUserProfile: (): Promise<any> => {
        return instance.get('/api/User/profile');
    },

    updateUserProfile: (profileData: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    }): Promise<any> => {
        return instance.put('/api/User/profile', profileData);
    },

    getUserLoyaltyPoints: (): Promise<any> => {
        return instance.get('/api/User/loyalty-points');
    },

    changeUserPassword: (data: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }): Promise<any> => {
        return instance.post('/api/User/change-password', data);
    }
};
