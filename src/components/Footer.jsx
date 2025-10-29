import React from 'react'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import Logo from './Logo'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Services', href: '#services' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Documentation', href: '#' },
    ],
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Contact', href: '#contact' },
    ],
    Resources: [
      { name: 'Community', href: '#' },
      { name: 'Support', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Case Studies', href: '#' },
    ],
    Legal: [
      { name: 'Impressum', href: '/legal/impressum.html' },
      { name: 'Datenschutz', href: '/legal/datenschutz.html' },
      { name: 'AGB', href: '/legal/agb.html' },
      { name: 'Cookie-Richtlinie', href: '/legal/cookies.html' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:david.louis@xyra.digital', label: 'Email' },
  ]

  return (
    <footer className="bg-dark-light border-t border-dark-lighter relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(700px circle at 10% -10%, rgba(0,255,136,0.10), transparent 40%)'
      }} />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo className="w-10 h-10" />
              <span className="text-2xl font-bold">
                Xyra<span className="text-primary">.Media</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Applied AI for support, sales, and operations — built for production, not demos.
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
              © {currentYear} Xyra.Media. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="/legal/impressum.html" className="text-gray-400 hover:text-primary transition-colors duration-300">
                Impressum
              </a>
              <a href="/legal/datenschutz.html" className="text-gray-400 hover:text-primary transition-colors duration-300">
                Datenschutz
              </a>
              <a href="/legal/agb.html" className="text-gray-400 hover:text-primary transition-colors duration-300">
                AGB
              </a>
              <a href="/legal/cookies.html" className="text-gray-400 hover:text-primary transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


