/**
 * Batch Blog Generator
 * 
 * Generates multiple blog posts at once from different news topics.
 * Usage: node scripts/batch-generate.js [count]
 * Default count: 10
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!NEWS_API_KEY || !GROQ_API_KEY) {
    console.error('❌ Missing required env vars: NEWS_API_KEY, GROQ_API_KEY');
    process.exit(1);
}

const TARGET_COUNT = parseInt(process.argv[2] || '10', 10);
const TOPICS = ['technology', 'science', 'business'];

function parseJSONSafe(str) {
    try { return JSON.parse(str); } catch (_) { }
    const cleaned = str.replace(/"((?:[^"\\]|\\.)*)"/g, (match, content) => {
        const escaped = content
            .replace(/(?<!\\)\n/g, '\\n')
            .replace(/(?<!\\)\r/g, '')
            .replace(/(?<!\\)\t/g, '\\t')
            .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
        return `"${escaped}"`;
    });
    return JSON.parse(cleaned);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch news from multiple categories
async function fetchAllNews() {
    console.log('📰 Fetching news from multiple topics...');
    const allArticles = [];

    for (const topic of TOPICS) {
        try {
            const url = `https://newsapi.org/v2/top-headlines?category=${topic}&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`;
            const res = await fetch(url);
            if (!res.ok) continue;
            const data = await res.json();
            if (data.articles?.length) {
                allArticles.push(...data.articles.map(a => ({
                    title: a.title,
                    description: a.description || 'No description available.',
                    source: a.source?.name || 'Unknown',
                    url: a.url,
                    image: a.urlToImage || null,
                    topic,
                })));
            }
        } catch (e) {
            console.warn(`⚠️ Failed to fetch ${topic}: ${e.message}`);
        }
    }

    // Deduplicate by title
    const seen = new Set();
    return allArticles.filter(a => {
        if (!a.title || a.title === '[Removed]' || seen.has(a.title)) return false;
        seen.add(a.title);
        return true;
    });
}

// Generate a single blog post via Groq
async function generatePost(articles, index) {
    const subset = articles.slice(index, index + 2); // Use 2 articles per post
    if (subset.length === 0) return null;

    const prompt = `You are a professional tech/science blogger. Based on these news items, write a blog post:

${subset.map((a, i) => `${i + 1}. "${a.title}" — ${a.description} (Source: ${a.source})`).join('\n')}

Requirements:
- Write in a professional but engaging tone
- Create a catchy, original title
- Write 300-500 words
- Include insights and analysis
- End with a key takeaway
- Output ONLY valid JSON (no markdown, no code blocks):
{"title": "Blog Post Title", "summary": "A 1-2 sentence summary", "tags": ["Tag1", "Tag2", "Tag3"], "content": "Full markdown blog post content with ## headings"}`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are a professional tech blogger. Always respond with ONLY valid JSON, no markdown code blocks.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.8,
            max_tokens: 2048,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Groq error: ${res.status} — ${err}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response');

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const post = parseJSONSafe(jsonMatch[0]);
    post._image = subset.find(a => a.image)?.image || null;
    return post;
}

// Save all posts to blogs.json
function saveAllPosts(posts) {
    const jsonPath = path.join(__dirname, '..', 'src', 'data', 'blogs.json');
    const blogDir = path.join(__dirname, '..', 'content', 'blog');
    fs.mkdirSync(blogDir, { recursive: true });

    const blogs = posts.map((post, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i); // Space out dates
        const dateStr = date.toISOString().split('T')[0];
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);

        // Save markdown
        const markdown = `---\ntitle: "${post.title}"\ndate: "${dateStr}"\ntags: [${post.tags.map(t => `"${t}"`).join(', ')}]\nsummary: "${post.summary}"\n---\n\n${post.content}\n`;
        fs.writeFileSync(path.join(blogDir, `${dateStr}-${slug}.md`), markdown, 'utf-8');

        return {
            id: i + 1,
            title: post.title,
            slug,
            summary: post.summary,
            date: dateStr,
            tags: post.tags,
            readTime: `${Math.ceil(post.content.split(/\s+/).length / 200)} min read`,
            image: post._image || `https://images.unsplash.com/photo-${['1518770660439-4636190af475', '1550751827-4bd374c3f58b', '1627398242454-45a1465c2479', '1633356122544-f134324a6cee', '1563986768609-322da13575f2', '1507721999472-8ed4421c4af2', '1526374965328-7f61d4dc18c5', '1555066931-4365d14bab8c', '1504639725590-34d0984388bd', '1517694712202-14dd9538aa97'][i % 10]}?w=600&h=340&fit=crop&q=80`,
            content: post.content,
        };
    });

    fs.writeFileSync(jsonPath, JSON.stringify(blogs, null, 2), 'utf-8');
    console.log(`\n✅ Saved ${blogs.length} posts to blogs.json`);
}

// Main
async function main() {
    try {
        const articles = await fetchAllNews();
        console.log(`📰 Found ${articles.length} unique articles across ${TOPICS.length} topics\n`);

        if (articles.length < 2) throw new Error('Not enough articles to generate posts');

        const posts = [];
        const maxPosts = Math.min(TARGET_COUNT, Math.floor(articles.length / 2));

        for (let i = 0; i < maxPosts; i++) {
            const articleIdx = (i * 2) % articles.length;
            try {
                console.log(`📝 Generating post ${i + 1}/${maxPosts}...`);
                const post = await generatePost(articles, articleIdx);
                if (post) {
                    posts.push(post);
                    console.log(`   ✅ "${post.title}"`);
                }
                // Small delay between API calls  
                if (i < maxPosts - 1) await sleep(2000);
            } catch (e) {
                console.warn(`   ⚠️ Post ${i + 1} failed: ${e.message}`);
            }
        }

        if (posts.length === 0) throw new Error('No posts generated');

        saveAllPosts(posts);
        console.log(`\n🎉 Generated ${posts.length} blog posts!`);
    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        process.exit(1);
    }
}

main();
