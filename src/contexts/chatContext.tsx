import React, { createContext, useContext, useState } from 'react';
import { ChatMessage } from '../services/chatService';

interface ChatContextType {
  chatboxSkill: string;
  setChatboxSkill: (skill: string) => void;
  isRefresherSession: boolean;
  setIsRefresherSession: (isRefresher: boolean) => void;
  refresherSkill: string;
  setRefresherSkill: (skill: string) => void;
  refresherLevel: string;
  setRefresherLevel: (level: string) => void;
  externalMessages: ChatMessage[];
  addExternalMessage: (message: ChatMessage) => void;
  clearExternalMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

//return the chat context provider
// this provider will be used to wrap the app and provide the chat context to all components.
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatboxSkill, setChatboxSkill] = useState(''); // storage location to save the chatbox skill and default value
  const [isRefresherSession, setIsRefresherSession] = useState(false);
  const [refresherSkill, setRefresherSkill] = useState('');
  const [refresherLevel, setRefresherLevel] = useState('');
  const [externalMessages, setExternalMessages] = useState<ChatMessage[]>([]);

  const addExternalMessage = (message: ChatMessage) => {
    setExternalMessages(prev => [...prev, message]);
  };

  const clearExternalMessages = () => {
    setExternalMessages([]);
  };

  return (
    <ChatContext.Provider value={{ 
      chatboxSkill, 
      setChatboxSkill,
      isRefresherSession,
      setIsRefresherSession,
      refresherSkill,
      setRefresherSkill,
      refresherLevel,
      setRefresherLevel,
      externalMessages, 
      addExternalMessage, 
      clearExternalMessages 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

// hook that returns the context from usecontext.
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// UserContext implementation
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

const getInitialUser = () => {
  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        accessToken: parsed.accessToken || null,
        refreshToken: parsed.refreshToken || null,
        email: parsed.email || null,
        isLogged: !!parsed.isLogged,
      };
    } catch {}
  }
  return defaultUser;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<Omit<UserContextType, 'setUser' | 'logoff'>>(getInitialUser());

  React.useEffect(() => {
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
