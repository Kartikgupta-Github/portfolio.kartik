import { STORAGE_KEYS } from './constants';

// --- Newsletter & Subscriber Helpers ---

export const getSubscribers = () => {
    try {
        if (typeof window === 'undefined') return []; // For Node env
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWSLETTER_SUBSCRIBERS) || '[]');
    } catch {
        return [];
    }
};

export const addSubscriber = (email) => {
    const subs = getSubscribers();
    const normalized = email.toLowerCase().trim();
    if (!subs.includes(normalized)) {
        subs.push(normalized);
        localStorage.setItem(STORAGE_KEYS.NEWSLETTER_SUBSCRIBERS, JSON.stringify(subs));
    }
};

export const isAlreadySubscribed = (email) => {
    return getSubscribers().includes(email.toLowerCase().trim());
};

export const removeSubscriber = (email) => {
    const subs = getSubscribers().filter(e => e !== email.toLowerCase().trim());
    localStorage.setItem(STORAGE_KEYS.NEWSLETTER_SUBSCRIBERS, JSON.stringify(subs));
};

// --- Email Template Builders ---

export const buildConfirmationMessage = (email) => {
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀  WELCOME TO THE NEWSLETTER!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hey there! 👋

Thank you so much for subscribing! You're now part of a growing community of tech enthusiasts, developers, and innovators.

📬  WHAT YOU'LL GET
──────────────────────────────────────
  ✦  Latest articles on AI/ML, web development & cybersecurity
  ✦  Deep dives into emerging technologies and industry trends  
  ✦  Project showcases and behind-the-scenes engineering insights

🤝  MY PROMISE TO YOU
──────────────────────────────────────
I respect your inbox — expect only high-quality, hand-crafted content. No fluff, no spam, no selling your data. Ever.

🔗  EXPLORE MORE
──────────────────────────────────────
  🌐  Portfolio:  https://kartikgupta.vercel.app
  💼  LinkedIn:   https://linkedin.com/in/kartikgupta
  🐙  GitHub:     https://github.com/kartikgupta

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Sent with ❤️ by Kartik Gupta
  Full-Stack Developer • AI/ML Engineer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You received this because ${email} subscribed to the newsletter.
To unsubscribe, simply reply to this email with "UNSUBSCRIBE".
`.trim();
};

export const buildNewPostsEmail = (posts) => {
    const postList = posts.map(p =>
        `📝 ${p.title}\n   ${p.summary}\n   🔗 Read: https://kartikgupta.vercel.app/blog/${p.slug}`
    ).join('\n\n');

    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📰  NEW BLOG POSTS PUBLISHED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hey! 👋

I've just published ${posts.length} fresh blog post${posts.length > 1 ? 's' : ''} on my portfolio.

${postList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Visit: https://kartikgupta.vercel.app/blog
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Sent by Kartik Gupta
  Full-Stack Developer • AI/ML Engineer

To unsubscribe, reply with "UNSUBSCRIBE".
`.trim();
};

// --- Utility Helpers ---

export const parseJSONSafe = (str) => {
    try { return JSON.parse(str); } catch (_) { }
    const cleaned = str.replace(/"((?:[^"\\]|\\.)*)"/g, (match, content) => {
        const escaped = content
            .replace(/(?<!\\)\n/g, '\\n')
            .replace(/(?<!\\)\r/g, '')
            .replace(/(?<!\\)\t/g, '\\t')
            .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
        return `"${escaped}"`;
    });
    try { return JSON.parse(cleaned); } catch { return null; }
};

export const titleSimilarity = (a, b) => {
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const wordsA = normalize(a);
    const wordsB = normalize(b);
    if (!wordsA.length || !wordsB.length) return 0;
    const setB = new Set(wordsB);
    const overlap = wordsA.filter(w => setB.has(w)).length;
    return overlap / Math.max(wordsA.length, wordsB.length);
};
