import { ILoginResponse, IUserRegister } from "../types/backend";
import instance from "../config/axios-customize";

export const AuthService = {
  loginAccount: (email: string, password: string): Promise<ILoginResponse> => {
    return instance.post('/api/login', { email, password });
  },

  registerAccount: (
    firstname: string,
    lastname: string,
    email: string,
    username: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string
  ): Promise<IUserRegister> => {
    return instance.post('/api/register', {
      firstName: firstname,
      lastName: lastname,
      email,
      userName: username,
      phoneNumber,
      password,
      confirmPassword
    });
  },
};
