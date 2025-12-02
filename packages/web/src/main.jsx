import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import './index.css';

const rootElement = document.getElementById('root');

async function init() {
<<<<<<< HEAD
  if (import.meta.env.DEV) {
    try {
      await import('./mocks/fetchMock.js');
      window.__FETCH_MOCK_ACTIVE__ = true;
      console.info('[mocks] fetchMock installed');
    } catch (err) {
      console.warn('[mocks] fetchMock failed to load:', err);
    }

    try {
      const { worker } = await import('./mocks/browser.js');
      await worker.start({ onUnhandledRequest: 'bypass' });
      window.__MSW_STARTED__ = true;
      console.info('[mocks] MSW worker started');
    } catch (err) {
      console.warn(
        '[mocks] MSW worker failed to start (continuing with fetchMock):',
        err
      );
=======
  // Sólo arrancar MSW en desarrollo para simular backend cuando no lo queramos ejecutar
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks/browser.js');
      await worker.start({ onUnhandledRequest: 'bypass' });
      // Indicar que MSW arrancó para evitar instalar fallback fetch mock
      window.__MSW_STARTED__ = true;
    } catch (err) {
      // ignore if MSW isn't installed or fails to start
      // console.warn('MSW failed to start', err);
    }

    // Si MSW no arrancó (p. ej. falta el service worker), usar fetchMock como fallback
    if (!window.__MSW_STARTED__) {
      try {
        await import('./mocks/fetchMock.js');
      } catch {
        // ignore
      }
>>>>>>> main
    }
  }

  const { ToastProvider } = await import('./components/ui/ToastContext.jsx');

  createRoot(rootElement).render(
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
<<<<<<< HEAD
    </BrowserRouter>
=======
    </BrowserRouter>,
>>>>>>> main
  );
}

init();
