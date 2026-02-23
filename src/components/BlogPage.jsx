import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight, ArrowLeft, Tag, TrendingUp, Flame, Star, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import blogs from '../data/blogs.json';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop&q=80';
const POSTS_PER_PAGE = 6;

// ─── Main Blog Card (large, for main content area) ─────────────
const BlogCard = ({ blog, index, featured = false }) => (
    <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        className={`group bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-orange-500/20 transition-all duration-500 ${featured ? 'lg:col-span-2' : ''}`}
    >
        <Link to={`/blog/${blog.slug}`} className="block">
            {/* Image */}
            <div className={`relative overflow-hidden ${featured ? 'h-72 md:h-96' : 'h-56'}`}>
                <img
                    src={blog.image || FALLBACK_IMAGE}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent" />

                {/* Tag overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {blog.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-orange-400 border border-orange-500/20">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6 md:p-7">
                {/* Title */}
                <h2 className={`font-bold text-white mb-3 group-hover:text-orange-400 transition-colors leading-snug line-clamp-2 ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                    {blog.title}
                </h2>

                {/* Summary */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {blog.summary}
                </p>

                {/* Meta Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(blog.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                    </div>
                    <span className="text-orange-500 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Article <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </Link>
    </motion.article>
);

// ─── Sidebar: Small Post Item ───────────────────────────────────
const SidebarPost = ({ blog, meta }) => (
    <Link to={`/blog/${blog.slug}`} className="flex gap-3 group py-3 first:pt-0 last:pb-0 border-b border-white/5 last:border-0">
        <img
            src={blog.image || FALLBACK_IMAGE}
            alt={blog.title}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:ring-2 ring-orange-500/40 transition-all"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                {blog.title}
            </h4>
            <p className="text-[11px] text-gray-500 mt-1">{meta}</p>
        </div>
    </Link>
);

// ─── Sidebar Section Wrapper ────────────────────────────────────
const SidebarSection = ({ icon, title, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5"
    >
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
            <div className="text-orange-500">{icon}</div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">{title}</h3>
        </div>
        {children}
    </motion.div>
);

// ─── Main Blog Page Component ───────────────────────────────────
const BlogPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeCategory, setActiveCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(initialPage);

    // Compute categories with counts
    const categories = useMemo(() => {
        const map = {};
        blogs.forEach((b) => b.tags.forEach((t) => { map[t] = (map[t] || 0) + 1; }));
        return Object.entries(map).sort((a, b) => b[1] - a[1]);
    }, []);

    // All unique tags for trending
    const trendingTags = useMemo(() => {
        const all = new Set();
        blogs.forEach((b) => b.tags.forEach((t) => all.add(t)));
        return [...all].slice(0, 10);
    }, []);

    // Filter blogs
    const filteredBlogs = useMemo(() => {
        let result = [...blogs];

        if (activeCategory !== 'All') {
            result = result.filter((b) => b.tags.includes(activeCategory));
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (b) =>
                    b.title.toLowerCase().includes(q) ||
                    b.summary.toLowerCase().includes(q) ||
                    b.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        return result;
    }, [searchQuery, activeCategory]);

    // Pagination
    const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
    const paginatedBlogs = useMemo(() => {
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        return filteredBlogs.slice(start, start + POSTS_PER_PAGE);
    }, [filteredBlogs, currentPage]);

    const goToPage = (page) => {
        const p = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(p);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (p > 1) next.set('page', String(p));
            else next.delete('page');
            return next;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Featured = first post, latest = next 5 (by date)
    const latestPosts = useMemo(() => {
        return [...blogs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setCurrentPage(1);
        if (value.trim()) {
            setSearchParams({ q: value });
        } else {
            setSearchParams({});
        }
    };

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat);
        setSearchQuery('');
        setCurrentPage(1);
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-28 pb-20 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-orange-500/[0.03] rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">

                {/* Header */}
                <div className="mb-16">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Blog</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-lg">
                                Articles on web dev, cybersecurity, AI, and emerging tech.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search articles..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Category Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2.5 mt-8"
                    >
                        <button
                            onClick={() => handleCategoryClick('All')}
                            className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-300 ${activeCategory === 'All'
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-orange-500/30 hover:text-white'
                                }`}
                        >
                            All Posts
                        </button>
                        {categories.slice(0, 8).map(([cat]) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-orange-500/30 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Main Layout: Content + Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

                    {/* ─── Main Content ─────────────────────────── */}
                    <div>
                        {filteredBlogs.length > 0 ? (
                            <>
                                {/* Results info */}
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-gray-500 text-sm">
                                        {searchQuery.trim()
                                            ? `${filteredBlogs.length} result${filteredBlogs.length !== 1 ? 's' : ''} found`
                                            : `Showing ${(currentPage - 1) * POSTS_PER_PAGE + 1}–${Math.min(currentPage * POSTS_PER_PAGE, filteredBlogs.length)} of ${filteredBlogs.length} posts`
                                        }
                                    </p>
                                    {totalPages > 1 && (
                                        <p className="text-gray-500 text-sm">Page {currentPage} of {totalPages}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {paginatedBlogs.map((blog, index) => (
                                        <BlogCard
                                            key={`${blog.id}-${index}`}
                                            blog={blog}
                                            index={index}
                                            featured={index === 0 && currentPage === 1 && !searchQuery.trim()}
                                        />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12">
                                        {/* Previous */}
                                        <button
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 border-white/10 text-gray-400 hover:border-orange-500/30 hover:text-white"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        {/* Page numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center border text-sm font-semibold transition-all duration-300 ${page === currentPage
                                                    ? 'bg-orange-500 text-white border-orange-500'
                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-orange-500/30 hover:text-white'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        {/* Next */}
                                        <button
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 border-white/10 text-gray-400 hover:border-orange-500/30 hover:text-white"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
                                <p className="text-gray-400">Try adjusting your search or category filter.</p>
                            </motion.div>
                        )}
                    </div>

                    {/* ─── Sidebar ──────────────────────────────── */}
                    <aside className="space-y-6">

                        {/* Featured Posts */}
                        <SidebarSection icon={<Star className="w-4 h-4" />} title="Featured" delay={0.1}>
                            <div className="space-y-0">
                                {blogs.slice(0, 4).map((blog) => (
                                    <SidebarPost key={blog.id} blog={blog} meta={new Date(blog.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} />
                                ))}
                            </div>
                        </SidebarSection>

                        {/* Latest Posts */}
                        <SidebarSection icon={<Flame className="w-4 h-4" />} title="Latest" delay={0.2}>
                            <div className="space-y-0">
                                {latestPosts.map((blog) => (
                                    <SidebarPost
                                        key={blog.id}
                                        blog={blog}
                                        meta={new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    />
                                ))}
                            </div>
                        </SidebarSection>

                        {/* Categories */}
                        <SidebarSection icon={<Layers className="w-4 h-4" />} title="Categories" delay={0.3}>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                {categories.slice(0, 10).map(([cat, count]) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${activeCategory === cat
                                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                            : 'bg-white/[0.02] text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                            }`}
                                    >
                                        <span className="font-medium">{cat}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-gray-500'
                                            }`}>
                                            {count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </SidebarSection>

                        {/* Trending Tags */}
                        <SidebarSection icon={<TrendingUp className="w-4 h-4" />} title="Trending Tags" delay={0.4}>
                            <div className="flex flex-wrap gap-2">
                                {trendingTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleCategoryClick(tag)}
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-300 ${activeCategory === tag
                                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                            : 'bg-white/[0.03] text-gray-400 border-white/[0.06] hover:text-orange-400 hover:border-orange-500/20'
                                            }`}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </SidebarSection>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
