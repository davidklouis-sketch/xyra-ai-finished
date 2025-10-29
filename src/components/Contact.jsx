import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Calendar } from 'lucide-react'
import { useI18n } from '../i18n/i18n.jsx'

const Contact = () => {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    datetime: '',
    duration: '30',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    bookDirect: false,
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    const webhookUrl = import.meta.env.VITE_CONTACT_WEBHOOK_URL

    // If webhook URL is configured, send to webhook
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            message: formData.message,
            datetime: formData.datetime,
            durationMinutes: Number(formData.duration || 30),
            timezone: formData.timezone,
            bookDirect: Boolean(formData.bookDirect),
            honeypot: '', // Bot detection field
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus({
            type: 'success',
            message: data.message || 'Thank you for your message! We\'ll get back to you soon.',
          })
          setFormData({
            name: '',
            email: '',
            company: '',
            message: '',
            datetime: '',
            duration: '30',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            bookDirect: false,
          })
        } else {
          // Handle validation errors from n8n
          if (data.error === 'validation_failed') {
            setStatus({
              type: 'error',
              message: data.message || 'Please check your input and try again.',
            })
          } else {
            throw new Error(data.message || 'Failed to submit form')
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        setStatus({
          type: 'error',
          message: 'Something went wrong. Please try again or email us directly at david.louis@xyra.digital',
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Fallback: simulate submission if no webhook configured
      setTimeout(() => {
        setStatus({
          type: 'success',
          message: 'Thank you for your interest! We\'ll reach out as we approach launch.',
        })
        setFormData({
          name: '',
          email: '',
          company: '',
          message: '',
          datetime: '',
          duration: '30',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          bookDirect: false,
        })
        setIsSubmitting(false)
      }, 1500)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'david.louis@xyra.digital',
      link: 'mailto:david.louis@xyra.digital',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+49 151 64657852',
      link: 'tel:+4915164657852',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Schwetzingen 68723, Deutschland',
      link: null,
    },
  ]

  return (
    <section id="contact" className="section-padding bg-dark relative scroll-mt-24 md:scroll-mt-28">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(900px circle at 85% 70%, rgba(34,211,238,0.10), transparent 40%)'
      }} />
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight accent-underline inline-block">{t('contact.heading')}</h2>
          <p className="text-xl text-gray-300/90 max-w-3xl mx-auto">{t('contact.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">{t('contact.info.title')}</h3>
              <p className="text-gray-400 mb-8">{t('contact.info.desc')}</p>
            </div>

            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-gray-400 hover:text-primary transition-colors duration-300"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-400">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t('contact.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-lg focus:border-primary focus:outline-none transition-colors duration-300"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t('contact.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-lg focus:border-primary focus:outline-none transition-colors duration-300"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  {t('contact.company')}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  autoComplete="organization"
                  className="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-lg focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="Your Company"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('contact.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-lg focus:border-primary focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Tell us about your interest or ideas..."
                />
              </div>

              {/* Scheduling block */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="text-primary" size={18} />
                  <span className="font-semibold">{t('contact.schedule.title')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="datetime" className="block text-sm font-medium mb-2">{t('contact.schedule.dateTime')}</label>
                    <input
                      type="datetime-local"
                      id="datetime"
                      name="datetime"
                      value={formData.datetime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-lg focus:border-primary focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium mb-2">{t('contact.schedule.duration')}</label>
                    <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-lg focus:border-primary focus:outline-none transition-colors duration-300"
                    >
                      <option value="15">{t('contact.schedule.durationOptions.15')}</option>
                      <option value="30">{t('contact.schedule.durationOptions.30')}</option>
                      <option value="45">{t('contact.schedule.durationOptions.45')}</option>
                      <option value="60">{t('contact.schedule.durationOptions.60')}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium mb-2">{t('contact.schedule.timezone')}</label>
                    <input
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark border border-dark-lighter rounded-lg focus:border-primary focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input id="bookDirect" name="bookDirect" type="checkbox" checked={formData.bookDirect} onChange={(e)=> setFormData({ ...formData, bookDirect: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="bookDirect" className="text-sm">{t('contact.schedule.book')}</label>
                </div>
              </div>

              {status.message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    status.type === 'success'
                      ? 'bg-primary/10 border border-primary/30 text-primary'
                      : 'bg-red-500/10 border border-red-500/30 text-red-500'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {t('contact.send')}
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact


