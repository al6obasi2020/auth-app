import api from '@api/axiosInstance';
import Cookies, { CookieAttributes } from 'js-cookie';

interface AuthData {
  email: string;
  password: string;
}

interface SignupData extends AuthData {
  name: string;
}

const TOKEN_OPTIONS = { secure: true, sameSite: 'strict' };

const storeTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set('accessToken', accessToken, TOKEN_OPTIONS as CookieAttributes);
  Cookies.set('refreshToken', refreshToken, TOKEN_OPTIONS as CookieAttributes);
};

export const signup = async (data: SignupData) => {
  try {
    const response = await api.post('/auth/signup', data);
    const { accessToken, refreshToken } = response.headers;

    if (accessToken && refreshToken) {
      storeTokens(accessToken, refreshToken);
    }

    return response.data;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

export const signin = async (data: AuthData) => {
  try {
    const response = await api.post('/auth/signin', data);
    const { accessToken, refreshToken } = response.headers;

    if (accessToken && refreshToken) {
      storeTokens(accessToken, refreshToken);
    }

    return response.data;
  } catch (error) {
    console.error('Signin failed:', error);
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await api.get('/user/userInfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Fetching user info failed:', error);
    throw error;
  }
};
