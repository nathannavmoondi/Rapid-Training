import React, { useState, useEffect, useRef } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box, TextField, IconButton, Typography, Avatar, Tooltip, CircularProgress } from '@mui/material';
import { useChat } from '../contexts/chatContext';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { SvgIcon } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { chatService, ChatMessage } from '../services/chatService';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { downloadHtmlAsPdf } from '../services/pdfService';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useQuiz } from '../contexts/quizContext'; // Import useQuiz
import { generateLabelFromHtml } from '../contexts/quizContext';
import { getRefresherSyntax } from '../services/aiService';



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
const MessageContent: React.FC<{ text: string; isUser: boolean; isViewingQuizContent?: boolean }> = ({ text, isUser, isViewingQuizContent = false }) => {
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
          // Decode HTML entities and clean up code formatting
          let decodedCode = code
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'");
          // Remove common leading whitespace from all lines (fixes indented code blocks)
          const lines = decodedCode.split('\n');
          const nonEmptyLines = lines.filter((line: string) => line.trim().length > 0);
          if (nonEmptyLines.length > 0) {
            const minIndent = Math.min(...nonEmptyLines.map((line: string) => {
              const match = line.match(/^(\s*)/);
              return match ? match[1].length : 0;
            }));
            decodedCode = lines.map((line: string) => line.slice(minIndent)).join('\n').trim();
          }
          return `\`\`\`${language}\n${decodedCode}\n\`\`\``;
      }
    );

    // Remove display:none styles from coder test sections so all content is visible
    processedContent = processedContent.replace(/style="display:\s*none;?"/g, '');
    processedContent = processedContent.replace(/style='display:\s*none;?'/g, '');

    // Also handle plain <pre><code> without language class
    processedContent = processedContent.replace(
      /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
      (match, code) => {
          let decodedCode = code
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'");
          // Remove common leading whitespace from all lines (fixes indented code blocks)
          const lines = decodedCode.split('\n');
          const nonEmptyLines = lines.filter((line: string) => line.trim().length > 0);
          if (nonEmptyLines.length > 0) {
            const minIndent = Math.min(...nonEmptyLines.map((line: string) => {
              const match = line.match(/^(\s*)/);
              return match ? match[1].length : 0;
            }));
            decodedCode = lines.map((line: string) => line.slice(minIndent)).join('\n').trim();
          }
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
          <Box key={index} sx={{ my: 2, width: '100%', overflow: 'hidden' }}>
            <SyntaxHighlighter
              language={mappedLang}
              style={vscDarkPlus}
              showLineNumbers={false}
              wrapLines={true}
              wrapLongLines={true}
              customStyle={{
                margin: 0,
                padding: '16px',
                background: '#1E1E1E',
                fontSize: '14px',
                lineHeight: '1.4',
                borderRadius: '6px',
                fontFamily: "'Fira Code', 'Consolas', monospace",
                maxWidth: '100%',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}
              codeTagProps={{
                style: {
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
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
                color: isUser ? '#fff' : '#000 !important',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                '&:last-child': { marginBottom: 0 }
              },
              '& strong': {
                fontWeight: 'bold',
                color: isUser ? '#fff' : '#000 !important'
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
                color: isUser ? '#fff' : '#000 !important',
                marginBottom: '2px'
              },
              '& a': {
                margin: 0,
                padding: 0,
                lineHeight: '1.2',
                color: '#0000ee',
                textDecoration: 'underline',
              },
              '& *': {
                color: isUser ? '#fff' : '#000 !important'
              },
              // Quiz-specific styling - more specific selectors to override the * selector
              '& div.option': {
                fontWeight: 500,
                borderRadius: '6px',
                padding: '8px 12px',
                margin: '4px 0',
                border: '1px solid #555'
              },
              '& span.option-prefix': {
                color: isUser ? '#90EE90' : '#4caf50 !important'
              },
              '& div.question-text': {
                color: isUser ? '#fff' : '#000 !important'
              },
              '& div.answer-choice': {
                fontWeight: 500,
                borderRadius: '6px',
                padding: '8px 12px',
                margin: '4px 0',
                border: '1px solid #555'
              },
              '& div.explanation': {
                color: isUser ? '#fff' : (isViewingQuizContent ? '#fff' : '#000') + ' !important'
              },
              '& div.explanation *': {
                color: isUser ? '#fff' : (isViewingQuizContent ? '#fff' : '#000') + ' !important'
              },
              '& div.correct-answer': {
                color: isUser ? '#fff' : '#fff !important'
              },
              '& .title-section': {
                color: isUser ? '#fff' : '#000 !important'
              },
              // Coder test specific styling
              '& .coding-question-container': {
                color: isUser ? '#fff' : '#000 !important'
              },
              '& .title-section h2': {
                color: isUser ? '#fff' : '#f500ff !important',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '4px'
              },
              '& .question-section h3, & .tips-section h3, & .answer-section h3': {
                color: isUser ? '#fff' : '#f500ff !important',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '4px',
                marginTop: '8px'
              },
              '& .question-section h4, & .tips-section h4, & .answer-section h4': {
                color: isUser ? '#fff' : '#006400 !important',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '2px',
                marginTop: '4px'
              },
              '& .problem-statement, & .requirements, & .examples, & .hints, & .strategy, & .common-pitfalls, & .approach, & .solution-code, & .complexity, & .explanation': {
                color: isUser ? '#fff' : '#000 !important',
                marginBottom: '4px',
                lineHeight: '1.3'
              },
              '& .tips-section, & .answer-section': {
                marginTop: '8px',
                paddingTop: '4px',
                borderTop: '1px solid rgba(128, 128, 128, 0.3)'
              },
              '& ul, & ol': {
                marginTop: '2px',
                marginBottom: '4px',
                paddingLeft: '1.2em'
              },
              // Slidedeck specific styling
              '& .slide': {
                backgroundColor: '#ffffff !important',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                marginBottom: '16px'
              }
            }}
            dangerouslySetInnerHTML={{
              __html: part
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n\s*\n\s*\n+/g, '</p><p>') // Replace triple+ newlines with paragraph breaks
                .replace(/\n\s*\n/g, '<br>')         // Replace double newlines with single break
                .replace(/\n/g, ' ')                 // Single newlines become spaces (more compact)
                .replace(/^(?!<p>)/, '<p>')
                .replace(/(?!<\/p>)$/, '</p>')
                .replace(/<p><\/p>/g, '')
                .replace(/<p><br><\/p>/g, '')
                .replace(/<p>\s*<\/p>/g, '')
                .replace(/(<br>\s*){2,}/g, '<br>')   // Limit consecutive br tags to max 1
            }}
          />
        );
      }
    });
  }; //end: renderContentWithSyntaxHighlighting  whew.

  return <Box>{renderContentWithSyntaxHighlighting(text)}</Box>;
};

