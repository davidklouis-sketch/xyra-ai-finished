import React from 'react'
import { Linkedin, Twitter, Mail, Instagram } from 'lucide-react'
import Logo from './Logo'
import { useI18n } from '../i18n/i18n.jsx'

const Footer = () => {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    [t('footer.product.title')]: [
      { name: t('footer.product.features'), href: '#features' },
      { name: t('footer.product.services'), href: '#services' },
      { name: t('footer.product.pricing'), href: '#pricing' },
      { name: t('footer.product.documentation'), href: '#' },
    ],
    [t('footer.company.title')]: [
      { name: t('footer.company.about'), href: '#' },
      { name: t('footer.company.careers'), href: '#' },
      { name: t('footer.company.blog'), href: '#' },
      { name: t('footer.company.contact'), href: '#contact' },
    ],
    [t('footer.resources.title')]: [
      { name: t('footer.resources.community'), href: '#' },
      { name: t('footer.resources.support'), href: '#' },
      { name: t('footer.resources.api'), href: '#' },
      { name: t('footer.resources.cases'), href: '#' },
    ],
    [t('footer.legal.title')]: [
      { name: t('footer.legal.impressum'), href: '/legal/impressum.html' },
      { name: t('footer.legal.privacy'), href: '/legal/datenschutz.html' },
      { name: t('footer.legal.terms'), href: '/legal/agb.html' },
      { name: t('footer.legal.cookies'), href: '/legal/cookies.html' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: 'https://x.com/Xyra_Digital', label: 'X (Twitter)' },
    { icon: Instagram, href: 'https://www.instagram.com/xyraai.official/', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/xyraai/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:david.louis@xyra-ai.de', label: 'Email' },
  ]

  return (
    <footer className="bg-dark-light border-t border-dark-lighter relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(700px circle at 10% -10%, rgba(48,248,237,0.12), transparent 40%)'
      }} />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo className="w-10 h-10" />
              <span className="text-2xl font-bold">
                <span className="text-primary">Xyra</span>AI
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-dark border border-white/10 rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-dark-lighter">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} XyraAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="/legal/impressum.html" className="text-gray-400 hover:text-primary transition-colors duration-300">
                {t('footer.legal.impressum')}
              </a>
              <a href="/legal/datenschutz.html" className="text-gray-400 hover:text-primary transition-colors duration-300">
                {t('footer.legal.privacy')}
              </a>
              <a href="/legal/agb.html" className="text-gray-400 hover:text-primary transition-colors duration-300">
                {t('footer.legal.terms')}
              </a>
              <a href="/legal/cookies.html" className="text-gray-400 hover:text-primary transition-colors duration-300">
                {t('footer.legal.cookies')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


