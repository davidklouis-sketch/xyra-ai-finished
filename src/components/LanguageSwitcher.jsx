import React from 'react'
import { useI18n } from '../i18n/i18n.jsx'

const LanguageSwitcher = ({ className = '' }) => {
  const { lang, setLang } = useI18n()

  const toggle = () => setLang(lang === 'de' ? 'en' : 'de')

  return (
    <button
      onClick={toggle}
      className={`px-3 py-1.5 rounded-lg border border-white/10 text-sm hover:border-primary hover:text-primary transition-colors ${className}`}
      aria-label={lang === 'de' ? 'Switch to English' : 'Auf Deutsch umschalten'}
    >
      {lang === 'de' ? 'DE' : 'EN'}
    </button>
  )
}

export default LanguageSwitcher


