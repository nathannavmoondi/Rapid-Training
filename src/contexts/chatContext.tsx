import React, { createContext, useContext, useState } from 'react';

interface ChatContextType {
  chatboxSkill: string;
  setChatboxSkill: (skill: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

//return the chat context provider
// this provider will be used to wrap the app and provide the chat context to all components.
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatboxSkill, setChatboxSkill] = useState(''); // storage location to save the chatbox skill and default value

  return (
    <ChatContext.Provider value={{ chatboxSkill, setChatboxSkill }}>
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
