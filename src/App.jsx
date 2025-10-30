import React from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Helmet>
        <title>XyraAI - AI for Music & Creators</title>
        <meta
          name="description"
          content="XyraAI spezialisiert sich auf KI‑Automatisierung für Musikbranche und Social‑Media‑Creator – Agents für Releases, Touren, Community & Commerce."
        />
        <meta name="keywords" content="AI, artificial intelligence, machine learning, NLP, computer vision, AI solutions, automation" />
        <meta property="og:title" content="XyraAI - AI for Music & Creators" />
        <meta property="og:description" content="Transform your business with cutting-edge AI solutions" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://xyra.digital" />
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
      </div>
    </>
  )
}

export default App


