import React, { useState, useEffect, useRef, useCallback } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box, TextField, IconButton, Typography, Avatar, Tooltip } from '@mui/material';
import { useChat } from '../contexts/chatContext';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { SvgIcon } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { chatService, ChatMessage } from '../services/chatService';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useQuiz, languages } from '../contexts/quizContext'; // Import useQuiz and languages



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

// const TypewriterText: React.FC<TypewriterTextProps> = ({ text }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (currentIndex < text.length) {
//       const timer = setTimeout(() => {
//         setDisplayedText(prev => prev + text[currentIndex]);
//         setCurrentIndex(c => c + 1);
//       }, 30); // Adjust speed here

//       return () => clearTimeout(timer);
//     }
//   }, [currentIndex, text]);

//   return <>{displayedText}</>;
// };

// Component to render AI message content with syntax highlighting
const MessageContent: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  if (isUser) {
    return (
      <Typography 
        component="div" 
        sx={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          wordBreak: 'break-word'
        }}
      >
        {text}
      </Typography>
    );
  }

  // Handle "Thinking..." message
  if (text === "Thinking...") {
    return (
      <Typography 
        component="div" 
        sx={{ 
          fontStyle: 'italic', 
          opacity: 0.7,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          wordBreak: 'break-word'
        }}
      >
        {text}
      </Typography>
    );
  }  
  
  // Parse the message to identify code blocks returns box or typography
  const renderContentWithSyntaxHighlighting = (content: string) => {
    // First, handle HTML code blocks (<pre><code class="language-xxx">)
    let processedContent = content.replace(
      /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
      (match, language, code) => {
        // Decode HTML entities and convert to markdown format
        const decodedCode = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'");
        return `\`\`\`${language}\n${decodedCode}\n\`\`\``;
      }
    );

    // Also handle plain <pre><code> without language class
    processedContent = processedContent.replace(
      /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
      (match, code) => {
        const decodedCode = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'");
        return `\`\`\`javascript\n${decodedCode}\n\`\`\``;
      }
    );

    // Split content by code blocks (```language...```)
    const parts = processedContent.split(/(```[\w]*\n[\s\S]*?\n```)/g);
    
    // Language mapping for better syntax highlighting
    const mapLanguage = (lang: string): string => {
      const languageMap: { [key: string]: string } = {
        'language-jsx': 'jsx',
        'language-tsx': 'tsx',
        'language-javascript': 'javascript',
        'language-typescript': 'typescript',
        'language-html': 'markup',
        'language-xml': 'markup',
        'language-markup': 'markup',
        'jsx': 'jsx',
        'tsx': 'tsx',
        'js': 'javascript',
        'ts': 'typescript',
        'html': 'markup',
        'xml': 'markup',
        'py': 'python',
        'cs': 'csharp',
        'cpp': 'cpp',
        'c++': 'cpp',
        'java': 'java',
        'php': 'php',
        'ruby': 'ruby',
        'go': 'go',
        'rust': 'rust',
        'swift': 'swift',
        'kotlin': 'kotlin',
        'scala': 'scala',
        'sql': 'sql',
        'json': 'json',
        'yaml': 'yaml',
        'yml': 'yaml',
        'toml': 'toml',
        'ini': 'ini',
        'bash': 'bash',
        'sh': 'bash',
        'shell': 'bash',
        'powershell': 'powershell',
        'ps1': 'powershell'
      };
      
      return languageMap[lang.toLowerCase()] || lang || 'javascript';
    };
    
    return parts.map((part, index) => {
      // Check if this part is a code block
      const codeMatch = part.match(/^```(\w*)\n([\s\S]*?)\n```$/);
      
      if (codeMatch) {
        const [, language, code] = codeMatch;
        const mappedLang = mapLanguage(language);
        
        return (
          <Box key={index} sx={{ my: 2 }}>
            <SyntaxHighlighter
              language={mappedLang}
              style={vscDarkPlus}
              showLineNumbers={false}
              customStyle={{
                margin: 0,
                padding: '16px',
                background: '#1E1E1E',
                fontSize: '14px',
                lineHeight: '1.4',
                borderRadius: '6px',
                fontFamily: "'Fira Code', 'Consolas', monospace",
              }}
              codeTagProps={{
                style: {
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                }
              }}
            >
              {code.trim()}
            </SyntaxHighlighter>
          </Box>
        );
      } else {  //if not code
        // Regular text content
        return (
          <Typography
            key={index}
            component="div"
            sx={{
              color: isUser ? '#fff' : '#000',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              '& p': {
                margin: '0 0 8px 0',
                lineHeight: '1.5',
                color: 'inherit',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                '&:last-child': { marginBottom: 0 }
              },
              '& strong': {
                fontWeight: 'bold',
                color: 'inherit'
              },
              // Reduce spacing between list items and links
              '& ul': {
                margin: 0,
                paddingLeft: '1.2em',
              },
              '& li': {
                margin: 0,
                padding: 0,
                lineHeight: '1.2',
              },
              '& a': {
                margin: 0,
                padding: 0,
                lineHeight: '1.2',
                color: '#0000ee',
                textDecoration: 'underline',
              }
            }}
            dangerouslySetInnerHTML={{
              __html: part
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>')
                .replace(/^(?!<p>)/, '<p>')
                .replace(/(?!<\/p>)$/, '</p>')
                .replace(/<p><\/p>/g, '')
                .replace(/<p><br><\/p>/g, '<br>')
                .replace(/<p>\s*<\/p>/g, '')
            }}
          />
        );
      }
    });
  }; //end: renderContentWithSyntaxHighlighting  whew.

  return <Box>{renderContentWithSyntaxHighlighting(text)}</Box>;
};

