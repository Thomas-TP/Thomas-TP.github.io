import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@unocss/reset/tailwind-v4.css';
import './i18n';
import './globals.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
