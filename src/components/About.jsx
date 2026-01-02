import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Code, Sparkles, Brain } from 'lucide-react';

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl hover:border-orange-500/30 transition-colors">
        <div className="text-orange-500 mb-2">{icon}</div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
);

const PersonalInfo = ({ icon, text }) => (
    <div className="flex items-center gap-3 text-gray-300">
        <div className="text-orange-500">{icon}</div>
        <span>{text}</span>
    </div>
);

const About = () => {
    return (
        <section id="about" className="py-24 relative overflow-hidden bg-[#0f0f0f]">
            {/* Background Glows */}
            <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-6 md:px-16 lg:px-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Animated Video */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative group">
                            {/* Background Glow behind video */}
                            <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full z-0 opacity-80" />

                            <video
                                src="/Character_Animation_Waving_Hello.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="relative z-10 w-full h-auto object-cover transform scale-[1.5] hover:scale-[1.55] transition-transform duration-700 mix-blend-lighten"
                                style={{
                                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
                                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
                                }}
                            />
                        </div>
                        {/* Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-6 -right-6 bg-[#1a1a1a] p-4 rounded-2xl border border-orange-500/20 shadow-xl flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <div className="text-white font-bold">Open to Work</div>
                                <div className="text-xs text-green-500">Available Now</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                <span className="text-orange-500 font-medium tracking-widest uppercase text-lg">About Me</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">AI Innovation</span> with <br /> Robust Engineering.
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                I am a <strong>MCA Scholar specializing in AI/ML</strong> with a strong foundation in Full Stack Development.
                                My passion lies in building intelligent, scalable web applications that solve real-world problems.
                                Whether it's crafting intuitive UIs or architecting secure backend systems, I bring a detail-oriented approach to every project.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <StatCard icon={<Code size={20} />} value="4+" label="Years of Codeing" />
                            <StatCard icon={<Brain size={20} />} value="6+" label="Projects" />
                            <StatCard icon={<User size={20} />} value="1+" label="Years of Industrial Experience" />
                        </div>

                        {/* Personal Info List */}
                        <div className="pt-6 border-t border-white/10 space-y-4">
                            <PersonalInfo icon={<User size={18} />} text="Kartik Gupta" />
                            <PersonalInfo icon={<Mail size={18} />} text="guptakartik614@gmail.com" />
                            <PersonalInfo icon={<MapPin size={18} />} text="Jaipur, Rajasthan, India" />
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
