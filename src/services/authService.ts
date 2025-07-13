// src/services/authService.ts
// Handles Google login and backend integration

export async function googleLoginWithBackend(idToken: string): Promise<{ success: boolean; user?: any; error?: string }> {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;
  try {
    const response = await fetch(`${backendUrl}/api/auth/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }
    const user = await response.json();
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
