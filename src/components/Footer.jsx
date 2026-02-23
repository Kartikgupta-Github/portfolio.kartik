import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const socialLinks = [
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/in/kartik-gupta30/',
        icon: 'ri-linkedin-fill',
        color: 'hover:text-blue-400',
    },
    {
        name: 'GitHub',
        href: 'https://github.com/Kartikgupta-Github',
        icon: 'ri-github-fill',
        color: 'hover:text-gray-300',
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=37jvhux',
        icon: 'ri-instagram-line',
        color: 'hover:text-pink-400',
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/@kartik.gupta30',
        icon: 'ri-youtube-fill',
        color: 'hover:text-red-400',
    },
];

const quickLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Blog', href: '/blog' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Contact', href: '/#contact' },
];

const services = [
    'Web Development',
    'App Development',
    'UI/UX Design',
    'Cybersecurity Consulting',
    'API Development',
    'Cloud Solutions',
];

const Footer = () => {
    return (
        <footer className="relative bg-[#0a0a0a] border-t border-white/5">
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

            <div className="container mx-auto px-6 pt-16 pb-8">
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <a href="/#" className="text-2xl font-bold text-white tracking-wider mb-4 inline-block">
                            kartik<span className="text-orange-500">.</span>
                        </a>
                        <p className="text-gray-500 text-sm leading-relaxed mt-3">
                            Full-Stack Developer & Cybersecurity Enthusiast crafting secure, high-performance digital experiences.
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-500 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-orange-500 transition-colors" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Services */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">
                            Services
                        </h4>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service}>
                                    <span className="text-gray-500 text-sm flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                                        {service}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">
                            My Social Links
                        </h4>
                        <div className="space-y-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ x: 4 }}
                                    className={`flex items-center gap-3 text-gray-500 ${social.color} transition-colors group`}
                                >
                                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-orange-500/20 transition-all">
                                        <i className={`${social.icon} text-lg`}></i>
                                    </div>
                                    <span className="text-sm font-medium">{social.name}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} Kartik Gupta. All rights reserved.
                        </p>
                        <p className="text-gray-700 text-xs">
                            Designed & Built with <span className="text-orange-500">♥</span> using React & Tailwind
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
