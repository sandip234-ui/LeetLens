import React from 'react'
import { motion } from 'framer-motion'
import LightPillar from '../components/LightPillar'
import BorderGlow from '../components/BorderGlow'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const container = {
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

export default function About() {
  return (
    <main className="relative z-10 max-w-6xl px-4 py-8 mx-auto space-y-12 sm:px-6 sm:py-16">
      {/* Hero Section */}
      <motion.div 
        className="pt-8 pb-4 space-y-4 text-center hero-section animate-fade-up"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LightPillar />
        
        <div className="relative z-10 space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-indigo-300 border"
            style={{ background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.22)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Interview Intelligence Platform
          </div>

          <h1 className="max-w-3xl mx-auto text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-5xl gradient-text-hero">
            Understand What Top Companies Actually Ask
          </h1>

          <p className="max-w-2xl mx-auto text-base text-slate-300 leading-relaxed sm:text-lg">
            LeetLens helps software engineers discover the LeetCode questions most frequently associated with leading technology companies, making interview preparation more focused and data-driven.
          </p>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.section 
        className="space-y-4"
        variants={container}
        initial="initial"
        animate="animate"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Core Features</h2>
          <p className="text-sm text-slate-400">What makes LeetLens powerful</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Company Intelligence',
              description: 'Discover which companies are associated with specific LeetCode questions.',
              icon: '🏢',
            },
            {
              title: 'Frequency Rankings',
              description: 'Prioritize questions based on frequency scores across company datasets.',
              icon: '📊',
            },
            {
              title: 'Fast Search',
              description: 'Search thousands of company-tagged interview questions instantly.',
              icon: '⚡',
            },
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={fadeInUp}
              className="relative group"
            >
              <BorderGlow
                glowColor="139 92 246"
                borderRadius={20}
                glowRadius={60}
                glowIntensity={0.8}
                borderWidth={1}
                animated={true}
              >
                <div
                  className="p-6 rounded-2xl space-y-3 transition-all duration-300 group-hover:bg-white/[0.02]"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </BorderGlow>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="space-y-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">How LeetLens Works</h2>
          <p className="text-sm text-slate-400">Your path to smarter interview preparation</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-4">
          {[
            { num: '1', title: 'Search', desc: 'Find questions by title, keyword, company, or question ID.' },
            { num: '2', title: 'Analyze', desc: 'Review company associations and popularity signals.' },
            { num: '3', title: 'Prioritize', desc: 'Use frequency scores to identify commonly reported interview questions.' },
            { num: '4', title: 'Practice', desc: 'Focus on high-signal questions before interviews.' },
          ].map((step, idx) => (
            <motion.div 
              key={idx}
              variants={fadeInUp}
              className="relative"
            >
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 text-indigo-300"
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    border: '2px solid rgba(99,102,241,0.3)',
                  }}
                >
                  {step.num}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>

              {/* Connector line */}
              {idx < 3 && (
                <div 
                  className="hidden sm:block absolute top-6 -right-3 w-6 h-0.5"
                  style={{
                    background: 'linear-gradient(to right, rgba(139,92,246,0.3), transparent)',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Understanding The Data Section */}
      <motion.section 
        className="space-y-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Understanding the Data</h2>
          <p className="text-sm text-slate-400">Clarity on what the metrics mean</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: 'Frequency Score',
              content: 'Frequency Score is a relative popularity indicator derived from company-tagged LeetCode datasets. Higher values suggest a question appears more frequently across reported interview datasets. Higher = asked more often.',
            },
            {
              title: 'Company Count',
              content: 'Company Count represents the number of unique companies associated with a question. For example, "Companies: 55" means the question appears across datasets associated with 55 unique companies.',
            },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              variants={fadeInUp}
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <h3 className="text-base font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Data Source Section */}
      <motion.section 
        className="space-y-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div
          className="p-8 rounded-2xl text-center space-y-3"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3 className="text-lg font-semibold text-white">Where The Data Comes From</h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            LeetLens is built using publicly available company-tagged LeetCode datasets and frequency information aggregated across multiple interview-data sources. The goal is to help candidates identify patterns and prioritize preparation efficiently.
          </p>
        </div>
      </motion.section>

      {/* Disclaimer Section */}
      <motion.section 
        className="space-y-4 py-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div
          className="p-6 rounded-2xl space-y-3 border-l-4"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeftColor: 'rgba(248,113,113,0.4)',
          }}
        >
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            Important Note
          </h3>
          <div className="space-y-2 text-sm text-slate-400 leading-relaxed">
            <p>Interview processes evolve over time. Frequency scores should be treated as directional signals rather than guarantees of future interview questions.</p>
            <p>Different teams, locations, and hiring cycles may ask different questions.</p>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
