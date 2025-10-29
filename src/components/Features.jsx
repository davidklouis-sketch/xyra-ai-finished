import React from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Users, Lock, Globe, Clock, Award, Headphones } from 'lucide-react'
import { useI18n } from '../i18n/i18n.jsx'

const Features = () => {
  const { t } = useI18n()
  const features = [
    { icon: Zap, title: t('features.items.production.title'), description: t('features.items.production.desc') },
    { icon: Users, title: t('features.items.human.title'), description: t('features.items.human.desc') },
    { icon: Lock, title: t('features.items.security.title'), description: t('features.items.security.desc') },
    { icon: Globe, title: t('features.items.scale.title'), description: t('features.items.scale.desc') },
    { icon: Clock, title: t('features.items.iteration.title'), description: t('features.items.iteration.desc') },
    { icon: Award, title: t('features.items.outcomes.title'), description: t('features.items.outcomes.desc') },
  ]

  const rawBenefits = t('features.benefits')
  const benefits = Array.isArray(rawBenefits) ? rawBenefits : []
  return (
    <section id="features" className="section-padding bg-dark relative scroll-mt-24 md:scroll-mt-28">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(900px circle at 80% 20%, rgba(0,255,136,0.12), transparent 40%)'
      }} />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight accent-underline inline-block">
            {t('features.heading')}
          </h2>
          <p className="text-xl text-gray-300/90 max-w-3xl mx-auto">{t('features.subheading')}</p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center">
                  <feature.icon className="text-primary" size={22} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          className="bg-dark-light/80 rounded-2xl p-8 md:p-12 border border-white/5 backdrop-blur-md"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">{t('features.outcomesTitle')} <span className="text-primary"> </span></h3>
              <p className="text-gray-300 text-lg mb-8">{t('features.outcomesSubtitle')}</p>
              <div className="flex items-center gap-3">
                <Headphones className="text-primary" size={24} />
                <span className="text-gray-300">{t('features.supportLine')}</span>
              </div>
            </div>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                    <Check size={16} className="text-black" />
                  </div>
                  <span className="text-gray-300 text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features


