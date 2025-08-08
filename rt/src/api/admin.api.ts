import { IUser } from "../types/backend";
import instance from "../config/axios-customize";

export const AdminService = {
  registerUser: (user: Omit<IUser, 'id'>): Promise<IUser> => {
    return instance.post('/api/admin/register-new-user', user);
  },

  getUsers: (): Promise<IUser[]> => {
    return instance.get('/api/admin/users');
  },

  updateUserRole: (userId: string, newRoleName: string): Promise<string> => {
    return instance.post(`/api/admin/update-user-role`, { userId, newRoleName });
  },
};
