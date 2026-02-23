import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag, User } from 'lucide-react';
import blogs from '../data/blogs.json';

const BlogPost = () => {
    const { slug } = useParams();
    const blog = blogs.find((b) => b.slug === slug);

    if (!blog) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="text-2xl font-bold text-white mb-3">Post Not Found</h2>
                    <p className="text-gray-400 mb-6">The blog post you're looking for doesn't exist.</p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const FALLBACK_IMAGE = `https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop&q=80`;

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-28 pb-20 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-3xl">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 rounded-2xl overflow-hidden border border-white/10"
                >
                    <img
                        src={blog.image || FALLBACK_IMAGE}
                        alt={blog.title}
                        className="w-full h-[300px] md:h-[400px] object-cover"
                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />
                </motion.div>

                {/* Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap gap-2 mb-5"
                >
                    {blog.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs font-medium px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20"
                        >
                            <Tag className="w-3 h-3 inline mr-1" />
                            {tag}
                        </span>
                    ))}
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
                >
                    {blog.title}
                </motion.h1>

                {/* Meta Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-10 pb-8 border-b border-white/10"
                >
                    <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        Kartik Gupta
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {blog.readTime}
                    </span>
                </motion.div>

                {/* Content */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="prose prose-invert prose-orange max-w-none
                        prose-headings:text-white prose-headings:font-bold
                        prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-[16px]
                        prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white
                        prose-li:text-gray-300
                        prose-blockquote:border-orange-500 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4"
                >
                    {blog.content.split('\n').map((paragraph, i) => {
                        if (!paragraph.trim()) return null;
                        if (paragraph.startsWith('## ')) {
                            return <h2 key={i} className="text-2xl mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                        }
                        if (paragraph.startsWith('### ')) {
                            return <h3 key={i} className="text-xl mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                        }
                        if (paragraph.startsWith('- ')) {
                            return <li key={i} className="ml-4">{paragraph.replace('- ', '')}</li>;
                        }
                        if (paragraph.startsWith('> ')) {
                            return <blockquote key={i}><p>{paragraph.replace('> ', '')}</p></blockquote>;
                        }
                        return <p key={i}>{paragraph}</p>;
                    })}
                </motion.article>

                {/* Bottom Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center"
                >
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        All Posts
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default BlogPost;
