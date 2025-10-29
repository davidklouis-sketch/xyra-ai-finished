import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import de from './translations/de.json'
import en from './translations/en.json'

const I18nContext = createContext({
  lang: 'de',
  t: (key) => key,
  setLang: () => {},
})

const dictionaries = { de, en }
const STORAGE_KEY = 'xyra.lang'

export const I18nProvider = ({ children }) => {
  const detect = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (saved === 'de' || saved === 'en')) return saved
    const nav = (navigator.language || 'de').toLowerCase()
    return nav.startsWith('de') ? 'de' : 'de' // German first default
  }

  const [lang, setLangState] = useState(detect())

  const setLang = (l) => {
    const next = l === 'en' ? 'en' : 'de'
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.setAttribute('lang', next)
  }

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  const t = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.de
    return (key, vars = {}) => {
      const value = key.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), dict)
      if (value == null) return key
      if (typeof value === 'string') {
        return value.replace(/\{(.*?)\}/g, (_, k) => (vars[k] ?? ''))
      }
      return value // allow arrays/objects to pass through
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)


