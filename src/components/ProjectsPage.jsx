import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Layers, Sparkles, ChevronRight, CircleDot, Rocket, CheckCircle2, Clock, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import projects from '../data/projects.json';

// ── Status badge config ──────────────────────────────────────
const STATUS_CONFIG = {
    'Live': { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <Rocket className="w-3 h-3" />, dot: 'bg-emerald-400' },
    'Completed': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: <CheckCircle2 className="w-3 h-3" />, dot: 'bg-blue-400' },
    'Under Development': { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: <Clock className="w-3 h-3" />, dot: 'bg-amber-400' },
};

// ── Project Card ─────────────────────────────────────────────
const ProjectCard = ({ project, index }) => {
    const status = STATUS_CONFIG[project.status] || STATUS_CONFIG['Completed'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            layout
            className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/5"
        >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />

                {/* Status badge */}
                <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                        {project.status}
                    </span>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md text-gray-300 border border-white/10">
                        <Layers className="w-3 h-3 text-orange-400" />
                        {project.category}
                    </span>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                        {project.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-1">{project.tagline}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                </p>

                {/* Problem Solved */}
                <div className="bg-orange-500/[0.04] border border-orange-500/10 rounded-xl p-3.5">
                    <p className="text-xs font-semibold text-orange-400 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        Problem Solved
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{project.problem_solved}</p>
                </div>

                {/* Core Features */}
                <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Key Features</p>
                    <div className="flex flex-wrap gap-1.5">
                        {project.core_features.slice(0, 4).map((feature, i) => (
                            <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-400 bg-white/[0.03] px-2 py-1 rounded-md border border-white/[0.05]">
                                <CircleDot className="w-2.5 h-2.5 text-orange-500/60" />
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tech Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.map((tech, i) => (
                            <span
                                key={i}
                                className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-500/5 text-orange-400/80 border border-orange-500/10 font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Technical Highlights */}
                <div className="space-y-1.5 pt-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Technical Highlights</p>
                    <ul className="space-y-1">
                        {project.technical_highlights.map((hl, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                                <ChevronRight className="w-3 h-3 text-orange-500/50 mt-0.5 flex-shrink-0" />
                                {hl}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

// ── Projects Page ────────────────────────────────────────────
const ProjectsPage = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    // Build category filters
    const categories = useMemo(() => {
        const cats = new Map();
        cats.set('All', projects.length);
        projects.forEach(p => {
            cats.set(p.category, (cats.get(p.category) || 0) + 1);
        });
        return Array.from(cats.entries());
    }, []);

    // Build status filters
    const statuses = useMemo(() => {
        const st = new Map();
        projects.forEach(p => {
            st.set(p.status, (st.get(p.status) || 0) + 1);
        });
        return Array.from(st.entries());
    }, []);

    // Filter projects
    const filteredProjects = useMemo(() => {
        if (activeFilter === 'All') return projects;
        return projects.filter(p => p.category === activeFilter || p.status === activeFilter);
    }, [activeFilter]);

    // All filter options: categories + statuses
    const allFilters = useMemo(() => {
        const filters = [...categories];
        statuses.forEach(([status, count]) => {
            if (!filters.some(([name]) => name === status)) {
                filters.push([status, count]);
            }
        });
        return filters;
    }, [categories, statuses]);

    return (
        <section className="min-h-screen pt-28 pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors text-sm mb-6 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                            <Rocket className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Projects</span>
                            </h1>
                        </div>
                    </div>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        A curated collection of projects that showcase real-world problem solving, from AI-powered tools to full-stack platforms.
                    </p>
                </motion.div>

                {/* Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500 font-medium">Filter by</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {allFilters.map(([name, count]) => {
                            const isActive = activeFilter === name;
                            const isStatus = STATUS_CONFIG[name];

                            return (
                                <button
                                    key={name}
                                    onClick={() => setActiveFilter(name)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 ${isActive
                                            ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                                            : 'bg-white/[0.03] text-gray-400 border-white/[0.08] hover:border-orange-500/30 hover:text-white hover:bg-white/[0.05]'
                                        }`}
                                >
                                    {isStatus && (
                                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : STATUS_CONFIG[name].dot}`} />
                                    )}
                                    {name}
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Results info */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-500 text-sm">
                        Showing {filteredProjects.length} of {projects.length} projects
                    </p>
                </div>

                {/* Projects Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                <AnimatePresence>
                    {filteredProjects.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-24"
                        >
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                            <p className="text-gray-400">Try selecting a different filter.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default ProjectsPage;
