import React, { createContext, useContext, useState } from 'react';

interface ChatContextType {
  chatboxSkill: string;
  setChatboxSkill: (skill: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatboxSkill, setChatboxSkill] = useState('');

  return (
    <ChatContext.Provider value={{ chatboxSkill, setChatboxSkill }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
