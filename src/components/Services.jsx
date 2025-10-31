import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, MessageSquare, TrendingUp, Database, Workflow, Headphones, Clock, Users, X } from 'lucide-react'
import { useI18n } from '../i18n/i18n.jsx'

const Services = () => {
  const { t } = useI18n()
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)

  const handleCardClick = (workflowData) => {
    if (workflowData) {
      setSelectedWorkflow(workflowData)
    } else {
      const contactSection = document.querySelector('#contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const workflows = {
    chatbot: {
      title: 'ChatGPT Chatbot Workflow',
      description: 'Dieser Workflow verarbeitet Chatbot-Anfragen mit KI-gestützter Validierung und Antwortgenerierung.',
      image: '/n8n-chatbot-workflow.png',
      nodes: [
        { name: 'Webhook', desc: 'Empfängt POST-Anfragen vom Frontend-Chatbot' },
        { name: 'Validate and Extract', desc: 'Validiert und extrahiert Nachricht, prüft Länge (max 1000 Zeichen)' },
        { name: 'Check Valid', desc: 'Verzweigung: True = OpenAI, False = Fehlermeldung' },
        { name: 'OpenAI Request', desc: 'Sendet Anfrage an GPT-4o-mini mit System-Prompt und Sicherheitsregeln' },
        { name: 'Process Response', desc: 'Sanitiert Antwort (XSS-Schutz), limitiert auf 2000 Zeichen' },
        { name: 'Success/Error Response', desc: 'Sendet strukturierte JSON-Antwort zurück an Frontend' }
      ]
    },
    contact: {
      title: 'Contact Form mit Google Calendar Integration',
      description: 'Automatisiertes Kontaktformular mit Terminprüfung, OpenAI-E-Mail-Generierung und Kalender-Synchronisation.',
      image: '/n8n-contact-workflow.png',
      nodes: [
        { name: 'Webhook', desc: 'Empfängt Kontaktformular-Daten (Name, E-Mail, Firma, Nachricht, Terminwunsch)' },
        { name: 'Edit Fields', desc: 'Extrahiert und strukturiert alle Formularfelder inkl. Termindetails' },
        { name: 'Check Time & Prepare', desc: 'Validiert Terminwunsch (Geschäftszeiten 9-18 Uhr, Zukunftstermin)' },
        { name: 'Valid Booking Request?', desc: 'Verzweigung: Mit/ohne Terminbuchung' },
        { name: 'Google Calendar FreeBusy', desc: 'Prüft Verfügbarkeit im Google Calendar' },
        { name: 'Check Availability', desc: 'Analysiert FreeBusy-Response auf Konflikte' },
        { name: 'Time Slot Free?', desc: 'Verzweigung: Termin verfügbar/nicht verfügbar' },
        { name: 'OpenAI Nodes (3x)', desc: 'Generiert personalisierte Bestätigungs-E-Mails für alle Szenarien' },
        { name: 'Gmail Nodes (3x)', desc: 'Versendet E-Mails mit CC an david.louis@xyra.digital' },
        { name: 'Google Calendar Create', desc: 'Erstellt Termin mit Teilnehmer-Einladung' },
        { name: 'Respond Nodes (3x)', desc: 'Sendet Erfolgs-/Fehlermeldung an Frontend zurück' }
      ]
    }
  }

  const services = [
    { icon: MessageSquare, title: t('services.items.chat.title'), description: t('services.items.chat.desc'), workflow: workflows.chatbot, highlight: true },
    { icon: Headphones, title: t('services.items.voice.title'), description: t('services.items.voice.desc') },
    { icon: Workflow, title: t('services.items.automation.title'), description: t('services.items.automation.desc'), workflow: workflows.contact, highlight: true },
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
              onClick={() => handleCardClick(service.workflow)}
              className={`card group hover:shadow-lg ${
                service.highlight
                  ? 'hover:shadow-[#00eb62]/30 border-[#00eb62]/30 hover:border-[#00eb62]/60'
                  : 'hover:shadow-primary/20'
              } cursor-pointer transition-all duration-300 ${
                index % 4 === 0 ? 'lg:col-span-5' : index % 4 === 1 ? 'lg:col-span-7' : index % 4 === 2 ? 'lg:col-span-6' : 'lg:col-span-6'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${
                  service.highlight
                    ? 'bg-gradient-to-b from-[#00eb62]/20 to-[#00eb62]/10 border border-[#00eb62]/30'
                    : 'bg-gradient-to-b from-primary/20 to-accent/20 border border-white/10'
                } flex items-center justify-center`}>
                  <service.icon className={service.highlight ? 'text-[#00eb62]' : 'text-primary'} size={22} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    service.highlight ? 'group-hover:text-[#00eb62]' : 'group-hover:text-primary'
                  }`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-400">
                    {service.description}
                  </p>
                  {service.highlight && (
                    <p className="text-xs text-[#00eb62]/70 mt-2">Klicken für Workflow-Details</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Workflow Modal */}
      <AnimatePresence>
        {selectedWorkflow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedWorkflow(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-dark-light border border-[#00eb62]/40 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-[#00eb62]/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#00eb62]/20 to-[#25af71]/20 border-b border-[#00eb62]/30 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedWorkflow.title}</h3>
                  <p className="text-gray-300">{selectedWorkflow.description}</p>
                </div>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="w-10 h-10 rounded-full bg-[#00eb62]/10 hover:bg-[#00eb62]/20 border border-[#00eb62]/30 flex items-center justify-center transition-all duration-300 hover:rotate-90"
                >
                  <X className="text-[#00eb62]" size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Workflow Image */}
                  <div className="bg-dark rounded-xl border border-[#00eb62]/20 p-4 overflow-hidden">
                    <img
                      src={selectedWorkflow.image}
                      alt={selectedWorkflow.title}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>

                  {/* Node Descriptions */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-[#00eb62] mb-4">Workflow Nodes:</h4>
                    {selectedWorkflow.nodes.map((node, idx) => (
                      <div
                        key={idx}
                        className="bg-dark rounded-lg border border-[#00eb62]/20 p-4 hover:border-[#00eb62]/40 transition-colors duration-300"
                      >
                        <h5 className="font-semibold text-white mb-1">{node.name}</h5>
                        <p className="text-sm text-gray-400">{node.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Services


