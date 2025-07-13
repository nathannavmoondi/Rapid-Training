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
      return { success: false, error };
    }
    const data = await response.json();

    
    
    // Assume token is returned as { token: "..." }
    return { success: true, token: data.accessToken, expires: data.expiresIn, refreshToken: data.refreshToken };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
