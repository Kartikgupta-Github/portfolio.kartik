/**
 * Smart Blog Generator v3 (Final Refactored)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Consolidated Constants & Helpers
import { BLOG_CONFIG, API_ENDPOINTS } from '../src/constants.js';
import { parseJSONSafe, titleSimilarity, buildNewPostsEmail } from '../src/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Secrets - Environment Variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

if (!NEWS_API_KEY || (!GROQ_API_KEY && !GEMINI_API_KEY)) {
    console.error('❌ Missing mandatory API keys');
    process.exit(1);
}

// ── Helpers ──────────────────────────────────────────────────

function isDuplicate(title, existingTitles) {
    return existingTitles.some(existing => titleSimilarity(title, existing) > BLOG_CONFIG.SIMILARITY_THRESHOLD);
}

function loadBlogs() {
    const jsonPath = path.join(__dirname, '..', 'src', 'data', 'blogs.json');
    return fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) : [];
}

// ── NEWS FETCHING ───────────────────────────────────────────

async function fetchNews() {
    console.log('📰 Fetching news...');
    const categories = ['technology', 'science', 'business'];
    const allArticles = [];

    for (const category of categories) {
        try {
            const url = `${API_ENDPOINTS.NEWS_TOP_HEADLINES}?category=${category}&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;
            const res = await fetch(url);
            if (!res.ok) continue;
            const data = await res.json();
            allArticles.push(...(data.articles || []).filter(a => a.title && a.description && !a.title.includes('[Removed]')).map(a => ({
                title: a.title,
                description: a.description,
                source: a.source?.name || 'Unknown',
                url: a.url,
                image: a.urlToImage || null,
                category,
            })));
        } catch (err) { console.warn(`⚠️ Failed to fetch ${category}`); }
    }

    const seen = new Set();
    return allArticles.filter(a => !seen.has(a.title) && seen.add(a.title));
}

// ── LLM CURATION ─────────────────────────────────────────────

async function curateArticles(articles, existingTitles) {
    console.log('🧠 Curation phase...');
    const prompt = `Select the TOP 2-4 stories for developers. 
    Topics already covered: ${existingTitles.slice(0, 5).join(', ')}
    Headlines:
    ${articles.map((a, i) => `${i + 1}. "${a.title}"`).join('\n')}
    Respond with ONLY a JSON array of the headline numbers, e.g.: [2, 5]`;

    if (GEMINI_API_KEY) {
        const res = await fetch(`${API_ENDPOINTS.GEMINI_GENERATE_CONTENT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 256 },
            }),
        });
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const match = text?.match(/\[[\d\s,]*\]/);
        if (!match) return articles.slice(0, 2);
        const indices = JSON.parse(match[0]);
        return indices.filter(i => i >= 1 && i <= articles.length).map(i => articles[i - 1]);
    }
    return articles.slice(0, 2);
}

// ── POST GENERATION ──────────────────────────────────────────

async function generateSinglePost(article) {
    const prompt = `Write a 600-900 word blog post for: "${article.title}"
    Description: ${article.description}
    Use Sections: Hook (No heading), ## 🔍 What Happened?, ## ⚡ Why This Matters, ## 🛡️ Key Takeaways, ## 🔮 Looking Ahead, ## ❓ FAQ.
    Output ONLY valid JSON: { "title": "...", "summary": "...", "tags": ["AI", "..."], "content": "..." }`;

    if (GEMINI_API_KEY) {
        const res = await fetch(`${API_ENDPOINTS.GEMINI_GENERATE_CONTENT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
            }),
        });
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return parseJSONSafe(jsonMatch[0]);
    }
}

// ── SAVING ───────────────────────────────────────────────────

function savePosts(newPosts, existingBlogs) {
    const jsonPath = path.join(__dirname, '..', 'src', 'data', 'blogs.json');
    const blogDir = path.join(__dirname, '..', 'content', 'blog');
    fs.mkdirSync(blogDir, { recursive: true });

    let added = 0;
    for (const { post, article } of newPosts) {
        if (isDuplicate(post.title, existingBlogs.map(b => b.title))) continue;

        const now = new Date();
        now.setMinutes(now.getMinutes() - (added * BLOG_CONFIG.STAGGER_MINUTES));
        const isoDate = now.toISOString();
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);

        const markdown = `---\ntitle: "${post.title}"\ndate: "${isoDate}"\ntags: [${post.tags.map(t => `"${t}"`).join(', ')}]\nsummary: "${post.summary}"\n---\n\n${post.content}\n`;
        fs.writeFileSync(path.join(blogDir, `${isoDate.split('T')[0]}-${slug}.md`), markdown);

        existingBlogs.unshift({
            id: Date.now() + added,
            title: post.title,
            slug,
            summary: post.summary,
            date: isoDate,
            tags: post.tags,
            readTime: `${Math.ceil(post.content.split(/\s+/).length / 200)} min read`,
            image: article.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop&q=80',
            content: post.content,
        });
        added++;
    }

    if (existingBlogs.length > BLOG_CONFIG.MAX_TOTAL_POSTS) existingBlogs.splice(BLOG_CONFIG.MAX_TOTAL_POSTS);
    fs.writeFileSync(jsonPath, JSON.stringify(existingBlogs, null, 2));
    return added;
}

// ── NOTIFICATIONS ──────────────────────────────────────────

async function notifySubscribers(publishedPosts) {
    if (!EMAILJS_SERVICE_ID || !publishedPosts.length) return;
    const subsPath = path.join(__dirname, '..', 'src', 'data', 'subscribers.json');
    if (!fs.existsSync(subsPath)) return;

    const subscribers = JSON.parse(fs.readFileSync(subsPath, 'utf-8'));
    const emailBody = buildNewPostsEmail(publishedPosts);

    for (const email of subscribers) {
        try {
            await fetch(API_ENDPOINTS.EMAILJS_REST_SEND, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: EMAILJS_SERVICE_ID,
                    template_id: EMAILJS_TEMPLATE_ID,
                    user_id: EMAILJS_PUBLIC_KEY,
                    template_params: {
                        from_name: 'Kartik Gupta',
                        from_email: email,
                        to_email: email,
                        subject: `📰 New Posts: ${publishedPosts[0].title}`,
                        message: emailBody,
                    },
                }),
            });
        } catch (err) { console.error(`Failed: ${email}`); }
    }
}

// ── MAIN ─────────────────────────────────────────────────────

async function main() {
    console.log('🤖 Pipeline v3 starting...');
    try {
        const existingBlogs = loadBlogs();
        const allArticles = await fetchNews();
        const freshArticles = allArticles.filter(a => !isDuplicate(a.title, existingBlogs.map(b => b.title)));
        const curated = await curateArticles(freshArticles, existingBlogs.map(b => b.title));

        const generated = [];
        for (const article of curated) {
            const post = await generateSinglePost(article);
            if (post) {
                generated.push({ post, article });
                console.log(`✅ Generated: ${post.title}`);
            }
        }

        if (generated.length) {
            const added = savePosts(generated, existingBlogs);
            if (added > 0) await notifySubscribers(existingBlogs.slice(0, added));
        }
    } catch (err) { console.error('❌ Failed:', err); }
}

main();
