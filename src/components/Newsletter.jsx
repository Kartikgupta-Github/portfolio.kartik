import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Loader2, CheckCircle, X, AlertCircle, UserCheck } from 'lucide-react';
import emailjs from '@emailjs/browser';

// Consolidated Constants & Helpers
import { EMAIL_REGEX } from '../constants.js';
import {
  getSubscribers,
  addSubscriber,
  isAlreadySubscribed,
  removeSubscriber,
  buildConfirmationMessage
} from '../helpers.js';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [unsubEmail, setUnsubEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [unsubLoading, setUnsubLoading] = useState(false);
  const [showUnsub, setShowUnsub] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '', icon: null });

  // Environment Variables for EmailJS
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const showToast = (type, message, icon = null) => {
    setToast({ show: true, type, message, icon });
    setTimeout(() => setToast({ show: false, type: '', message: '', icon: null }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) return;

    if (!EMAIL_REGEX.test(trimmed)) {
      showToast('warning', 'Please enter a valid email address.', 'warning');
      return;
    }

    if (isAlreadySubscribed(trimmed)) {
      showToast('info', 'You\'re already subscribed! 🎉 Stay tuned for upcoming posts.', 'info');
      setEmail('');
      return;
    }

    setLoading(true);
    try {
      // 1. Notify Kartik about new subscriber
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: 'Newsletter Subscriber',
          from_email: trimmed,
          subject: '📬 New Newsletter Subscription',
          message: `New subscriber: ${trimmed}\n\nTotal subscribers on this device: ${getSubscribers().length + 1}`,
        },
        PUBLIC_KEY
      );

      // 2. Send confirmation email to subscriber
      try {
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            from_name: 'Kartik Gupta',
            from_email: trimmed,
            to_email: trimmed,
            subject: '🚀 Welcome to Kartik\'s Tech Newsletter!',
            message: buildConfirmationMessage(trimmed),
          },
          PUBLIC_KEY
        );
      } catch (confirmErr) {
        console.warn('Confirmation email failed:', confirmErr);
      }

      // 3. Save to localStorage
      addSubscriber(trimmed);

      showToast('success', 'Successfully subscribed! Check your inbox for a welcome email 🎉', 'success');
      setEmail('');
    } catch (error) {
      console.error('Newsletter Error:', error);
      showToast('error', 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    const trimmed = unsubEmail.trim();
    if (!trimmed) return;

    if (!EMAIL_REGEX.test(trimmed)) {
      showToast('warning', 'Please enter a valid email address.', 'warning');
      return;
    }

    if (!isAlreadySubscribed(trimmed)) {
      showToast('info', 'This email is not subscribed.', 'info');
      return;
    }

    setUnsubLoading(true);
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: 'Newsletter Unsubscribe',
          from_email: trimmed,
          subject: '🔕 Newsletter Unsubscription',
          message: `Unsubscribed: ${trimmed}`,
        },
        PUBLIC_KEY
      );
    } catch (_) { /* don't block locally */ }

    removeSubscriber(trimmed);
    showToast('success', 'You\'ve been unsubscribed. We\'re sorry to see you go! 😢', 'success');
    setUnsubEmail('');
    setShowUnsub(false);
    setUnsubLoading(false);
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success': return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'error': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'info': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default: return 'bg-white/10 border-white/20 text-white';
    }
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
      case 'error': return <X className="w-5 h-5 flex-shrink-0" />;
      case 'warning': return <AlertCircle className="w-5 h-5 flex-shrink-0" />;
      case 'info': return <UserCheck className="w-5 h-5 flex-shrink-0" />;
      default: return null;
    }
  };

  return (
    <section id="newsletter" className="py-24 relative overflow-hidden bg-[#0f0f0f]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.03] to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-8"
          >
            <Mail className="w-7 h-7 text-orange-500" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Join My <span className="text-orange-500">Newsletter</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Get the latest articles on web dev, cybersecurity, and tech delivered straight to your inbox. No spam, ever.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all text-sm"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="bg-orange-500 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Subscribe <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-gray-600 text-xs mt-4">
            By subscribing, you agree to receive occasional emails.
            <button
              type="button"
              onClick={() => setShowUnsub(!showUnsub)}
              className="text-gray-500 hover:text-orange-400 underline underline-offset-2 ml-1 transition-colors"
            >
              {showUnsub ? 'Cancel' : 'Want to unsubscribe?'}
            </button>
          </p>

          <AnimatePresence>
            {showUnsub && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl max-w-lg mx-auto">
                  <p className="text-gray-400 text-sm mb-3">Enter your email to unsubscribe</p>
                  <form onSubmit={handleUnsubscribe} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="email"
                        required
                        value={unsubEmail}
                        onChange={(e) => setUnsubEmail(e.target.value)}
                        placeholder="Your subscribed email"
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={unsubLoading}
                      className="px-5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      {unsubLoading ? 'Processing...' : 'Unsubscribe'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md border ${getToastStyles()}`}
          >
            {getToastIcon()}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Newsletter;
