// API Configuration
export const API_URL = 'http://192.168.87.144:3000/api';

// API Endpoints
export const ENDPOINTS = {
  SIGNUP: '/signup',
  LOGIN: '/login',
  VERIFY_EMAIL: '/verify-email',
  RESEND_VERIFICATION: '/resend-verification',
  ME: '/me',
  LOGOUT: '/logout',
} as const; 