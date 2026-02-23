import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import blogs from '../data/blogs.json';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop&q=80';

const BlogCard = ({ blog, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.08] hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full"
    >
        <Link to={`/blog/${blog.slug}`} className="flex flex-col h-full">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={blog.image || FALLBACK_IMAGE}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
            </div>

            <div className="p-6 flex flex-col flex-grow">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {blog.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                    {blog.title}
                </h3>

                {/* Summary */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                    {blog.summary}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {blog.readTime}
                        </span>
                    </div>
                    <span className="text-orange-500 flex items-center gap-1 group-hover:gap-2 transition-all font-medium">
                        Read <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </Link>
    </motion.div>
);

const BlogPreview = () => {
    const latestBlogs = blogs.slice(0, 6);

    return (
        <section id="blog" className="py-24 relative overflow-hidden bg-[#0f0f0f]">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] -z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] -z-0 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 max-w-2xl mx-auto"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Latest <span className="text-orange-500">Blog</span> Posts
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Insights on web development, cybersecurity, and the latest in tech.
                    </p>
                </motion.div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {latestBlogs.map((blog, index) => (
                        <BlogCard key={blog.id} blog={blog} index={index} />
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Link
                        to="/blog"
                        className="relative inline-flex items-center gap-2 px-8 py-3 rounded-full border border-blue-500 text-blue-400 font-medium overflow-hidden group transition-all duration-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/20"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        <span className="relative z-10 flex items-center gap-2">
                            View All Posts
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default BlogPreview;
