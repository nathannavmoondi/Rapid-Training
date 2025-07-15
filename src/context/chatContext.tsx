import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserContextType {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  isLogged: boolean;
  setUser: (user: Partial<UserContextType>) => void;
  logoff: () => void;
}

const defaultUser: UserContextType = {
  accessToken: null,
  refreshToken: null,
  email: null,
  isLogged: false,
  setUser: () => {},
  logoff: () => {},
};

const UserContext = createContext<UserContextType>(defaultUser);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<Omit<UserContextType, 'setUser' | 'logoff'>>(defaultUser);

  // Load from localStorage on startup
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserState({
          accessToken: parsed.accessToken || null,
          refreshToken: parsed.refreshToken || null,
          email: parsed.email || null,
          isLogged: !!parsed.isLogged,
        });
      } catch {}
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const setUser = (newUser: Partial<UserContextType>) => {
    setUserState((prev) => ({ ...prev, ...newUser }));
  };

  const logoff = () => {
    setUserState(defaultUser);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ ...user, setUser, logoff }}>
      {children}
    </UserContext.Provider>
  );
};