export const Chat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose: originalOnClose }) => {
  // Create a wrapped onClose handler that also resets the refresher session
  const onClose = () => {
    setIsRefresherSession(false);
    originalOnClose();
  };
  // Inject global style for quiz options to guarantee white text and dark background
  useEffect(() => {
    const styleId = 'quiz-option-global-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .chat-container [class*="option"], .chat-container [class*="answer"] {
          color: black !important;
          font-weight: 500 !important;
          border-radius: 6px !important;
          padding: 8px 12px !important;
          margin: 4px 0 !important;
          font-size: 18px !important;
        }
        .chat-container [class*="option"] code, .chat-container [class*="answer"] code {
          color: white !important;
          background: transparent !important;
        }
        .option-prefix {
          color: #00FFFF !important;
          font-weight: bold !important;
          font-size: 22px !important;          
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);
  // ...existing code...
  // Only one declaration of messages and setMessages should exist below:

  // ...existing code...
  // ...existing code...
  const { 
    chatboxSkill, 
    externalMessages, 
    clearExternalMessages,
    isRefresherSession,
    setIsRefresherSession,
    refresherSkill,
    refresherLevel
  } = useChat();
  const { language, setUserSavedSnippets } = useQuiz();

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
  const [savedMessageId, setSavedMessageId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  
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

  // Save snippet function
  const handleSaveSnippet = async (text: string, messageId: string) => {
    try {
      console.log('Saving content - Raw HTML:', text);
      
      // Determine content type based on HTML structure
      let contentType = 'Snippet';
      if (text.includes('class="coding-question-container"')) {
        contentType = 'Coder Test';
      } else if (text.includes('class="slide"')) {
        contentType = 'Slide Deck';
      } else if (text.includes('class="option"')) {
        contentType = 'Quiz';
      }
      
      console.log('Content type detected:', contentType);
      const label = generateLabelFromHtml(text, contentType);
      console.log('Generated label:', label);
      
      // Save to appropriate collection based on type
      const savedItem = { label, html: text };
      console.log('Saving item:', savedItem);
      
      if (contentType === 'Coder Test') {
        setUserSavedSnippets(prev => [...prev.filter(item => item.label !== label), savedItem]);
      } else {
        setUserSavedSnippets(prev => [...prev, savedItem]);
      }
      
      setSavedMessageId(messageId);
      
      // Reset tooltip after 2 seconds
      setTimeout(() => {
        setSavedMessageId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to save snippet: ', err);
    }
  };

  // PDF download function
  const handleDownloadPdf = async (messageText: string, savedContentType?: string) => {
    try {
      // Create a properly formatted container element like in SkillsRefresherDetail
      const contentContainer = document.createElement('div');
      contentContainer.className = 'question-content';
      
      // Set the same styling as in SkillsRefresherDetail
      contentContainer.style.color = '#fff';
      contentContainer.style.padding = '24px';
      contentContainer.style.borderRadius = '4px';
      contentContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      
      // Add the message content
      contentContainer.innerHTML = messageText;
      
      // Find and properly format code blocks
      const codeBlocks = contentContainer.querySelectorAll('pre');
      codeBlocks.forEach(pre => {
        const codeElement = pre.querySelector('code');
        if (codeElement) {
          // Get the plain text content without HTML tags
          const codeText = codeElement.textContent || codeElement.innerText || '';
          
          // Clear the existing content and apply proper styling
          pre.style.backgroundColor = '#1E1E1E';
          pre.style.color = '#D4D4D4';
          pre.style.fontFamily = "'Fira Code', 'Consolas', monospace";
          pre.style.fontSize = '14px';
          pre.style.lineHeight = '1.4';
          pre.style.padding = '16px';
          pre.style.borderRadius = '6px';
          pre.style.margin = '8px 0';
          pre.style.whiteSpace = 'pre-wrap';
          pre.style.wordWrap = 'break-word';
          pre.style.overflowWrap = 'break-word';
          pre.style.border = '1px solid #333';
          
          // Create a clean formatted version of the code
          const formattedCode = codeText
            // Keywords (make them blue and bold)
            .replace(/\b(public|private|protected|static|class|struct|interface|namespace|using|void|string|int|bool|var|const|let|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|import|export|default)\b/g, 
              '<span style="color: #569CD6; font-weight: bold;">$1</span>')
            // Property names and methods (make them light blue)
            .replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span style="color: #4EC9B0;">$1</span>')
            // Numbers (make them light green)
            .replace(/\b\d+(\.\d+)?\b/g, '<span style="color: #B5CEA8;">$1</span>');
          
          // Set the formatted content
          pre.innerHTML = `<code style="color: inherit; font-family: inherit;">${formattedCode}</code>`;
        }
      });

      // Handle standalone code elements that aren't in pre tags
      const standaloneCodes = contentContainer.querySelectorAll('code:not(pre code)');
      standaloneCodes.forEach(code => {
        const el = code as HTMLElement;
        el.style.backgroundColor = '#2D2D30';
        el.style.color = '#D4D4D4';
        el.style.fontFamily = "'Fira Code', 'Consolas', monospace";
        el.style.padding = '2px 6px';
        el.style.borderRadius = '3px';
        el.style.border = '1px solid #444';
      });
      
      // Apply additional styling for better PDF formatting
      const allElements = contentContainer.querySelectorAll('*');
      allElements.forEach(element => {
        const el = element as HTMLElement;
        // Ensure proper text color inheritance for non-code elements
        if (!el.closest('pre') && !el.closest('code') && !el.style.color) {
          el.style.color = 'inherit';
        }
        // Fix any background colors that might interfere (except code blocks)
        if (!el.closest('pre') && !el.closest('code') && el.style.backgroundColor && el.style.backgroundColor !== 'transparent') {
          el.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      });
      
      // Generate filename based on savedContentType or default to "Chatbox"
      const filename = savedContentType 
        ? `${savedContentType.replace(/[^a-zA-Z0-9]/g, '_')}-RapidSkillAI.pdf`
        : 'Chatbox-RapidSkillAI.pdf';
      
      // Use the PDF service with the properly formatted HTMLElement
      await downloadHtmlAsPdf(contentContainer, filename, savedContentType || 'Chatbox Content');
      
      console.log('PDF downloaded successfully:', filename);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  // Toggle fullscreen function
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  // Reset messages when chatbox opens
  useEffect(() => {
    if (isOpen) {
      // Check for external messages first
      if (externalMessages.length > 0) {
        // If there are external messages, process them immediately
        const lastMessage = externalMessages[externalMessages.length - 1];
        console.log('Chat - Opening with external message:', lastMessage);
        
        // For "Thinking..." messages, set waiting state
        if (lastMessage.text === "Thinking...") {
          setMessages([lastMessage]);
          setIsWaitingForResponse(true);
        } else {
          setMessages([lastMessage]);
          setIsWaitingForResponse(false);
        }
        
        // Clear external messages after processing
        clearExternalMessages();
      } else {
        // Only show initial welcome message if there are no external messages
        setMessages([getInitialMessage()]);
        setIsWaitingForResponse(false);
      }
      setInput('');
    }
  }, [isOpen]); // Removed chatboxSkill dependency to prevent loops

  // Handle external messages (like "Explain Further") - only when chat is already open
  useEffect(() => {
    console.log('Chat - External messages changed, length:', externalMessages.length, 'isOpen:', isOpen);
    
    // Only process external messages if chat is already open (to avoid duplicate processing)
    if (isOpen && externalMessages.length > 0) {
      const lastMessage = externalMessages[externalMessages.length - 1];
      
      console.log('Chat - Processing external message (chat already open):', lastMessage);
      console.log('Chat - isFromLearnDialog:', lastMessage.isFromLearnDialog);
      
      if (lastMessage.text === "CLEAR_CHAT") {
        // Special message to clear the chat
        setMessages([]);
        setIsWaitingForResponse(false);
      } else if (lastMessage.text === "Thinking...") {
        // For "Thinking..." message, clear existing messages and show only thinking
        setMessages([lastMessage]);
        setIsWaitingForResponse(true);
      } else {
        // For other messages, replace any existing messages
        console.log('Chat - Setting message with isFromLearnDialog:', lastMessage.isFromLearnDialog);
        setMessages([lastMessage]);
        setIsWaitingForResponse(false);
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
  }, [externalMessages, clearExternalMessages, isOpen]);

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
    setIsWaitingForResponse(true); // Set waiting state

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
      
      let response: ChatMessage;
      
      if (isRefresherSession) {
        // For refresher sessions, use the enhanced getRefresherSyntax function with the user's answer
        // This reuses the same prompt structure as the initial refresher question
        const refresherResponse = await getRefresherSyntax(refresherSkill, refresherLevel, input, conversationHistory);
        
        // Copy over the ID from our loading message to ensure proper replacement in the messages array
        response = {
          ...refresherResponse,
          id: loadingMessage.id
        };
      } else {
        // Regular chat response
        response = await chatService.respondChat(input, chatboxSkill || 'general', conversationHistory);
      }
      
      // For refresher sessions, we've already set the response with the proper ID
      // For regular chats, we need to replace the loading message with the response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id ? response : msg
        )
      );
      setIsWaitingForResponse(false); // Clear waiting state
      
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
      setIsWaitingForResponse(false); // Clear waiting state on error
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
      className="chat-container"
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
          <Typography>
                {/* AI Assistant {
              messages.length > 0 && messages[0].savedContentType 
                ? `(${messages[0].savedContentType})` 
                : chatboxSkill
                  ? `(${chatboxSkill.substring(0, 50)})` 
                  : ''
            } */}
            AI Assistant {
              messages.length > 0 && messages[0].savedContentType 
                ? `(${messages[0].savedContentType})` 
                : chatboxSkill
                  ? `` 
                  : ''
            }
          </Typography>
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
                minWidth: 0, // Allow shrinking
                overflow: 'hidden', // Prevent horizontal overflow
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                '& p, & div': {
                  color: message.isUser ? '#fff' : '#000',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word'
                },
                '& > div': {
                  maxWidth: '100%',
                  overflow: 'hidden'
                }
              }}
            >
              <MessageContent text={message.text} isUser={message.isUser} isViewingQuizContent={message.isViewingQuizContent} />
            </Box>
            {/* Copy and Save buttons for AI messages positioned outside and to the right of bubble */}
            {!message.isUser && message.text !== "Thinking..." && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, marginLeft: '8px', alignSelf: 'flex-start', marginTop: '8px' }}>
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
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <ContentCopyIcon sx={{ fontSize: '16px', color: '#666' }} />
                  </IconButton>
                </Tooltip>
                
                {/* Save button - only show for new AI responses, not saved content */}
                {!message.isViewingQuizContent && (
                  <Tooltip 
                    title={savedMessageId === message.id ? "Snippet saved!" : "Save snippet"}
                    open={savedMessageId === message.id || undefined}
                    arrow
                  >
                    <IconButton
                      onClick={() => handleSaveSnippet(message.text, message.id)}
                      sx={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: 'rgba(0, 128, 0, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 128, 0, 0.2)'
                        }
                      }}
                    >
                      <SaveIcon sx={{ fontSize: '16px', color: '#4caf50' }} />
                    </IconButton>
                  </Tooltip>
                )}

                {/* PDF download button - show for all AI responses */}
                <Tooltip 
                  title="Download as PDF"
                  arrow
                >
                  <IconButton
                    onClick={() => handleDownloadPdf(message.text, message.savedContentType)}
                    sx={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.2)'
                      }
                    }}
                  >
                    <PictureAsPdfIcon sx={{ fontSize: '16px', color: '#f44336' }} />
                  </IconButton>
                </Tooltip>
              </Box>
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
            placeholder={`Ask me about ${chatboxSkill.substring(0,20) || 'anything'}...`}
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
          {isSupported && !isWaitingForResponse && (
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
          
          {!isWaitingForResponse && (
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
          )}
          
          {isWaitingForResponse && (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
              <CircularProgress size={24} sx={{ color: '#0053A7' }} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
