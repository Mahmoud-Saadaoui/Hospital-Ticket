import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './config/i18n.js'
import { Theme } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import Router from './routes.jsx'

export const Main = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <Theme dir={direction}>
      <Router/>
    </Theme>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main/>
  </StrictMode>,
)
