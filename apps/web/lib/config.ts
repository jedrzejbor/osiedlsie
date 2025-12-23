export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  auth: {
    register: `${API_URL}/auth/register`,
    login: `${API_URL}/auth/login`,
  },
  users: {
    profile: `${API_URL}/users/profile`,
    admin: `${API_URL}/users/admin`,
    public: `${API_URL}/users/public`,
  },
} as const;
