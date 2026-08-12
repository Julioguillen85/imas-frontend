import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { APP_VERSION } from './config/version.js'

console.log(`%c 🚀 IMAS WEB VERSION: ${APP_VERSION} `, 'background: #E52E71; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');


class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL REACT CRASH:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          padding: '24px',
          fontFamily: 'monospace',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            maxWidth: '800px',
            width: '100%',
            backgroundColor: '#1e293b',
            border: '2px solid #ef4444',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <h1 style={{ color: '#ef4444', fontSize: '20px', marginBottom: '12px' }}>
              ⚠️ Se detectó un error al renderizar
            </h1>
            <p style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '14px' }}>
              <strong>Mensaje:</strong> {this.state.error?.toString()}
            </p>
            <details style={{ whiteSpace: 'pre-wrap', color: '#94a3b8', fontSize: '12px' }}>
              {this.state.errorInfo?.componentStack || this.state.error?.stack}
            </details>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#E52E71',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 Limpiar Caché y Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>,
)

