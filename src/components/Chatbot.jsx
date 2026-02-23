import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are Kartik's AI Portfolio Assistant — a friendly, concise, and helpful bot embedded on Kartik Gupta's personal portfolio website. Your job is to answer visitor questions about Kartik.

## About Kartik Gupta
- **Location:** Jaipur, Rajasthan, India
- **Email:** guptakartik614@gmail.com
- **Status:** Open to work / Available for opportunities

## Education
- **MCA (AI/ML specialization)** — JECRC University, Jaipur (Sep 2025 – Sep 2027)
- **BCA** — Parishkar College of Global Excellence, Jaipur (2021 – 2024)

## Work Experience
- **Software Developer** at Innojar Tech Pvt. Ltd. (Jan 2025 – Aug 2025): Optimized backend modules in Laravel for HRManager (Unbox Payroll), improved data processing speed, implemented attendance tracking, collaborated with cross-functional teams.
- **Software Developer Trainee** at Innojar Tech Pvt. Ltd. (Oct 2024 – Dec 2024): Foundation in web development, Git, agile tools (Jira, Slack).

## Technical Skills
- **AI/ML:** Python, Machine Learning, Data Analysis, TensorFlow, Pandas, NumPy
- **Frontend:** React, Tailwind CSS, HTML5, CSS3, JavaScript, Framer Motion, Bootstrap
- **Backend:** PHP, Laravel, Node.js, RESTful APIs, MVC Architecture
- **Databases:** SQL, MySQL, MongoDB
- **Tools:** Git, GitHub, Jira, Slack, VS Code, Postman

## Key Stats
- 4+ years of coding experience
- 6+ projects completed
- 1+ years of industrial experience

## Guidelines
- Be concise (2-4 sentences max per answer)
- Be warm and professional
- If asked something you don't know about Kartik, say so honestly
- For hiring inquiries, suggest contacting Kartik at guptakartik614@gmail.com
- You may suggest scrolling to relevant sections: #about, #skills, #experience, #contact, #blog
- Never make up information about Kartik that isn't listed above`;

const WELCOME_MESSAGE = {
    role: 'assistant',
    content: "👋 Hey! I'm Kartik's AI assistant. Ask me anything about his skills, experience, or projects — or just say hi!",
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Pulse the chat button after 5 seconds to draw attention
    const [showPulse, setShowPulse] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowPulse(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || isLoading) return;

        const userMessage = { role: 'user', content: text };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Build conversation history for API (exclude welcome message)
            const apiMessages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...newMessages
                    .filter((m) => m.role !== 'system')
                    .map((m) => ({ role: m.role, content: m.content })),
            ];

            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: apiMessages,
                    temperature: 0.7,
                    max_tokens: 512,
                }),
            });

            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data = await res.json();
            const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Try again!";

            setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

            if (!isOpen) setHasUnread(true);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: '⚠️ Oops, something went wrong. Please try again in a moment.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen
                        ? 'bg-white/10 border border-white/20 backdrop-blur-md'
                        : 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500'
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X className="w-6 h-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                            <MessageCircle className="w-6 h-6 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Unread badge */}
                {hasUnread && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                )}

                {/* Pulse ring */}
                {showPulse && !isOpen && (
                    <span className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping pointer-events-none" />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)]"
                        style={{ backdropFilter: 'blur(24px)' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/10 border-b border-white/10 px-5 py-4 flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white text-sm font-semibold">Kartik's AI Assistant</h3>
                                <p className="text-green-400 text-xs">Online • Powered by Llama 3.3</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f0f0f]/95" style={{ maxHeight: '360px' }}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i === messages.length - 1 ? 0.1 : 0 }}
                                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === 'user'
                                                ? 'bg-orange-500/20 text-orange-400'
                                                : 'bg-white/10 text-gray-300'
                                            }`}
                                    >
                                        {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                    </div>

                                    {/* Bubble */}
                                    <div
                                        className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-orange-500 text-white rounded-br-md'
                                                : 'bg-white/5 text-gray-200 border border-white/5 rounded-bl-md'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2.5"
                                >
                                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-gray-300" />
                                    </div>
                                    <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="bg-[#141414] border-t border-white/10 p-3">
                            <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 focus-within:border-orange-500/40 transition-colors px-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about Kartik..."
                                    disabled={isLoading}
                                    className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-gray-500 outline-none disabled:opacity-50"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2 text-gray-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-600 text-center mt-2">
                                Powered by Groq • Llama 3.3 70B
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
