// src/services/emailAuthService.ts
import { render } from '@testing-library/react';
// Handles email/password login with backend

export async function loginWithEmail(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string; expires?: string; refreshToken?: string }> {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;
  try {
    const response = await fetch(`${backendUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.text();
         console.log('error logging in', error);
      return { success: false, error: "Invalid email or password" };
    }
    const data = await response.json();
    
    
    // Assume token is returned as { token: "..." }
    return { success: true, token: data.accessToken, expires: data.expiresIn, refreshToken: data.refreshToken };
  } catch (error: any) {
    console.log('error logging in', error);
    return { success: false, error: "Invalid email or password" };
  }
}

export async function registerWithEmail(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;
  try {
    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.text();
      console.log(error); //should just log it not to console
      return { success: false, error: "Unable to create account" };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
