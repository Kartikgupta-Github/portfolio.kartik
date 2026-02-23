import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket } from 'lucide-react';

// Consolidated Constants
import { STORAGE_KEYS, COOLDOWN_MS } from '../constants';

const LeadGenPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Check if cooldown has expired
    const isCooldownExpired = useCallback(() => {
        const closedAt = localStorage.getItem(STORAGE_KEYS.POPUP_COOLDOWN);
        if (!closedAt) return true; // Never shown
        return Date.now() - parseInt(closedAt, 10) >= COOLDOWN_MS;
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        localStorage.setItem(STORAGE_KEYS.POPUP_COOLDOWN, Date.now().toString());
    }, []);

    const handleContact = useCallback(() => {
        handleClose();
        setTimeout(() => {
            const el = document.getElementById('contact');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }, [handleClose]);

    // Show popup on every page visit if cooldown expired
    useEffect(() => {
        if (isCooldownExpired()) {
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [isCooldownExpired]);

    // Listen for logo click (custom event dispatched from Navbar)
    useEffect(() => {
        const handleLogoClick = () => {
            if (isCooldownExpired()) {
                setIsOpen(true);
            }
        };

        window.addEventListener('logo-click', handleLogoClick);
        return () => window.removeEventListener('logo-click', handleLogoClick);
    }, [isCooldownExpired]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 40 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                    >
                        <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-white/10 rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl shadow-orange-500/10">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Icon */}
                            <motion.div
                                initial={{ rotate: -15 }}
                                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                                transition={{ duration: 1.5, delay: 0.3 }}
                                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6"
                            >
                                <Rocket className="w-7 h-7 text-orange-500" />
                            </motion.div>

                            {/* Content */}
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                                Need a high-performance website or app?
                            </h3>
                            <p className="text-xl text-orange-400 font-semibold mb-4">
                                Let's build it together.
                            </p>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                From sleek portfolios to full-stack apps — I bring ideas to life with clean code and modern design.
                            </p>

                            {/* CTA Button */}
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleContact}
                                className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                            >
                                <i className="ri-mail-send-line text-lg"></i>
                                Contact Us
                            </motion.button>

                            {/* Subtle note */}
                            <p className="text-gray-600 text-xs text-center mt-4">
                                No commitment • Free initial consultation
                            </p>

                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LeadGenPopup;
