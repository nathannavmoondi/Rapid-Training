import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField, IconButton, Typography, Avatar } from '@mui/material';
import { useChat } from '../contexts/chatContext';
import SendIcon from '@mui/icons-material/Send';
import { SvgIcon } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { chatService, ChatMessage } from '../services/chatService';
import Prism from 'prismjs';
// Import Prism theme
import 'prismjs/themes/prism-tomorrow.css';
// Import language support
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';

const BuddyIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    {/* Yellow smiley face with tongue */}
    <circle fill="#FFD700" cx="12" cy="12" r="10" />
    {/* Eyes */}
    <ellipse fill="#000" cx="8.5" cy="9" rx="1.5" ry="2" />
    <ellipse fill="#000" cx="15.5" cy="9" rx="1.5" ry="2" />
    {/* Smile with tongue */}
    <path
      fill="#000"
      d="M6 11.5C6 15 8.686 17 12 17s6-2 6-5.5H6z"
    />
    <path
      fill="#FF9999"
      d="M8 14.5c1.333 1 2.667 1.5 4 1.5s2.667-.5 4-1.5c-1.333-.5-2.667-.75-4-.75s-2.667.25-4 .75z"
    />
  </SvgIcon>
);

interface TypewriterTextProps {
  text: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(c => c + 1);
      }, 30); // Adjust speed here

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  return <>{displayedText}</>;
};

export const Chat: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { chatboxSkill } = useChat();
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    text: "Hi. I'm Mr. Buddy. What question do you have about " + (chatboxSkill || 'this topic') + "?",
    isUser: false,
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const initialX = useRef(0);
  const initialWidth = useRef(0);
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    initialX.current = e.clientX;
    initialWidth.current = width;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = e.clientX - initialX.current;
      const newWidth = Math.min(Math.max(initialWidth.current - deltaX, 400), window.innerWidth * 0.8);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    const loadingMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      text: "Thinking...",
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');

    try {
      const response = await chatService.respondChat(input, chatboxSkill || 'general');
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id ? response : msg
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id ? {
            id: Math.random().toString(36).substring(7),
            text: "Sorry, I encountered an error. Please try again.",
            isUser: false,
            timestamp: new Date()
          } : msg
        )
      );
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        document.querySelectorAll('pre code').forEach((block) => {
          if (block instanceof HTMLElement) {
            Prism.highlightElement(block);
          }
        });
      }, 100);
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 20,
        top: 60,
        bottom: 20,
        width: `${width}px`,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        color: '#000000',
        zIndex: 1400,
        borderRadius: '12px',
        boxShadow: '0 2px 24px rgba(0, 0, 0, 0.15)',
        transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + 20px))',
        transition: isResizing ? 'none' : 'transform 0.3s ease-in-out'
      }}
    >
      {/* Resize Handle */}      <Box
        onMouseDown={handleMouseDown}
        sx={{
          position: 'absolute',
          left: -4,
          top: 0,
          bottom: 0,
          width: '8px',
          cursor: 'ew-resize',
          zIndex: 2000,
          backgroundColor: isResizing ? 'rgba(0, 83, 167, 0.2)' : 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(0, 83, 167, 0.1)'
          }
        }}
      />

      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#0053A7',
          color: '#fff',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: '#0053A7' }}>
            <BuddyIcon />
          </Avatar>
          <Typography>AI Assistant {chatboxSkill ? `(${chatboxSkill})` : ''}</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start',
              flexDirection: message.isUser ? 'row-reverse' : 'row'
            }}
          >
            {!message.isUser && (
              <Avatar sx={{ bgcolor: message.text === "Thinking..." ? '#999' : '#0053A7' }}>
                <BuddyIcon />
              </Avatar>
            )}
            <Box
              sx={{
                backgroundColor: message.isUser ? '#007AFF' : '#F1F2F6',
                color: message.isUser ? '#fff' : '#000',
                borderRadius: '12px',
                p: 2,
                maxWidth: '85%'
              }}
            >              <Box
                component="div"
                sx={{
                  fontStyle: message.text === "Thinking..." ? 'italic' : 'normal',
                  opacity: message.text === "Thinking..." ? 0.7 : 1,
                  '& pre': {
                    margin: '8px 0',
                    borderRadius: '4px',
                    overflow: 'auto'
                  },
                  '& code': {
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    backgroundColor: '#1e1e1e !important',
                    color: '#d4d4d4',
                    padding: '12px',
                    display: 'block',
                    overflowX: 'auto',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  },
                  '& .token.comment': { color: '#6A9955' },
                  '& .token.string': { color: '#CE9178' },
                  '& .token.number': { color: '#B5CEA8' },
                  '& .token.keyword': { color: '#569CD6' },
                  '& .token.function': { color: '#DCDCAA' },
                  '& .token.class-name': { color: '#4EC9B0' }
                }}
                dangerouslySetInnerHTML={{ 
                  __html: message.text 
                }}
                ref={node => {
                  if (node instanceof HTMLElement && !message.isUser) {
                    const codeBlocks = node.querySelectorAll('code');
                    codeBlocks.forEach(block => {
                      Prism.highlightElement(block);
                    });
                  }
                }}
              />
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          borderTop: '2px solid #D1D1D1',
          backgroundColor: '#F8F9FA'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center'
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask me about ${chatboxSkill || 'anything'}...`}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#F1F2F6',
                color: '#000',
                borderColor: '#D1D1D1',
                '& fieldset': {
                  borderColor: '#999',
                  borderWidth: '1px'
                },
                '&:hover fieldset': {
                  borderColor: '#666'
                },
                '&.Mui-focused': {
                  '& > fieldset': {
                    borderColor: '#0053A7',
                    borderWidth: '1px'
                  }
                }
              },
              '& .MuiInputBase-input': {
                color: '#000'
              },
              '& .MuiOutlinedInput-input::placeholder': {
                color: '#666',
                opacity: 1
              }
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{
              bgcolor: '#0053A7',
              color: '#fff',
              '&:hover': {
                bgcolor: '#003E7D'
              },
              '&.Mui-disabled': {
                bgcolor: '#E5E5E5',
                color: '#999'
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
