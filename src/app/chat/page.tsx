"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Send, Bot, User, Loader2, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  category: string;
  name: string;
  price: string;
  imageUrl: string;
  link: string;
};

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  products?: Product[];
};

const parseBotResponse = (text: string) => {
  const lines = text.split('\n');
  const products: Product[] = [];
  const normalTextLines: string[] = [];

  for (const line of lines) {
    const parts = line.split('\t');
    // If the line has at least 4 parts and the 4th part looks like a URL, treat it as a product
    if (parts.length >= 4 && parts[3].trim().startsWith('http')) {
      products.push({
        category: parts[0]?.trim(),
        name: parts[1]?.trim(),
        price: parts[2]?.trim(),
        imageUrl: parts[3]?.trim(),
        link: parts[4]?.trim() || '#',
      });
    } else {
      normalTextLines.push(line);
    }
  }

  return {
    text: normalTextLines.join('\n').trim(),
    products: products.length > 0 ? products : undefined,
  };
};

export default function HomeChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "bot", text: "Hello! I am your AI assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text, sessionId }),
      });

      const data = await response.json();

      if (response.ok) {
        const parsed = parseBotResponse(data.reply);
        const combinedProducts = [...(data.products || []), ...(parsed.products || [])];
        
        setMessages((prev) => [
          ...prev,
          { 
            id: crypto.randomUUID(), 
            sender: "bot", 
            text: parsed.text || (combinedProducts.length > 0 ? "Here are some options for you:" : ""), 
            products: combinedProducts.length > 0 ? combinedProducts : undefined 
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), sender: "bot", text: "Sorry, I encountered an error. Please try again." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "bot", text: "Network error. Please check your connection." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Chat Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="w-full max-w-4xl h-[85vh] flex flex-col bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">AI Assistant</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-white/60 font-medium uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
          
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/5 transition-colors text-sm font-medium">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          </Link>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-end gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${msg.sender === "user" ? "bg-white/10" : "bg-gradient-to-tr from-purple-500 to-blue-500"}`}>
                    {msg.sender === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  
                  <div className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-sm" 
                      : "bg-white/10 text-white/90 border border-white/5 rounded-bl-sm"
                  }`}>
                    {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}
                    
                    {msg.products && msg.products.length > 0 && (
                      <div className="flex overflow-x-auto gap-4 mt-4 pb-2 scrollbar-thin scrollbar-thumb-white/20">
                        {msg.products.map((p, i) => (
                          <a 
                            href={p.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            key={i} 
                            className="min-w-[220px] w-[220px] bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors flex flex-col shrink-0 group"
                          >
                            <div className="h-36 overflow-hidden bg-white/5">
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="p-4 flex flex-col gap-1.5 flex-1">
                              <div className="text-xs text-white/50 truncate uppercase tracking-wider">{p.category}</div>
                              <div className="font-medium text-[15px] text-white line-clamp-2 leading-snug">{p.name}</div>
                              <div className="text-green-400 font-semibold mt-auto pt-2">{p.price && !p.price.includes('Price') ? `₹${p.price.replace('₹', '')}` : p.price}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 border border-white/5 px-5 py-4 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                  <motion.div className="w-1.5 h-1.5 bg-white/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-1.5 h-1.5 bg-white/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-1.5 h-1.5 bg-white/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white/5 border-t border-white/10">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-full p-2 pl-6 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-transparent transition-all shadow-inner"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-[15px]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shrink-0 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg group"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
