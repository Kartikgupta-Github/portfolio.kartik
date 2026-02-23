// --- Storage Keys ---
export const STORAGE_KEYS = {
    NEWSLETTER_SUBSCRIBERS: 'newsletter_subscribers',
    POPUP_COOLDOWN: 'lead_gen_popup_cooldown',
    LEADGEN_CLOSED_AT: 'leadgen_popup_closed_at',
};

// --- Cooldowns & Timing ---
export const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown for popups

// --- Validation Regex ---
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// --- Blog Generation Config ---
export const BLOG_CONFIG = {
    MAX_NEW_POSTS: 4,
    MAX_TOTAL_POSTS: 20,
    SIMILARITY_THRESHOLD: 0.55,
    STAGGER_MINUTES: 47,
};

// --- API Endpoints ---
export const API_ENDPOINTS = {
    NEWS_TOP_HEADLINES: 'https://newsapi.org/v2/top-headlines',
    GEMINI_GENERATE_CONTENT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent',
    GROQ_CHAT_COMPLETIONS: 'https://api.groq.com/openai/v1/chat/completions',
    EMAILJS_REST_SEND: 'https://api.emailjs.com/api/v1.0/email/send',
};
