import { LoginResponse, RegisterResponse } from './interfaces/apiResponseInterfaces';
import { RegisterUserDto, LoginDto } from './interfaces/apiDtoInterfaces';
import api from './api';

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await api.get('/auth/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.valid;
  } catch (error) {
    console.error('Invalid token or error validating:', error);
    return false;
  }
};

export const register = async (userData: RegisterUserDto): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const login = async (credentials: LoginDto): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', credentials);
    console.log(credentials);
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data, error.message);
    throw error.response?.data || error.message;
  }
};

