import React from 'react'
import { motion } from 'framer-motion'
import { Brain, MessageSquare, TrendingUp, Database, Workflow, Headphones, Clock, Users } from 'lucide-react'
import { useI18n } from '../i18n/i18n.jsx'

const Services = () => {
  const { t } = useI18n()

  const handleCardClick = () => {
    const contactSection = document.querySelector('#contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const services = [
    { icon: MessageSquare, title: t('services.items.chat.title'), description: t('services.items.chat.desc') },
    { icon: Headphones, title: t('services.items.voice.title'), description: t('services.items.voice.desc') },
    { icon: Workflow, title: t('services.items.automation.title'), description: t('services.items.automation.desc') },
    { icon: Brain, title: t('services.items.custom.title'), description: t('services.items.custom.desc') },
    { icon: Clock, title: t('services.items.always.title'), description: t('services.items.always.desc') },
    { icon: TrendingUp, title: t('services.items.leads.title'), description: t('services.items.leads.desc') },
    { icon: Users, title: t('services.items.multi.title'), description: t('services.items.multi.desc') },
    { icon: Database, title: t('services.items.crm.title'), description: t('services.items.crm.desc') },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="services" className="section-padding bg-dark-light relative scroll-mt-24 md:scroll-mt-28">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(800px circle at 10% 20%, rgba(48,248,237,0.12), transparent 40%), radial-gradient(700px circle at 90% 60%, rgba(48,248,237,0.10), transparent 40%)'
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
            {t('services.heading')}
          </h2>
          <p className="text-xl text-gray-300/90 max-w-3xl mx-auto">{t('services.subheading')}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onClick={handleCardClick}
              className={`card group hover:shadow-lg hover:shadow-primary/20 cursor-pointer ${
                index % 4 === 0 ? 'lg:col-span-5' : index % 4 === 1 ? 'lg:col-span-7' : index % 4 === 2 ? 'lg:col-span-6' : 'lg:col-span-6'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center">
                  <service.icon className="text-primary" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-400">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Services


