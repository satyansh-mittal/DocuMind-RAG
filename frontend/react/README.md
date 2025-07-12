# RAG Chat Application - Frontend

A modern, production-ready React frontend for the RAG (Retrieval-Augmented Generation) Chat Application. Built with Material-UI, Vite, and TypeScript-ready architecture.

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with Material-UI components
- **Real-time Chat**: Interactive chat interface with typing indicators
- **File Upload**: Drag-and-drop PDF upload with progress tracking
- **Session Management**: Unique session IDs for conversation persistence
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized with React best practices and lazy loading

## 🛠️ Tech Stack

- **React 19** - Latest React features
- **Material-UI (MUI) v6** - Modern React component library
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client with interceptors
- **React Dropzone** - File upload functionality
- **UUID** - Session ID generation
- **Emotion** - CSS-in-JS styling

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your backend URL (default: `http://localhost:8000`)

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ChatWindow.jsx   # Main chat interface
│   └── FileUploader.jsx # PDF upload component
├── services/            # API services
│   └── api.js          # Axios configuration and endpoints
├── App.jsx             # Main app component with routing
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE` - Backend API URL (default: http://localhost:8000)
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version
- `VITE_DEV_MODE` - Development mode flag
- `VITE_LOG_LEVEL` - Logging level

### API Endpoints

The frontend communicates with these backend endpoints:

- `POST /api/upload` - Upload PDF files
- `POST /api/chat` - Send chat messages
- `GET /health` - Health check (optional)

## 📱 Features

### Chat Interface
- Real-time messaging with the RAG backend
- Message history with timestamps
- Copy-to-clipboard functionality
- Error handling with retry options
- Typing indicators

### File Upload
- Drag-and-drop PDF upload
- File validation (PDF only, max 10MB)
- Upload progress tracking
- Success/error notifications
- File management with metadata display

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Optimized for tablets and desktops

## 🎨 Customization

### Theme Customization

The Material-UI theme can be customized in `App.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change primary color
    },
    // Add more customizations
  },
});
```

### Component Styling

Components use Material-UI's `sx` prop for styling:

```javascript
<Box sx={{ 
  backgroundColor: 'primary.main',
  padding: 2,
  borderRadius: 1 
}}>
```

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading with React.lazy()
- **Bundle Optimization**: Vite's optimized bundling
- **Image Optimization**: Responsive images and proper formats
- **Caching**: Service worker for static assets (optional)
- **Tree Shaking**: Automatic unused code elimination

## 🔒 Security

- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based authentication ready
- **File Validation**: Client-side file type and size validation
- **Environment Variables**: Secure configuration management

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (if configured)
npm run test:e2e
```

## 📈 Production Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker Deployment

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Build fails with dependency errors**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**CORS errors**:
- Check `VITE_API_BASE` in `.env`
- Ensure backend CORS is configured correctly

**File upload fails**:
- Check file size (max 10MB)
- Ensure PDF format
- Check backend endpoint availability

### Debug Mode

Enable debug mode in `.env`:
```
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug
```

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
