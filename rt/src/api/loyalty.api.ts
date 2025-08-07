import { IUserLoyalty, IUserSummaryLoyalty } from "../types/backend";
import instance from "../config/axios-customize";

export const LoyaltyService = {
  getUserLoyaltyInfo: (): Promise<IUserLoyalty> => {
    return instance.get('/api/loyalty/me');
  },

  redeemLoyaltyPoints: (pointsToRedeem: number): Promise<any> => {
    return instance.post('/api/loyalty/redeem', { pointsToRedeem });
  },

  getAllUsersLoyaltyInfo: (): Promise<{ users: IUserSummaryLoyalty[] }> => {
    return instance.get('/api/loyalty/all');
  },

  updateUserLoyaltyPoints: (userId: number, newPointsValue: number): Promise<any> => {
    return instance.put(`/api/loyalty/update/${userId}`, { newPointsValue });
  },
};
