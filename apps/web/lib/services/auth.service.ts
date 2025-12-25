import { apiClient } from '@/lib/api-client';
import { authStorage } from '@/lib/auth-storage';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from '@/lib/types/auth';

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Save token and user data
    authStorage.setToken(response.accessToken);
    authStorage.setUser(response.user);
    
    return response;
  },

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    
    // Save token and user data
    authStorage.setToken(response.accessToken);
    authStorage.setUser(response.user);
    
    return response;
  },

  /**
   * Logout user
   */
  logout(): void {
    authStorage.clear();
  },

  /**
   * Get current user from storage
   */
  getCurrentUser(): User | null {
    return authStorage.getUser();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!authStorage.getToken();
  },

  /**
   * Get user profile from API
   */
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/users/profile', true);
  },

  /**
   * Get current auth token
   */
  getToken(): string | undefined {
    return authStorage.getToken();
  },
};
