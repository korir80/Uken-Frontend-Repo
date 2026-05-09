import { api, setToken, clearToken } from './api';
import type { AuthResponse, AuthUserDto } from '../types/api';

export const authService = {
  register: (email: string, password: string, fullName: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, fullName }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  me: () => api.get<AuthUserDto>('/auth/me'),

  forgotPassword: (email: string) =>
    api.post<null>('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post<null>('/auth/reset-password', { token, newPassword }),
};

// Re-exported for convenience so callers can import token helpers from the
// same module as the service.
export { setToken, clearToken };
