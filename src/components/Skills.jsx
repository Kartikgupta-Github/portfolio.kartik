import React from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Wrench, Brain, Database, Layout } from 'lucide-react';

const skillCategories = [
    {
        title: "AI & Machine Learning",
        icon: <Brain className="w-6 h-6 text-orange-500" />,
        highlight: true,
        skills: ["Python", "Machine Learning", "Data Analysis", "TensorFlow", "Pandas", "NumPy"]
    },
    {
        title: "Frontend",
        icon: <Layout className="w-6 h-6 text-orange-500" />,
        skills: ["React", "Tailwind CSS", "HTML5", "CSS3", "JavaScript", "Framer Motion", "Bootstrap"]
    },
    {
        title: "Backend",
        icon: <Server className="w-6 h-6 text-orange-500" />,
        skills: ["PHP", "Laravel", "Node.js", "RestFul API", "MVC Architecture"]
    },
    {
        title: "Tools & DevOps",
        icon: <Wrench className="w-6 h-6 text-orange-500" />,
        skills: ["Git", "GitHub", "Jira", "Slack", "VS Code", "Postman"]
    },
    {
        title: "Databases",
        icon: <Database className="w-6 h-6 text-orange-500" />,
        skills: ["SQL", "MySQL", "MongoDB"]
    }
];

const SkillBadge = ({ name, highlight }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
            px-4 py-2 rounded-full text-sm font-medium cursor-default transition-all duration-300
            border border-white/10 backdrop-blur-sm
            ${highlight
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:shadow-[0_0_15px_rgba(252,83,10,0.4)]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'
            }
        `}
    >
        {name}
    </motion.div>
);

const Skills = () => {
    return (
        <section id="skills" className="py-24 relative overflow-hidden bg-[#0f0f0f]">
            {/* Background Decorations */}
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-20 h-1 bg-gradient-to-r from-transparent to-orange-500 rounded-full"></div>
                        <span className="text-orange-500 font-medium tracking-widest uppercase text-sm">Tech Stack</span>
                        <div className="w-20 h-1 bg-gradient-to-l from-transparent to-orange-500 rounded-full"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Technologies I <span className="text-orange-500">Master</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        A comprehensive ecosystem of tools and frameworks I use to build scalable, high-performance applications.
                    </p>
                </motion.div>

                {/* Skills Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`
                                relative p-8 rounded-3xl border border-white/10 backdrop-blur-md overflow-hidden group transition-all duration-300
                                ${category.highlight
                                    ? 'sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-white/5 to-orange-500/5 border-orange-500/20'
                                    : 'bg-white/5 hover:bg-orange-500/10 hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(252,83,10,0.15)]'
                                }
                            `}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-3 rounded-xl ${category.highlight ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-500/20 transition-colors'}`}>
                                    {category.icon}
                                </div>
                                <h3 className={`text-xl font-bold transition-colors ${category.highlight ? 'text-white' : 'text-white group-hover:text-orange-500'}`}>{category.title}</h3>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {category.skills.map((skill, i) => (
                                    <SkillBadge key={i} name={skill} highlight={category.highlight} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
