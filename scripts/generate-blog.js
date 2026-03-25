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
    const categories = ['technology'];
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

    const BLOCKED_KEYWORDS = ['perfume', 'beauty', 'fashion', 'celebrity', 'makeup',
        'skincare', 'fragrance', 'sports', 'football', 'cricket', 'movie', 'film',
        'music', 'album', 'recipe', 'food', 'travel', 'lifestyle', 'xbox game pass titles',
        'new games', 'gaming deals'];

    const filtered = allArticles.filter(a => {
        const text = (a.title + ' ' + a.description).toLowerCase();
        return !BLOCKED_KEYWORDS.some(kw => text.includes(kw));
    });

    const seen = new Set();
    return filtered.filter(a => !seen.has(a.title) && seen.add(a.title));
}

// ── LLM CURATION ─────────────────────────────────────────────

async function curateArticles(articles, existingTitles) {
    console.log('🧠 Curation phase...');
    const prompt = `You are a strict technical content curator for a developer portfolio blog.
Your job is to ONLY select stories that a software developer would find professionally relevant.

ONLY select articles about:
- Cybersecurity: breaches, CVEs, zero-days, malware, data leaks
- Cloud/DevOps: AWS, Azure, GCP outages, Kubernetes, Docker updates
- Developer tools: new frameworks, GitHub features, VS Code, CI/CD
- AI/ML for developers: new models, APIs, tools like OpenAI, Anthropic, Hugging Face
- Web/backend tech: Node.js, React, databases, APIs, browser updates
- Big Tech infrastructure: platform outages affecting developers

REJECT anything about: games, gaming, entertainment, beauty, fashion,
sports, food, travel, celebrity news, consumer product reviews.

If NO articles meet the criteria, return an empty array [].

Already covered: ${existingTitles.slice(0, 5).join(', ')}
Headlines:
${articles.map((a, i) => `${i + 1}. [${a.category}] "${a.title}"`).join('\n')}

Respond with ONLY a JSON array of numbers. If nothing qualifies return []. Example: [2, 5]`;

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
                temperature: 0.3,
                max_tokens: 256,
            }),
        });
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        const match = text?.match(/\[[\d\s,]*\]/);
        if (!match) return [];
        const indices = JSON.parse(match[0]);
        return indices.filter(i => i >= 1 && i <= articles.length).map(i => articles[i - 1]);
    } catch (err) {
        console.warn('⚠️ Curation failed.', err.message);
        return [];
    }
}

// ── POST GENERATION ──────────────────────────────────────────

async function generateSinglePost(article) {
    const prompt = `You are a technical blogger writing for software developers.
Write a 800-1200 word blog post about: "${article.title}"
Context: ${article.description}

IMPORTANT RULES:
- This must be genuinely useful to a developer, not a generic rewrite of the news
- Do NOT use a fixed template with the same sections every time
- Choose the section structure that best fits THIS specific article
- Use a mix of: narrative paragraphs, code context where relevant, bullet points, numbered steps — whatever fits naturally
- Write with a direct, opinionated developer voice — not corporate or neutral
- The title must be rewritten to be specific and developer-focused, not just the original headline

Available section types to pick from based on what fits the article
(do NOT use all of them, pick 3-5 that make sense for this topic):
- A strong hook paragraph (always include, no heading)
- ## What Actually Happened (for news/incidents)
- ## Why Developers Should Care
- ## Technical Breakdown (for CVEs, outages, architecture topics)
- ## What This Means for Your Stack
- ## Action Steps (only if there are real specific actions to take)
- ## The Bigger Picture
- ## Quick FAQ (only 2-3 questions, only if genuinely useful)

Output ONLY valid JSON with no markdown formatting outside the content field:
{
  "title": "rewritten developer-focused title",
  "summary": "2 sentence summary",
  "category": "Security|Coding|Technology|AI|DevOps|News",
  "tags": ["tag1", "tag2"],
  "content": "full markdown content here"
}`;

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
        const finalSlug = slug.length > 60
            ? trimmed.substring(0, trimmed.lastIndexOf('-'))
            : trimmed;

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

        if (!curated || curated.length === 0) {
            console.log('⚠️ No relevant developer articles found today. Skipping post generation.');
            return;
        }

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
