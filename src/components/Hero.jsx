import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useI18n } from '../i18n/i18n.jsx'

const Hero = () => {
  const { t } = useI18n()
  const handleGetStarted = () => {
    const contactSection = document.querySelector('#contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden scroll-mt-24 md:scroll-mt-28">
      {/* Aurora + radial spot background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-dark to-dark-light" />
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-radial-spot" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full blur-3xl opacity-20" style={{
          background: 'radial-gradient(closest-side, rgba(34,211,238,0.25), transparent 70%)'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(600px circle at 50% 30%, black, transparent)'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 section-padding text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-md">
            <Sparkles className="text-accent" size={20} />
            <span className="text-accent font-semibold">{t('hero.badge')}</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('hero.title1')}
          <span className="block text-primary">{t('hero.title2')}</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-gray-300/90 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button onClick={handleGetStarted} className="btn-primary inline-flex items-center gap-2 group">
            {t('hero.ctaStart')}
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </button>
          <a href="#services" className="btn-secondary">
            {t('hero.ctaLearn')}
          </a>
        </motion.div>

        {/* Quick proof points (industry chips) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { number: t('hero.chips.musicTitle'), label: t('hero.chips.musicLabel') },
            { number: t('hero.chips.creatorTitle'), label: t('hero.chips.creatorLabel') },
            { number: t('hero.chips.commerceTitle'), label: t('hero.chips.commerceLabel') },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xl md:text-2xl font-semibold text-accent mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/60 rounded-full flex justify-center items-start">
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 md:mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero


