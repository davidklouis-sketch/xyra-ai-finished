import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { useI18n } from '../i18n/i18n.jsx'

const Navbar = () => {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  const navItems = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.pricing'), href: '#pricing' },
    { name: t('nav.contact'), href: '#contact' },
  ]

  const handleNavClick = (e, href) => {
    const element = document.querySelector(href)
    if (element) {
      e.preventDefault()
      setIsOpen(false)
      // rely on scroll-mt-* utilities on sections for a consistent offset
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'backdrop-blur-md' : 'backdrop-blur-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-24">
        <div className="relative flex justify-between items-center h-20">
          {/* Logo */}
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-3 group">
            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-2xl font-bold tracking-tight">
              xyra<span className="text-primary">.ai</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative text-gray-300 hover:text-white transition-colors duration-300 font-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.name}
              </a>
            ))}
            <LanguageSwitcher />
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="btn-primary">{t('nav.getStarted')}</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-primary transition-colors duration-300"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 md:hidden"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
              {/* panel */}
              <motion.div
                key="panel"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed md:hidden left-0 right-0 top-20 z-50 bg-dark/95 backdrop-blur-md border-t border-white/10"
                role="dialog" aria-modal="true"
              >
                <div className="px-4 py-4 space-y-3 max-h-[calc(100vh-80px)] overflow-y-auto">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="block text-gray-200 hover:text-primary transition-colors duration-300 font-medium py-2"
                    >
                      {item.name}
                    </a>
                  ))}
                  <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="block btn-primary text-center">{t('nav.getStarted')}</a>
                  <div className="pt-2">
                    <LanguageSwitcher className="w-full" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Glass dock */}
      <div className={`pointer-events-none ${scrolled ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </nav>
  )
}

export default Navbar


