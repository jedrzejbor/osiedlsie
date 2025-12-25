import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authStorage = {
  // Token management
  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    Cookies.set(TOKEN_KEY, token, {
      expires: 7, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  },

  removeToken: (): void => {
    Cookies.remove(TOKEN_KEY);
  },

  // User management
  getUser: (): any | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  // Clear all auth data
  clear: (): void => {
    authStorage.removeToken();
    authStorage.removeUser();
  },
};
