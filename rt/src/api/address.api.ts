import instance from "../config/axios-customize";

export const AddressService = {
  createAddress: (addressData: {
    fullName: string;
    streetAddress: string;
    city: string;
    phoneNumber: string;
  }): Promise<any> => {
    return instance.post('/api/Address', addressData);
  },

  getUserAddresses: (): Promise<any[]> => {
    return instance.get('/api/Address/user');
  },

  getAddressById: (addressId: number): Promise<any> => {
    return instance.get(`/api/Address/${addressId}`);
  },
};
