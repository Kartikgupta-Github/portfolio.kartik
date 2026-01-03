import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Send, Loader2, Youtube, Instagram, Github } from 'lucide-react';
import emailjs from '@emailjs/browser';

const ContactItem = ({ icon, label, value, href }) => (
    <motion.a
        href={href}
        whileHover={{ x: 5 }}
        className={`flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors ${!href && 'cursor-default'}`}
    >
        <div className="bg-orange-500/10 p-3 rounded-lg text-orange-500">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-white font-medium">{value}</p>
        </div>
    </motion.a>
);

const SocialLink = ({ icon, href }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        className="p-3 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all shadow-lg hover:shadow-orange-500/25"
    >
        {icon}
    </motion.a>
);

const Contact = () => {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        // EmailJS Integration
        const SERVICE_ID = 'service_u0gna85';
        const TEMPLATE_ID = 'template_v8rg6h6';
        const PUBLIC_KEY = 'q6Mts3JYDz7cL37ym';

        try {
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    mobile: formData.mobile,
                    subject: formData.subject,
                    message: formData.message,
                },
                PUBLIC_KEY
            );

            setStatus({ type: 'success', message: 'Message sent successfully! I will get back to you soon.' });
            setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
        } finally {
            setLoading(false);
            // Clear status after 5 seconds
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        }
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden bg-[#0f0f0f]">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 max-w-2xl mx-auto"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Let's <span className="text-orange-500">Connect</span></h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        I'm currently available for freelance projects and new opportunities.
                        Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                    {/* Left Side: Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:flex relative justify-center items-center"
                    >
                        {/* Enhanced Ambient Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />

                        <motion.img
                            src="/contact-new-3d.png"
                            alt="Contact Illustration"
                            loading="lazy"
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 1, -1, 0]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            // Masking to blend edges + Mix-blend-mode to help integration
                            className="w-full max-w-md h-auto object-contain drop-shadow-2xl [mask-image:radial-gradient(circle_at_center,black_60%,transparent_100%)] z-10"
                        />
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl relative"
                    >
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600 focus:ring-1 focus:ring-orange-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600 focus:ring-1 focus:ring-orange-500/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="+91 00000 00000"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600 focus:ring-1 focus:ring-orange-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Project Inquiry"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600 focus:ring-1 focus:ring-orange-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600 focus:ring-1 focus:ring-orange-500/50 resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            {status.message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                                >
                                    {status.message}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message <Send className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Footer with Social Icons */}
            <div className="relative z-10 mt-20 border-t border-white/5 pt-10 pb-8 text-center">
                <div className="flex justify-center gap-6 mb-8">
                    <SocialLink href="https://www.linkedin.com/in/kartik-gupta30" icon={<Linkedin className="w-5 h-5" />} />
                    <SocialLink href="https://github.com" icon={<Github className="w-5 h-5" />} />
                    <SocialLink href="https://instagram.com" icon={<Instagram className="w-5 h-5" />} />
                    <SocialLink href="https://youtube.com" icon={<Youtube className="w-5 h-5" />} />
                </div>
                <div className="text-gray-600 text-sm">
                    © 2025 Kartik Gupta. All rights reserved.
                </div>
            </div>
        </section>
    );
};

export default Contact;
