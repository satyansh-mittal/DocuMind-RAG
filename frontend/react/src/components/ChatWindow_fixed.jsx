import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Fade,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Send,
  Person,
  SmartToy,
  Clear,
  ContentCopy,
  MoreVert,
  Delete,
  Refresh,
  History,
  Download,
  Settings,
} from '@mui/icons-material';
import axios from 'axios';

const ChatWindow = ({ sessionId, uploadedFiles }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', title: '', message: '' });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmDialog = (type, title, message) => {
    setConfirmDialog({ open: true, type, title, message });
    handleMenuClose();
  };

  const handleConfirmAction = async () => {
    const { type } = confirmDialog;
    
    try {
      if (type === 'clearChat') {
        setMessages([]);
        setError('');
      } else if (type === 'clearHistory') {
        await axios.post('http://localhost:8000/api/clear-history', { session_id: sessionId });
        setMessages([]);
        setError('');
      } else if (type === 'deleteDocuments') {
        await axios.post('http://localhost:8000/api/delete-documents', { session_id: sessionId });
        setMessages([]);
        setError('');
        // You might want to trigger a parent component update here
      }
    } catch (error) {
      console.error('Action failed:', error);
      setError('Failed to perform action. Please try again.');
    }
    
    setConfirmDialog({ open: false, type: '', title: '', message: '' });
  };

  const handleExportChat = () => {
    const chatHistory = messages.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n\n');
    const blob = new Blob([chatHistory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    handleMenuClose();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (uploadedFiles.length === 0) {
      setError('Please upload a PDF document first before asking questions.');
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        session_id: sessionId,
        question: userMessage.content,
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.answer,
        timestamp: new Date(),
        sourceCount: response.data.source_count || 0,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          'Failed to get response';
      
      const errorMessageObj = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessageObj]);
      setError(`Chat error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <>
      <Paper
        elevation={4}
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(145deg, #1a1b3a 0%, #252659 100%)',
          border: '1px solid rgba(226, 232, 240, 0.1)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
            animation: 'shimmer 3s ease-in-out infinite',
          },
          '@keyframes shimmer': {
            '0%, 100%': { opacity: 0 },
            '50%': { opacity: 1 },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
            background: 'linear-gradient(135deg, rgba(26, 27, 58, 0.9) 0%, rgba(37, 38, 89, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            animation: 'slideInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
              animation: 'shimmer 2s ease-in-out infinite',
            },
            '@keyframes slideInDown': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
            '@keyframes shimmer': {
              '0%, 100%': { opacity: 0.5 },
              '50%': { opacity: 1 },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'glow 2s ease-in-out infinite alternate',
              '@keyframes glow': {
                '0%': { boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' },
                '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(139, 92, 246, 0.3)' },
              },
            }}>
              <SmartToy sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                RAG Chat Assistant
              </Typography>
              {uploadedFiles.length > 0 && (
                <Chip
                  label={`${uploadedFiles.length} document${uploadedFiles.length > 1 ? 's' : ''} loaded`}
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    color: 'white',
                    fontWeight: 600,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                    },
                  }}
                />
              )}
            </Box>
          </Box>
          
          {/* Action Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {messages.length > 0 && (
              <Tooltip title="Clear conversation">
                <IconButton 
                  onClick={() => handleConfirmDialog('clearChat', 'Clear Chat', 'Are you sure you want to clear the current conversation?')} 
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: 'error.light',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      transform: 'scale(1.1) rotate(90deg)',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                    },
                  }}
                >
                  <Clear />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="More options">
              <IconButton 
                onClick={handleMenuOpen}
                size="small"
                sx={{
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  color: 'primary.light',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                  },
                }}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 3,
            background: 'linear-gradient(145deg, #0f0f23 0%, #1a1b3a 50%, #0f0f23 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
              pointerEvents: 'none',
            },
            // Custom scrollbar
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(26, 27, 58, 0.3)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
              },
            },
          }}
        >
          {error && (
            <Alert
              severity="error"
              onClose={() => setError('')}
              sx={{
                mb: 2,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'error.light',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                '& .MuiAlert-icon': {
                  color: 'error.light',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {messages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                animation: 'fadeIn 1s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Box
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(145deg, rgba(26, 27, 58, 0.8) 0%, rgba(37, 38, 89, 0.6) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  maxWidth: 500,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)',
                    backgroundSize: '200% 100%',
                    animation: 'gradient 3s ease infinite',
                  },
                  '@keyframes gradient': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                  },
                }}
              >
                <Box sx={{
                  p: 3,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  animation: 'bounce 2s ease-in-out infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                  },
                }}>
                  <SmartToy sx={{ color: 'white', fontSize: 48 }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  Welcome to RAG Chat!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  I'm ready to help you analyze your documents. Upload a PDF and start asking questions about its content.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    'What is this document about?',
                    'Summarize the key points',
                    'What are the main topics?',
                  ].map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      onClick={() => uploadedFiles.length > 0 && setInput(suggestion)}
                      sx={{
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: 'primary.light',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: uploadedFiles.length > 0 ? 'pointer' : 'default',
                        opacity: uploadedFiles.length > 0 ? 1 : 0.5,
                        '&:hover': uploadedFiles.length > 0 ? {
                          backgroundColor: 'rgba(99, 102, 241, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                        } : {},
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {messages.map((message, index) => (
                <Fade key={message.id} in timeout={(index + 1) * 200}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      animation: `slideIn${message.role === 'user' ? 'Right' : 'Left'} 0.5s cubic-bezier(0.4, 0, 0.2, 1)`,
                      '@keyframes slideInRight': {
                        '0%': { opacity: 0, transform: 'translateX(20px)' },
                        '100%': { opacity: 1, transform: 'translateX(0)' },
                      },
                      '@keyframes slideInLeft': {
                        '0%': { opacity: 0, transform: 'translateX(-20px)' },
                        '100%': { opacity: 1, transform: 'translateX(0)' },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        maxWidth: '85%',
                        flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                      }}
                    >
                      <Avatar
                        sx={{
                          backgroundColor: message.role === 'user' 
                            ? 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          width: 40,
                          height: 40,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: message.role === 'user' 
                              ? '0 8px 25px rgba(236, 72, 153, 0.4)'
                              : '0 8px 25px rgba(99, 102, 241, 0.4)',
                          },
                        }}
                      >
                        {message.role === 'user' ? <Person /> : <SmartToy />}
                      </Avatar>

                      <Paper
                        elevation={3}
                        sx={{
                          p: 3,
                          background: message.role === 'user'
                            ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 114, 182, 0.05) 100%)'
                            : message.isError
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.05) 100%)'
                            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                          border: message.role === 'user'
                            ? '1px solid rgba(236, 72, 153, 0.2)'
                            : message.isError
                            ? '1px solid rgba(239, 68, 68, 0.2)'
                            : '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: 4,
                          position: 'relative',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: message.role === 'user'
                              ? '0 8px 25px rgba(236, 72, 153, 0.15)'
                              : message.isError
                              ? '0 8px 25px rgba(239, 68, 68, 0.15)'
                              : '0 8px 25px rgba(99, 102, 241, 0.15)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: message.role === 'user'
                              ? 'linear-gradient(90deg, #ec4899, #f472b6)'
                              : message.isError
                              ? 'linear-gradient(90deg, #ef4444, #f87171)'
                              : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                            borderRadius: '4px 4px 0 0',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                            }}
                          >
                            {message.role === 'user' ? 'You' : 'Assistant'}
                          </Typography>
                          <Tooltip title="Copy message">
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(message.content)}
                              sx={{
                                opacity: 0.7,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  opacity: 1,
                                  transform: 'scale(1.1)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                              }}
                            >
                              <ContentCopy sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.primary',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {message.content}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              opacity: 0.8,
                            }}
                          >
                            {formatTimestamp(message.timestamp)}
                          </Typography>
                          {message.sourceCount > 0 && (
                            <Chip
                              label={`${message.sourceCount} sources`}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                color: 'success.light',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                </Fade>
              ))}

              {loading && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    animation: 'fadeIn 0.3s ease-in-out',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, maxWidth: '85%' }}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        width: 40,
                        height: 40,
                        animation: 'pulse 1.5s ease-in-out infinite',
                      }}
                    >
                      <SmartToy />
                    </Avatar>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <CircularProgress
                        size={20}
                        sx={{
                          color: 'primary.light',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Thinking...
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid rgba(99, 102, 241, 0.2)',
            background: 'linear-gradient(135deg, rgba(26, 27, 58, 0.9) 0%, rgba(37, 38, 89, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
              animation: 'shimmer 3s ease-in-out infinite',
            },
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your documents..."
              disabled={loading || uploadedFiles.length === 0}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(226, 232, 240, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(226, 232, 240, 0.08)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(226, 232, 240, 0.1)',
                    borderColor: 'primary.main',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(226, 232, 240, 0.02)',
                    borderColor: 'rgba(99, 102, 241, 0.1)',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: 'text.primary',
                  '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 0.7,
                  },
                },
              }}
            />
            <Tooltip title={loading ? 'Sending...' : uploadedFiles.length === 0 ? 'Upload a document first' : 'Send message'}>
              <span>
                <IconButton
                  onClick={handleSend}
                  disabled={!input.trim() || loading || uploadedFiles.length === 0}
                  sx={{
                    p: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
                      transform: 'translateY(-2px) scale(1.05)',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                    '&:disabled': {
                      background: 'rgba(99, 102, 241, 0.3)',
                      color: 'rgba(255, 255, 255, 0.5)',
                      transform: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    <Send />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              mt: 1,
              display: 'block',
              textAlign: 'center',
              opacity: 0.7,
            }}
          >
            Press Enter to send, Shift+Enter for new line
          </Typography>
        </Box>
      </Paper>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1b3a',
            backgroundImage: 'linear-gradient(145deg, #1a1b3a 0%, #252659 100%)',
            border: '1px solid rgba(226, 232, 240, 0.1)',
            borderRadius: 3,
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => handleConfirmDialog('clearHistory', 'Clear All History', 'Are you sure you want to clear all conversation history? This action cannot be undone.')}>
          <ListItemIcon>
            <History sx={{ color: 'warning.light' }} />
          </ListItemIcon>
          <ListItemText primary="Clear History" />
        </MenuItem>
        
        <MenuItem onClick={() => handleConfirmDialog('deleteDocuments', 'Delete Documents', 'Are you sure you want to delete all uploaded documents? This will also clear the conversation history.')}>
          <ListItemIcon>
            <Delete sx={{ color: 'error.light' }} />
          </ListItemIcon>
          <ListItemText primary="Delete Documents" />
        </MenuItem>
        
        <Divider sx={{ borderColor: 'rgba(226, 232, 240, 0.1)' }} />
        
        <MenuItem onClick={handleExportChat} disabled={messages.length === 0}>
          <ListItemIcon>
            <Download sx={{ color: messages.length === 0 ? 'text.disabled' : 'info.light' }} />
          </ListItemIcon>
          <ListItemText primary="Export Chat" />
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings sx={{ color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: '', title: '', message: '' })}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1b3a',
            backgroundImage: 'linear-gradient(145deg, #1a1b3a 0%, #252659 100%)',
            border: '1px solid rgba(226, 232, 240, 0.1)',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ color: 'text.primary', borderBottom: '1px solid rgba(226, 232, 240, 0.1)' }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography sx={{ color: 'text.secondary' }}>
            {confirmDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setConfirmDialog({ open: false, type: '', title: '', message: '' })}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'rgba(226, 232, 240, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAction}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatWindow;
