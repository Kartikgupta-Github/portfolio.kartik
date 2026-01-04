import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, FileCode, Hash, Database, Code2 } from 'lucide-react';

const Lightning = ({ className, delay = 0 }) => (
    <motion.img
        src="/lightning.png"
        alt="Lightning"
        className={className}
        animate={{ y: [0, -15, 0], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, delay, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 20px rgba(252, 83, 10, 0.5))" }}
    />
);

const OrbitItem = ({ imgSrc, radius, duration, delay }) => {
    return (
        <motion.div
            className="absolute rounded-full"
            style={{ width: radius * 2, height: radius * 2 }}
            animate={{ rotate: 360 }}
            transition={{ duration: duration, repeat: Infinity, ease: "linear", delay: -delay }}
        >
            <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm p-3 rounded-full border border-white/10 shadow-xl shadow-orange-500/10"
                animate={{ rotate: -360 }}
                transition={{ duration: duration, repeat: Infinity, ease: "linear", delay: -delay }}
            >
                <img src={imgSrc} alt="Tech Icon" className="w-8 h-8 object-contain" />
            </motion.div>
        </motion.div>
    );
};

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center pt-20 overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-transparent">
                {/* Dark overlay for top-left */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0f0f0f] via-transparent to-transparent z-0" />

                {/* Torch effect from bottom-right */}
                <div
                    className="absolute bottom-[-20%] right-[-20%] w-[120%] h-[120%] rounded-full blur-[180px] opacity-60 z-[-1]"
                    style={{
                        background: 'radial-gradient(circle, #FC530A 0%, rgba(252, 83, 10, 0) 80%)'
                    }}
                />
            </div>

            {/* Decorative Bolts */}
            <Lightning className="absolute top-20 -right-10 w-72 h-72 hidden md:block z-0 opacity-80 blur-[1px]" delay={0} />
            <Lightning className="absolute -bottom-20 -left-20 w-96 h-96 rotate-12 hidden md:block z-0 opacity-80 blur-[2px]" delay={1.5} />

            <div className="container mx-auto px-6 md:px-12 lg:px-32 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6 z-10 order-2 lg:order-1"
                >
                    <div className="overflow-hidden">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <span className="text-gray-300 font-medium text-lg tracking-wide uppercase">
                                Hey, I am <span className="text-[#FC530A] font-bold">Kartik</span>
                            </span>
                        </motion.div>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                        Full Stack <br />
                        <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.5)" }}>
                            Developer
                        </span>
                    </h1>

                    <p className="text-gray-400 text-base md:text-lg max-w-lg leading-relaxed mb-8">
                        MCA (AI/ML) Scholar & Full Stack Developer with industrial experience. Specializing in Laravel, Python, and modern web technologies to build secure, scalable solutions.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-orange-500 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25 cursor-pointer"
                        >
                            Hire Me
                        </motion.a>
                        <motion.a
                            href="#skills"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-transparent border border-white/10 text-white px-8 py-3 rounded-full font-medium hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            View Work
                        </motion.a>
                    </div>

                    {/* Floating Card - Hidden on tablet to prevent overlap, visible on large screens */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="hidden lg:block absolute bottom-20 left-10 lg:static lg:mt-12 p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-w-sm hover:-translate-y-1 transition-transform duration-300"
                    >
                        <div className="flex gap-4 items-start">
                            <div className="text-4xl text-orange-500 font-serif leading-4">“</div>
                            <div>
                                <p className="text-gray-300 text-sm italic mb-4">
                                    Simplifying businesses through robust code. Focused on enhancing enterprise-level web applications.
                                </p>
                                <div className="flex items-center gap-3">
                                    <img src="/avatar.png" alt="Kartik" className="w-10 h-10 rounded-full object-cover bg-orange-500/20" loading="lazy" />
                                    <div>
                                        <p className="text-white text-sm font-bold">Kartik Gupta</p>
                                        <p className="text-xs text-gray-400">MCA (AI/ML) Scholar.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Visual - Hidden on mobile, visible on tablet+ */}
                <div className="hidden md:flex relative justify-center items-center h-[500px] lg:h-[700px] order-1 lg:order-2">
                    {/* Orbit Circles */}
                    <div className="absolute w-[350px] h-[350px] lg:w-[550px] lg:h-[550px] rounded-full border border-white/5" />
                    <div className="absolute w-[250px] h-[250px] lg:w-[380px] lg:h-[380px] rounded-full border border-white/5" />

                    {/* Avatar */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20 w-80 h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]"
                    >
                        {/* Placeholder gradient/glow behind image */}
                        <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-3xl -z-10"></div>
                        <img
                            src="/avatar.png"
                            alt="Kartik"
                            className="w-full h-full object-contain drop-shadow-2xl mask-image-gradient"
                            fetchPriority="high"
                        />
                    </motion.div>

                    {/* Orbiting Icons */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <OrbitItem imgSrc="/html.png" radius={275} duration={25} delay={0} />
                        <OrbitItem imgSrc="/css.png" radius={275} duration={25} delay={12.5} />

                        <OrbitItem imgSrc="/js.png" radius={190} duration={18} delay={5} />
                        <OrbitItem imgSrc="/figma.png" radius={190} duration={18} delay={14} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
