import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './config/i18n.js'
import { Theme } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { QueryClientProvider } from '@tanstack/react-query'
import Router from './routes.jsx'
import queryClient from './config/queryClient.js'
import { AuthProvider } from './context/AuthContext.jsx'

export const Main = () => {
  const { i18n } = useTranslation();
  const language = i18n.language?.split('-')[0] || 'en';
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [direction, language]);

  return (
    <Theme dir={direction}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router/>
        </AuthProvider>
      </QueryClientProvider>
    </Theme>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main/>
  </StrictMode>,
)
