import React from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <html lang="de" />
        <title>XyraAI - KI für Musikbranche & Creator Economy | Voice & Chat Agenten</title>
        <meta
          name="description"
          content="Produktionsreife KI-Lösungen für Musikindustrie und Creator. Voice-Agenten, Chat-Bots und Workflow-Automatisierung für Releases, Touren, Merch und Community Management. Jetzt starten!"
        />
        <meta name="keywords" content="KI Musikbranche, AI Creator Economy, Voice Agenten, Chat-Bots Musik, Workflow Automatisierung, KI Tourmanagement, AI Merchandise, Community Management KI" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="XyraAI" />
        <link rel="canonical" href="https://xyra-ai.de/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xyra-ai.de/" />
        <meta property="og:title" content="XyraAI - KI für Musikbranche & Creator Economy" />
        <meta property="og:description" content="Produktionsreife KI-Lösungen für Musikindustrie und Creator. Voice-Agenten, Chat-Bots und Workflow-Automatisierung." />
        <meta property="og:image" content="https://xyra-ai.de/logo-social.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="de_DE" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:site_name" content="XyraAI" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://xyra-ai.de/" />
        <meta name="twitter:title" content="XyraAI - KI für Musikbranche & Creator Economy" />
        <meta name="twitter:description" content="Produktionsreife KI-Lösungen für Musikindustrie und Creator. Voice-Agenten, Chat-Bots und Workflow-Automatisierung." />
        <meta name="twitter:image" content="https://xyra-ai.de/logo-social.png" />
        <meta name="twitter:site" content="@Xyra_Digital" />
        <meta name="twitter:creator" content="@Xyra_Digital" />

        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#0B0B12" />
        <meta name="msapplication-TileColor" content="#30f8ed" />
        <link rel="alternate" hreflang="de" href="https://xyra-ai.de/" />
        <link rel="alternate" hreflang="en" href="https://xyra-ai.de/" />
        <link rel="alternate" hreflang="x-default" href="https://xyra-ai.de/" />

        {/* JSON-LD Schema Markup - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "XyraAI",
            "url": "https://xyra-ai.de",
            "logo": "https://xyra-ai.de/logo-social.png",
            "description": "KI-Lösungen für Musikbranche und Creator Economy - Voice-Agenten, Chat-Bots und Workflow-Automatisierung",
            "sameAs": [
              "https://x.com/Xyra_Digital",
              "https://linkedin.com"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "david.louis@xyra-ai.de",
              "contactType": "Customer Service",
              "areaServed": ["DE", "AT", "CH"],
              "availableLanguage": ["German", "English"]
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "DE"
            }
          })}
        </script>

        {/* JSON-LD Schema Markup - WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "XyraAI",
            "url": "https://xyra-ai.de",
            "description": "Produktionsreife KI-Lösungen für Musikindustrie und Creator",
            "inLanguage": ["de", "en"],
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://xyra-ai.de/?s={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* JSON-LD Schema Markup - Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "AI Solutions for Music Industry",
            "provider": {
              "@type": "Organization",
              "name": "XyraAI",
              "url": "https://xyra-ai.de"
            },
            "areaServed": ["DE", "AT", "CH", "EU"],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "AI Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "KI-Chat-Agenten",
                    "description": "Kontextverständnis und Aktionen für Support und Vertrieb"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Voice-Agenten",
                    "description": "Natürliche Telefonanrufe für Terminbuchungen und Nachfragen"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Prozessautomatisierung",
                    "description": "Mehrstufige Workflows sicher mit Ihren Tools und Daten verknüpfen"
                  }
                }
              ]
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-dark text-white">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Features />
          <Pricing />
          <Contact />
        </main>
        <Footer />
        <ChatBot />
      </div>
    </>
  )
}

export default App


