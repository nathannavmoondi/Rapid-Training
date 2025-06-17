import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Avatar } from '@mui/material';
import { useChat } from '../contexts/chatContext';
import SendIcon from '@mui/icons-material/Send';
import { SvgIcon } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { chatService, ChatMessage } from '../services/chatService';

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
    text: "Hi. I'm Mr. Buddy. What question do you have on this topic?",
    isUser: false,
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatService.sendMessage(input);
      setIsTyping(false);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      setIsTyping(false);
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (    <Box
      sx={{        position: 'fixed',
        right: 20,
        top: 60, // Below navbar (40px height + 20px margin)
        bottom: 20,
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        color: '#000000',
        zIndex: 1400,
        borderRadius: '12px',
        boxShadow: '0 2px 24px rgba(0, 0, 0, 0.15)',
        transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + 20px))',
        transition: 'transform 0.3s ease-in-out',
        overflow: 'hidden'
      }}    >
      {/* Header */}      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          height: '48px',
          bgcolor: '#0053A7',
          color: '#fff'
        }}
      >
        <Avatar 
          sx={{ 
            width: 32,
            height: 32,
            bgcolor: '#0053A7'
          }}
        >
          <BuddyIcon sx={{ fontSize: 20 }} />
        </Avatar>        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
            AI Assistant{chatboxSkill ? ` (${chatboxSkill})` : ''}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ 
            color: '#fff',
            padding: '4px',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Messages area */}      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: '#fff'
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start',
              flexDirection: message.isUser ? 'row-reverse' : 'row',
            }}
          >
            {!message.isUser && (
              <Avatar sx={{ bgcolor: '#1976d2' }}>
                <BuddyIcon />
              </Avatar>
            )}
            <Box
              sx={{
                backgroundColor: message.isUser ? '#007AFF' : '#F1F2F6',
                borderRadius: '16px',
                p: 2,
                px: 2.5,
                maxWidth: '85%',
                color: message.isUser ? '#fff' : '#000',
              }}
            >
              <Typography>
                {message.isUser ? (
                  message.text
                ) : (
                  <TypewriterText text={message.text} />
                )}
              </Typography>
            </Box>
          </Box>
        ))}
        {isTyping && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Avatar sx={{ bgcolor: '#1976d2' }}>
              <BuddyIcon />
            </Avatar>
            <Box
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                p: 2,
                maxWidth: '70%',
              }}
            >
              <Typography>...</Typography>
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message..."
            multiline
            maxRows={4}
            sx={{              '& .MuiOutlinedInput-root': {
                bgcolor: '#F1F2F6',
                borderRadius: '24px',
                color: '#000000',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiOutlinedInput-input': {
                padding: '12px 20px',
                color: '#000000',
                '&::placeholder': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  opacity: 1,
                },
              },
            }}
          />
          <IconButton 
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{ 
              color: input.trim() ? '#fff' : 'rgba(255, 255, 255, 0.3)',
              bgcolor: input.trim() ? '#0d47a1' : 'transparent',
              '&:hover': {
                bgcolor: input.trim() ? '#1565c0' : 'transparent',
              },
              '&.Mui-disabled': {
                bgcolor: 'transparent',
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
