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

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

if (!NEWS_API_KEY || !GROQ_API_KEY) {
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
    const prompt = `You are curating tech news for a developer audience. Select TOP 2-4 stories.
Prioritize in this order:
1. Security breaches, zero-days, data leaks
2. Major platform outages (GitHub, AWS, Google, etc.)
3. Developer tools, AI updates, new frameworks
4. Avoid: entertainment, politics, sports, celebrity news

Already covered topics: ${existingTitles.slice(0, 5).join(', ')}
Headlines:
${articles.map((a, i) => `${i + 1}. "${a.title}"`).join('\n')}
Respond with ONLY a JSON array of numbers e.g.: [2, 5]`;

    try {
        const res = await fetch(API_ENDPOINTS.GROQ_CHAT_COMPLETIONS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 256,
            }),
        });
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        const match = text?.match(/\[[\d\s,]*\]/);
        if (!match) return articles.slice(0, 2);
        const indices = JSON.parse(match[0]);
        return indices.filter(i => i >= 1 && i <= articles.length).map(i => articles[i - 1]);
    } catch (err) {
        console.warn('⚠️ Curation failed, using first 2 articles.', err.message);
        return articles.slice(0, 2);
    }
}

// ── POST GENERATION ──────────────────────────────────────────

async function generateSinglePost(article) {
    const prompt = `Write a 800-1200 word blog post for: "${article.title}"
Description: ${article.description}

TL;DR: One sentence summary at the very top.

Sections:
- Hook (no heading) - grab attention immediately
- ## 🔍 What Happened?
- ## ⚡ Why This Matters for Developers
- ## 👨‍💻 Developer Perspective (how this affects your code, stack, or workflow)
- ## ✅ Action Steps (numbered list, specific and actionable)
- ## 🔮 Looking Ahead
- ## ❓ FAQ (exactly 3 questions specific to this article, not generic)

Output ONLY valid JSON:
{ "title": "...", "summary": "...", "category": "Security|Coding|Technology|AI|DevOps|News", "tags": ["..."], "content": "..." }`;

    try {
        const res = await fetch(API_ENDPOINTS.GROQ_CHAT_COMPLETIONS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 4096,
            }),
        });
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;

        if (text) {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) return parseJSONSafe(jsonMatch[0]);
        } else {
            console.error("⚠️ Groq returned no text.", data);
        }
    } catch (err) {
        console.error("⚠️ Groq request failed.", err.message);
    }

    return null;
}

// ── SAVING ───────────────────────────────────────────────────

function savePosts(newPosts, existingBlogs) {
    const jsonPath = path.join(__dirname, '..', 'src', 'data', 'blogs.json');
    const blogDir = path.join(__dirname, '..', 'content', 'blog');
    fs.mkdirSync(blogDir, { recursive: true });

    const categoryImages = {
        Security: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=340&fit=crop&q=80',
        AI: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=340&fit=crop&q=80',
        Coding: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=340&fit=crop&q=80',
        DevOps: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=340&fit=crop&q=80',
        Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop&q=80',
        News: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=340&fit=crop&q=80',
    };

    let added = 0;
    for (const { post, article } of newPosts) {
        if (isDuplicate(post.title, existingBlogs.map(b => b.title))) continue;

        const now = new Date();
        now.setMinutes(now.getMinutes() - (added * BLOG_CONFIG.STAGGER_MINUTES));
        const isoDate = now.toISOString();
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const trimmed = slug.substring(0, 60);
        const finalSlug = trimmed.endsWith('-') ? trimmed.slice(0, -1) : (slug.length > 60 ? trimmed.substring(0, trimmed.lastIndexOf('-')) : trimmed);

        const markdown = `---\ntitle: "${post.title}"\ndate: "${isoDate}"\ntags: [${post.tags.map(t => `"${t}"`).join(', ')}]\nsummary: "${post.summary}"\n---\n\n${post.content}\n`;
        fs.writeFileSync(path.join(blogDir, `${isoDate.split('T')[0]}-${finalSlug}.md`), markdown);

        existingBlogs.unshift({
            id: Date.now() + added,
            title: post.title,
            slug: finalSlug,
            summary: post.summary,
            category: post.category || 'Technology',
            date: isoDate,
            tags: post.tags,
            readTime: `${Math.ceil(post.content.split(/\s+/).length / 200)} min read`,
            image: article.image || categoryImages[post.category] || categoryImages.Technology,
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
