"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Zap, Shield, Sparkles, MessageSquare, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const features = [
    {
      icon: <Bot className="w-6 h-6 text-purple-400" />,
      title: "Intelligent Dialogflow AI",
      description: "Powered by Google Dialogflow to understand natural language, context, and complex queries with ease."
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "Lightning Fast Responses",
      description: "Built on Next.js serverless edge technology ensuring zero latency and real-time interaction."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-pink-400" />,
      title: "Premium Glassmorphic UI",
      description: "A visually stunning aesthetic featuring fluid animations, backdrop blurs, and an immersive dark mode."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-400" />,
      title: "Secure & Scalable",
      description: "Enterprise-grade security using Google Cloud service accounts to protect your conversational data."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      {/* Background glowing orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Nexus<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI</span></span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto mt-10"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white/80">Next-Generation Conversational Agent</span>
          </motion.div>

          {/* Hero Section */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Meet Your New <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400">
              Intelligent Assistant
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl leading-relaxed">
            Our objective is to deliver a highly intelligent, visually stunning, and context-aware AI assistant. Whether you need support or insights, it provides real-time, accurate answers wrapped in a premium experience.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <Link href="/chat">
              <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <MessageSquare className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Open Chatbot</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-32"
        >
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} NexusAI. Powered by Next.js and Google Dialogflow.</p>
        </div>
      </footer>
    </div>
  );
}
