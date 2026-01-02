import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';

const experiences = [
    {
        title: "Software Developer",
        company: "Innojar Tech Pvt. Ltd.",
        period: "Jan 2025 - Aug 2025",
        location: "Jaipur, Rajasthan",
        description: "Optimized backend modules in Laravel for HRManager (Unbox Payroll), improving data processing speed. Implemented attendance tracking and collaborated with cross-functional teams."
    },
    {
        title: "Software Developer Trainee",
        company: "Innojar Tech Pvt. Ltd.",
        period: "Oct 2024 - Dec 2024",
        location: "Jaipur, Rajasthan",
        description: "Gained foundation in web development, version control (Git), and agile project management tools like Jira and Slack."
    }
];

const education = [
    {
        degree: "Master of Computer Applications (AI/ML)",
        school: "JECRC University",
        period: "Sep 2025 - Sep 2027",
        location: "Jaipur"
    },
    {
        degree: "Bachelor of Computer Applications",
        school: "Parishkar College of Global Excellence",
        period: "2021 - 2024",
        location: "Jaipur"
    }
];

const Experience = () => {
    return (
        <section id="experience" className="py-24 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute center-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-900/20 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-white mb-20 text-center"
                >
                    Experience & <span className="text-orange-500">Education</span>
                </motion.h2>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Experience Column */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="p-3 bg-white/5 rounded-xl text-orange-500">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Work History</h3>
                        </motion.div>

                        <div className="space-y-8 ml-6 pl-8 py-2 relative">
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    whileHover="hover"
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative group h-full"
                                >
                                    {/* Line */}
                                    <div className="absolute -left-[40px] top-2 bottom-0 w-[2px] bg-white/10 group-last:bottom-auto group-last:h-full" />

                                    {/* Dot */}
                                    <motion.span
                                        variants={{
                                            hover: { top: "100%", y: "-100%", transition: { duration: 0.5, ease: "easeInOut" } }
                                        }}
                                        className="absolute -left-[49px] top-2 h-5 w-5 rounded-full bg-zinc-900 border-4 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] z-10"
                                    />

                                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                                        <h4 className="text-lg font-bold text-white mb-1">{exp.title}</h4>
                                        <p className="text-orange-400 font-medium text-sm mb-3 flex items-center justify-between">
                                            {exp.company}
                                            <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                                                <MapPin size={12} /> {exp.location}
                                            </span>
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 bg-black/20 w-fit px-3 py-1 rounded-full border border-white/5">
                                            <Calendar className="w-3 h-3" />
                                            {exp.period}
                                        </div>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            {exp.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Education Column */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="p-3 bg-white/5 rounded-xl text-orange-500">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Education</h3>
                        </motion.div>

                        <div className="space-y-8 ml-6 pl-8 py-2 relative">
                            {education.map((edu, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    whileHover="hover"
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative group h-full"
                                >
                                    {/* Line */}
                                    <div className="absolute -left-[40px] top-2 bottom-0 w-[2px] bg-white/10" />

                                    <motion.span
                                        variants={{
                                            hover: { top: "100%", y: "-100%", transition: { duration: 0.5, ease: "easeInOut" } }
                                        }}
                                        className="absolute -left-[49px] top-2 h-5 w-5 rounded-full bg-zinc-900 border-4 border-gray-600 group-hover:border-white transition-colors z-10"
                                    />

                                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                                        <h4 className="text-lg font-bold text-white mb-1">{edu.degree}</h4>
                                        <p className="text-orange-400 font-medium text-sm mb-3 flex items-center justify-between">
                                            {edu.school}
                                            <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                                                {edu.location}
                                            </span>
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 bg-black/20 w-fit px-3 py-1 rounded-full border border-white/5">
                                            <Calendar className="w-3 h-3" />
                                            {edu.period}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
