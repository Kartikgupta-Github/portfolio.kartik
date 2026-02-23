import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Layers, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import projects from '../data/projects.json';

const STATUS_CONFIG = {
    'Live': { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
    'Completed': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
    'Under Development': { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
};

// Show first 2 featured projects
const featured = projects.slice(0, 2);

const ProjectPreviewCard = ({ project, index }) => {
    const status = STATUS_CONFIG[project.status] || STATUS_CONFIG['Completed'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/5"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />

                {/* Status */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                        {project.status}
                    </span>
                </div>

                {/* Category */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md text-gray-300 border border-white/10">
                        <Layers className="w-3 h-3 text-orange-400" />
                        {project.category}
                    </span>
                </div>

                {/* Title */}
                <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">{project.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-1">{project.tagline}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.slice(0, 5).map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400/80 border border-orange-500/10 font-medium">
                            {tech}
                        </span>
                    ))}
                    {project.tech_stack.length > 5 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500 font-medium">
                            +{project.tech_stack.length - 5}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const ProjectsPreview = () => {
    return (
        <section id="projects" className="py-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                            <Rocket className="w-4 h-4 text-orange-400" />
                        </div>
                        <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider">Portfolio</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Projects</span>
                    </h2>
                    <p className="text-gray-400 mt-2 max-w-lg mx-auto">Real-world solutions built with modern tech stacks and clean architecture.</p>
                </motion.div>

                {/* Project Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featured.map((project, index) => (
                        <ProjectPreviewCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                {/* View All Button — centered below cards */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <Link
                        to="/projects"
                        className="relative inline-flex items-center gap-2 px-8 py-3 rounded-full border border-blue-500 text-blue-400 font-medium overflow-hidden group transition-all duration-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/20"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        <span className="relative z-10 flex items-center gap-2">
                            View All Projects
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ProjectsPreview;
