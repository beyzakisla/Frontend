import { Cookies } from 'react-cookie';

const BASE_URL = 'https://api.aquai.tech/api/users';
const JWT_URL = 'https://api.aquai.tech/jwt';
const cookies = new Cookies();

const apiService = {

  register: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },


  login: async (credentials) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Failed to log in');
      }

      const data = await response.json();
      if (data.access_token) {
        cookies.set('access_token', data.access_token, {
          path: '/',
          maxAge: 3600,
          secure: true,
          sameSite: 'strict',
        });
      }
      if (data.refresh_token) {
        cookies.set('refresh_token', data.refresh_token, {
          path: '/',
          maxAge: 36000,
          secure: true,
          sameSite: 'strict',
        });
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getToken: () => {
    return cookies.get('access_token');
  },

  logout: () => {
    cookies.remove('access_token', { path: '/' });
  },

  verifyToken: async () => {
    try {
      const token = apiService.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${JWT_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to verify token');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  isTokenExpired: (token) => {
    if (!token) {
      throw new Error('Token is undefined or null');
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  },

  refreshToken: async () => {
    try {
      const refresh_token = cookies.get('refresh_token');
      if (!refresh_token) {
        throw new Error('No refresh token found');
      }

      const response = await fetch(`${JWT_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refresh_token}`,
        },
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(response);
      }

      const data = await response.json();
      if (data.access_token) {
        cookies.set('access_token', data.access_token, {
          path: '/',
          maxAge: 3600,
          secure: true,
          sameSite: 'strict',
        });
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

};

export default apiService;