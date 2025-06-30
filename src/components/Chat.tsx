import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, Tooltip } from '@mui/material';
import { useChat } from '../contexts/chatContext';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { SvgIcon } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
    return <Typography component="div">{text}</Typography>;
  }

  // Handle "Thinking..." message
  if (text === "Thinking...") {
    return (
      <Typography 
        component="div" 
        sx={{ 
          fontStyle: 'italic', 
          opacity: 0.7 
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
              '& p': {
                margin: '0 0 8px 0',
                lineHeight: '1.5',
                color: 'inherit',
                '&:last-child': { marginBottom: 0 }
              },
              '& strong': {
                fontWeight: 'bold',
                color: 'inherit'
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

export const Chat: React.FC<{   isOpen: boolean;  onClose: () => void; }> = ({ isOpen, onClose }) => 
 {
  const { chatboxSkill } = useChat();
  const {   language  } = useQuiz();
  
  var firstMessage = chatService.getFirstPromptInRightLanguage(chatboxSkill, language);
  // Function to get initial message
  const getInitialMessage = () => ({
    id: '1',
    text: firstMessage,
    isUser: false,
    timestamp: new Date()
  });

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);
  const [input, setInput] = useState('');
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
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
    // Reset messages when chatbox opens
  useEffect(() => {
    if (isOpen) {
      setMessages([getInitialMessage()]);
      setInput('');
    }
  }, [isOpen, chatboxSkill]);

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
      // Get conversation history (excluding the current loading message)
      const conversationHistory = messages.filter(msg => msg.text !== "Thinking...");
      const response = await chatService.respondChat(input, chatboxSkill || 'general', conversationHistory);
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
    }  };

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
      </Box>      {/* Messages */}
      <Box
        className="chat-messages"
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >        {messages.map((message) => (
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
                maxWidth: '85%',
                '& p, & div': {
                  color: message.isUser ? '#fff' : '#000'
                }
              }}
            >            <MessageContent text={message.text} isUser={message.isUser} />
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
