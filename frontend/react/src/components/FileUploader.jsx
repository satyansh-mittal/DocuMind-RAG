import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  CloudUpload,
  PictureAsPdf,
  CheckCircle,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FileUploader = ({ onFileUpload, uploadedFiles }) => {
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showNotification('Only PDF files are allowed', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showNotification('File size must be less than 10MB', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      showNotification(
        `Successfully uploaded "${file.name}" - ${response.data.chunks} chunks indexed`,
        'success'
      );
      onFileUpload(file.name, response.data.chunks);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          'Failed to upload file';
      showNotification(`Upload failed: ${errorMessage}`, 'error');
    } finally {
      setUploading(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
    disabled: uploading,
  });

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box>
      {/* Upload Area */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          mb: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'rgba(99, 102, 241, 0.3)',
          backgroundColor: isDragActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(26, 27, 58, 0.6)',
          cursor: uploading ? 'default' : 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
          animation: 'fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent)',
            transition: 'left 0.6s ease-in-out',
          },
          '&:hover': {
            borderColor: uploading ? 'rgba(99, 102, 241, 0.3)' : 'primary.main',
            backgroundColor: uploading ? 'rgba(26, 27, 58, 0.6)' : 'rgba(99, 102, 241, 0.1)',
            transform: uploading ? 'scale(1)' : 'scale(1.02)',
            boxShadow: uploading ? 'none' : '0 10px 25px -5px rgba(99, 102, 241, 0.3)',
            '&::before': {
              left: '100%',
            },
          },
          '@keyframes fadeInScale': {
            '0%': { opacity: 0, transform: 'scale(0.9)' },
            '100%': { opacity: 1, transform: 'scale(1)' },
          },
        }}
      >
        <input {...getInputProps()} />
        <Box sx={{ textAlign: 'center' }}>
          {uploading ? (
            <Box sx={{
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.7 },
              },
            }}>
              <CircularProgress 
                sx={{ 
                  mb: 2,
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }} 
                size={60}
                thickness={4}
              />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                Uploading and Processing...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This may take a few moments
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              animation: isDragActive ? 'bounce 0.6s ease-in-out' : 'none',
              '@keyframes bounce': {
                '0%, 20%, 60%, 100%': { transform: 'translateY(0)' },
                '40%': { transform: 'translateY(-10px)' },
                '80%': { transform: 'translateY(-5px)' },
              },
            }}>
              <Box sx={{
                mb: 3,
                position: 'relative',
                display: 'inline-block',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
              }}>
                <CloudUpload 
                  sx={{ 
                    fontSize: 64, 
                    color: isDragActive ? 'primary.main' : 'primary.light',
                    filter: 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3))',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} 
                />
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '120%',
                  height: '120%',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: '50%',
                  opacity: isDragActive ? 0.3 : 0,
                  animation: isDragActive ? 'ripple 1s ease-out infinite' : 'none',
                  '@keyframes ripple': {
                    '0%': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: 0.7 },
                    '100%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0 },
                  },
                }} />
              </Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: isDragActive ? 'primary.main' : 'text.primary',
                  transition: 'color 0.3s ease',
                }}
              >
                {isDragActive ? 'Drop your PDF here' : 'Upload PDF Document'}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  maxWidth: 300,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Drag and drop a PDF file here, or click to browse
              </Typography>
              <Button 
                variant="contained" 
                component="span" 
                disabled={uploading}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 15px 0 rgba(99, 102, 241, 0.3)',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
                    boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.4)',
                  },
                }}
              >
                Choose File
              </Button>
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ 
                  mt: 2, 
                  color: 'text.secondary',
                  opacity: 0.8,
                }}
              >
                Maximum file size: 10MB
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Paper 
          sx={{ 
            p: 3,
            background: 'linear-gradient(145deg, rgba(26, 27, 58, 0.8) 0%, rgba(37, 38, 89, 0.6) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            animation: 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            '@keyframes slideInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            animation: 'fadeIn 0.8s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            },
          }}>
            <Box sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
              },
            }}>
              <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: 'success.light',
              }}
            >
              Uploaded Documents ({uploadedFiles.length})
            </Typography>
          </Box>
          <List dense sx={{ '& .MuiListItem-root': { mb: 1 } }}>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 3,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`,
                  '&:hover': {
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    transform: 'translateX(8px) scale(1.02)',
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
                  },
                  '@keyframes slideInLeft': {
                    '0%': { opacity: 0, transform: 'translateX(-20px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
                  },
                }}
              >
                <ListItemIcon>
                  <Box sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <PictureAsPdf sx={{ color: 'error.light', fontSize: 24 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle2" 
                      noWrap 
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {file.fileName}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                      <Chip 
                        label={`${file.chunks} chunks`} 
                        size="small" 
                        sx={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          color: 'white',
                          fontWeight: 600,
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          opacity: 0.8,
                        }}
                      >
                        {formatTimestamp(file.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileUploader;