export const Chat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  // ...existing code...
  // Only one declaration of messages and setMessages should exist below:

  // ...existing code...
  // ...existing code...
  const { chatboxSkill, externalMessages, clearExternalMessages } = useChat();
  const { language } = useQuiz();

  // Function to get initial message (now after hooks)
  const getInitialMessage = () => ({
    id: '1',
    text: chatService.getFirstPromptInRightLanguage(chatboxSkill, language),
    isUser: false,
    timestamp: new Date()
  });
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);
  // Scroll to the bottom when new messages arrive from external sources
  useEffect(() => {
    if (chatMessagesRef.current && externalMessages.length > 0) {
      // Use a small delay to ensure the new content is rendered
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, externalMessages.length]);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [arrowOpacity, setArrowOpacity] = useState(1);
  // ...existing code...
  
  const [input, setInput] = useState('');
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Speech-to-text functionality hook
  const { isListening, isSupported, toggleListening } = useSpeechToText({
    onTranscript: (transcript, isFinal) => {
      if (isFinal) {
        setInput(prev => prev + transcript + ' ');
      }
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
    }
  });
  
  // Copy to clipboard function
  const handleCopyToClipboard = async (text: string, messageId: string) => {
    try {
      // Remove HTML tags and decode entities for plain text copy
      const plainText = text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      await navigator.clipboard.writeText(plainText);
      setCopiedMessageId(messageId);
      
      // Reset tooltip after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Toggle fullscreen function
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
    // Reset messages when chatbox opens
  useEffect(() => {
    if (isOpen) {
      setMessages([getInitialMessage()]);
      setInput('');
      clearExternalMessages(); // Clear any pending external messages when opening
    }
  }, [isOpen, chatboxSkill]);

  // Handle external messages (like "Explain Further")
  useEffect(() => {
    if (externalMessages.length > 0) {
      const lastMessage = externalMessages[externalMessages.length - 1];
      
      if (lastMessage.text === "CLEAR_CHAT") {
        // Special message to clear the chat
        setMessages([]);
      } else if (lastMessage.text === "Thinking...") {
        // For "Thinking..." message, just add it as the only message
        setMessages([lastMessage]);
      } else {
        // For other messages, replace any existing messages
        setMessages([lastMessage]);
      }
      
      // Schedule scroll after state update is complete
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }, 100);
      
      clearExternalMessages();
    }
  }, [externalMessages, clearExternalMessages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialX = useRef(0);
  const initialWidth = useRef(0);
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    initialX.current = e.clientX;
    initialWidth.current = width;
  };

  //at startt
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

  // Do not auto-scroll to bottom on new messages. User stays at top of new message and sees down arrow if overflow.

  // Show/hide/fade scroll down arrow
  useEffect(() => {
    const handleScroll = () => {
      if (!chatMessagesRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const hasOverflow = scrollHeight > clientHeight + 2; // allow for rounding
      // Arrow disappears when within 4px of bottom
      if (hasOverflow && distanceFromBottom > 4) {
        setShowScrollDown(true);
        setArrowOpacity(Math.max(0, Math.min(1, distanceFromBottom / 80)));
      } else {
        setShowScrollDown(false);
        setArrowOpacity(0);
      }
    };
    const ref = chatMessagesRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      if (ref) ref.removeEventListener('scroll', handleScroll);
    };
  }, [messages]);

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

    // Only scroll to bottom if user was already at bottom
    if (chatMessagesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 30;
      
      if (isAtBottom) {
        setTimeout(() => {
          if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
          }
        }, 100);
      }
    }

    try {
      // Get conversation history (excluding the current loading message)
      const conversationHistory = messages.filter(msg => msg.text !== "Thinking...");
      const response = await chatService.respondChat(input, chatboxSkill || 'general', conversationHistory);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id ? response : msg
        )
      );
      
      // Scroll to top after receiving AI response with a slight delay to ensure render
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }, 100);
      
      // Scroll to the response after it's received
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, 100);
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
    }  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        ...(isFullscreen ? {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        } : {
          right: 20,
          bottom: 20,
          width: `${width}px`,
          height: 'calc(100vh - 80px)', // Leave space for navbar only
        }),
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        color: '#000000',
        zIndex: isFullscreen ? 1500 : 1400,
        borderRadius: isFullscreen ? 0 : '12px',
        boxShadow: isFullscreen ? 'none' : '0 2px 24px rgba(0, 0, 0, 0.15)',
        transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + 20px))',
        transition: isResizing ? 'none' : 'transform 0.3s ease-in-out'
      }}
    >

      {/* Resize Handle */}
      {!isFullscreen && (
        <Box
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
      )}

      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#0053A7',
          color: '#fff',
          borderTopLeftRadius: isFullscreen ? 0 : '12px',
          borderTopRightRadius: isFullscreen ? 0 : '12px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: '#0053A7' }}>
            <BuddyIcon />
          </Avatar>
          <Typography>AI Assistant {chatboxSkill ? `(${chatboxSkill})` : ''}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
            <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      {/* Messages */}
      <Box
        className="chat-messages"
        ref={chatMessagesRef}
        sx={{
          flex: 1,
          minHeight: '200px',
          height: '100%',
          maxHeight: isFullscreen ? 'calc(100vh - 120px)' : 'calc(100vh - 140px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          position: 'relative',
          background: '#fff',
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            data-message-id={message.id}
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start',
              flexDirection: message.isUser ? 'row-reverse' : 'row',
              opacity: 0,
              animation: message.text === "Thinking..." ? 'fadeIn 0.3s ease forwards' : 'fadeIn 0.5s ease forwards',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
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
                maxWidth: '85%',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                '& p, & div': {
                  color: message.isUser ? '#fff' : '#000',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word'
                }
              }}
            >
              <MessageContent text={message.text} isUser={message.isUser} />
            </Box>
            {/* Copy button for AI messages positioned outside and to the right of bubble */}
            {!message.isUser && message.text !== "Thinking..." && (
              <Tooltip 
                title={copiedMessageId === message.id ? "Copied to clipboard!" : "Copy to clipboard"}
                open={copiedMessageId === message.id || undefined}
                arrow
              >
                <IconButton
                  onClick={() => handleCopyToClipboard(message.text, message.id)}
                  sx={{
                    width: '28px',
                    height: '28px',
                    marginLeft: '8px',
                    alignSelf: 'flex-start',
                    marginTop: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <ContentCopyIcon sx={{ fontSize: '16px', color: '#666' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Down arrow icon for overflow - positioned above scroll container border */}
      {showScrollDown && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: isFullscreen ? 90 : 100,
            display: 'flex',
            justifyContent: 'center',
            opacity: arrowOpacity,
            transition: 'opacity 0.3s',
            zIndex: 2000,
          }}
        >
          <Box
            onClick={() => {
              if (chatMessagesRef.current) {
                chatMessagesRef.current.scrollTo({
                  top: chatMessagesRef.current.scrollHeight,
                  behavior: 'smooth'
                });
              }
            }}
            sx={{
              backgroundColor: '#0053A7',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#003E7D',
                transform: 'translateY(2px)',
              },
              '&:active': {
                transform: 'translateY(4px)',
              }
            }}
          >
            <ArrowDownwardIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
        </Box>
      )}

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
        >          <TextField
            inputRef={inputRef}
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
              }            }}
          />
          
          {/* Microphone button for speech-to-text */}
          {isSupported && (
            <Tooltip title={isListening ? "Stop recording" : "Start voice input"}>
              <IconButton
                onClick={toggleListening}
                sx={{
                  bgcolor: isListening ? '#ff4444' : '#f0f0f0',
                  color: isListening ? 'white' : '#666',
                  '&:hover': {
                    bgcolor: isListening ? '#ff6666' : '#e0e0e0'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {isListening ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>
          )}
          
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
