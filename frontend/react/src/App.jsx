import React, { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Typography, 
  Box,
  Paper,
  Grid,
  Drawer,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon, Description, Chat } from '@mui/icons-material';
import ChatWindow from './components/ChatWindow';
import FileUploader from './components/FileUploader';
import { v4 as uuidv4 } from 'uuid';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#0f0f23',
      paper: '#1a1b3a',
    },
    surface: {
      main: '#252659',
      light: '#2d2b69',
      dark: '#1e1e40',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
    divider: 'rgba(226, 232, 240, 0.12)',
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      letterSpacing: '-0.025em',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#6366f1 #1a1b3a',
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1a1b3a',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#6366f1',
            borderRadius: 4,
            '&:hover': {
              backgroundColor: '#818cf8',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(226, 232, 240, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4), 0 4px 6px -2px rgba(99, 102, 241, 0.1)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            backgroundColor: 'rgba(226, 232, 240, 0.05)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(226, 232, 240, 0.08)',
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(226, 232, 240, 0.1)',
              transform: 'translateY(-1px)',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1) rotate(5deg)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          margin: '4px 0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1b3a',
          backgroundImage: 'linear-gradient(145deg, #1a1b3a 0%, #252659 100%)',
          borderRight: '1px solid rgba(226, 232, 240, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1b3a',
          backgroundImage: 'linear-gradient(135deg, #1a1b3a 0%, #252659 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.1)',
        },
      },
    },
  },
});

function App() {
  const [sessionId] = useState(() => uuidv4());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFileUpload = (fileName, chunks) => {
    setUploadedFiles(prev => [...prev, { fileName, chunks, timestamp: new Date() }]);
  };

  const drawerContent = (
    <Box sx={{ 
      width: 350, 
      p: 3, 
      height: '100%',
      background: 'linear-gradient(145deg, #1a1b3a 0%, #252659 100%)',
      position: 'relative',
      overflow: 'hidden',
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
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 3,
        animation: 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        '@keyframes slideInRight': {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      }}>
        <Box sx={{
          p: 1.5,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
          },
        }}>
          <Description sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Document Manager
        </Typography>
      </Box>
      <FileUploader onFileUpload={handleFileUpload} uploadedFiles={uploadedFiles} />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Drawer
            variant="permanent"
            sx={{
              width: 350,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 350,
                boxSizing: 'border-box',
                border: 'none',
                animation: 'slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                '@keyframes slideInLeft': {
                  '0%': { opacity: 0, transform: 'translateX(-100%)' },
                  '100%': { opacity: 1, transform: 'translateX(0)' },
                },
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 350,
                boxSizing: 'border-box',
                border: 'none',
              },
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(15, 15, 35, 0.8)',
                backdropFilter: 'blur(8px)',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            height: '100vh',
            background: 'linear-gradient(145deg, #0f0f23 0%, #1a1b3a 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
              pointerEvents: 'none',
            },
          }}
        >
          {isMobile && (
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center',
              borderBottom: '1px solid rgba(226, 232, 240, 0.1)',
              background: 'linear-gradient(135deg, #1a1b3a 0%, #252659 100%)',
              backdropFilter: 'blur(20px)',
            }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2,
                  color: 'text.primary',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'rotate(180deg) scale(1.1)',
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                RAG Chat Application
              </Typography>
            </Box>
          )}
          <Box 
            sx={{ 
              flexGrow: 1,
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(30px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <ChatWindow sessionId={sessionId} uploadedFiles={uploadedFiles} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
