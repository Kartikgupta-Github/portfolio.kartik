/**
 * Fill remaining blog slots with topic-based posts
 * Usage: node scripts/fill-blogs.js
 */
import fs from 'fs';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) { console.error('Missing GROQ_API_KEY'); process.exit(1); }

function parseJSONSafe(str) {
    try { return JSON.parse(str); } catch (_) { }
    const cleaned = str.replace(/"((?:[^"\\]|\\.)*)"/g, (m, c) => {
        return '"' + c.replace(/\n/g, '\\n').replace(/\r/g, '').replace(/\t/g, '\\t') + '"';
    });
    return JSON.parse(cleaned);
}

const topics = [
    'Write about the future of quantum computing and its impact on cybersecurity in 2025',
    'Write about how developers can build more accessible web applications using modern tools and WCAG guidelines',
    'Write about the rise of edge computing and why it matters for IoT and real-time applications'
];

const images = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=340&fit=crop&q=80'
];

async function main() {
    const blogs = JSON.parse(fs.readFileSync('src/data/blogs.json', 'utf-8'));
    console.log(`Currently ${blogs.length} posts. Adding 3 more...\n`);

    for (let i = 0; i < topics.length; i++) {
        console.log(`📝 Generating post ${i + 1}/3...`);

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a professional tech blogger. Respond with ONLY valid JSON, no markdown code blocks.' },
                    { role: 'user', content: `${topics[i]}. Output ONLY valid JSON: {"title": "...", "summary": "1-2 sentence summary", "tags": ["Tag1", "Tag2", "Tag3"], "content": "Full markdown blog post 400-500 words with ## headings and a key takeaway at the end"}` }
                ],
                temperature: 0.8,
                max_tokens: 2048,
            }),
        });

        if (!res.ok) {
            console.warn(`   ⚠️ Failed: ${res.status}`);
            continue;
        }

        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) { console.warn('   ⚠️ No JSON found'); continue; }

        const post = parseJSONSafe(jsonMatch[0]);

        const date = new Date();
        date.setDate(date.getDate() - (blogs.length + i));
        const dateStr = date.toISOString().split('T')[0];
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);

        blogs.push({
            id: blogs.length + 1,
            title: post.title,
            slug,
            summary: post.summary,
            date: dateStr,
            tags: post.tags,
            readTime: `${Math.ceil(post.content.split(/\s+/).length / 200)} min read`,
            image: images[i],
            content: post.content,
        });

        console.log(`   ✅ "${post.title}"`);
        if (i < 2) await new Promise(r => setTimeout(r, 2000));
    }

    fs.writeFileSync('src/data/blogs.json', JSON.stringify(blogs, null, 2), 'utf-8');
    console.log(`\n🎉 Total posts: ${blogs.length}`);
}

main();
