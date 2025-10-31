import React from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { useI18n } from '../i18n/i18n.jsx'

const Pricing = () => {
  const { t } = useI18n()
  const mkFeatures = (key) => {
    const f = t(key)
    return Array.isArray(f) ? f : []
  }
  const plans = [
    {
      name: t('pricing.plans.discovery.name'),
      price: 'Fixed',
      period: '',
      description: t('pricing.plans.discovery.desc'),
      features: mkFeatures('pricing.plans.discovery.features'),
      popular: false,
    },
    {
      name: t('pricing.plans.build.name'),
      price: 'Monthly',
      period: '',
      description: t('pricing.plans.build.desc'),
      features: mkFeatures('pricing.plans.build.features'),
      popular: true,
    },
    {
      name: t('pricing.plans.scale.name'),
      price: 'Custom',
      period: '',
      description: t('pricing.plans.scale.desc'),
      features: mkFeatures('pricing.plans.scale.features'),
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="section-padding bg-dark-light relative scroll-mt-24 md:scroll-mt-28">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(800px circle at 20% 80%, rgba(48,248,237,0.10), transparent 40%)'
      }} />
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight accent-underline inline-block">
            {t('pricing.heading')}
          </h2>
          <p className="text-xl text-gray-300/90 max-w-3xl mx-auto">{t('pricing.subheading')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative card ${
                plan.popular ? 'border-primary/40 shadow-lg shadow-primary/20 scale-105' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    {t('pricing.mostPopular')}
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl font-bold text-primary">{plan.price}</span>
                  <span className="text-gray-400 mb-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="text-primary flex-shrink-0 mt-1" size={18} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full py-3 rounded-lg font-semibold transition-all duration-300 text-center ${
                  plan.popular
                    ? 'bg-primary text-black hover:bg-primary-dark hover:scale-105'
                    : 'bg-dark-lighter text-white hover:bg-dark hover:border-primary/40 border-2 border-transparent'
                }`}
              >
                {t('pricing.cta')}
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12 text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p>{t('pricing.note')}</p>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing


