import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Experience', href: '#experience' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <a href="#" className="text-2xl font-bold text-white tracking-wider">
                    kartik<span className="text-orange-500">.</span>
                </a>

                {/* Desktop Menu - Hidden on tablet/mobile, visible on large screens */}
                <div className="hidden lg:flex items-center space-x-1 lg:space-x-8 bg-white/5 px-8 py-3 rounded-full border border-white/10 backdrop-blur-sm">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-300 hover:text-orange-500 transition-colors text-sm font-medium px-2"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="hidden lg:flex">
                    <a
                        href="https://drive.google.com/file/d/1Gg1Eiz9j7FaLHLxRGffHFB3IJX12APau/view?usp=drive_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-transparent border border-orange-500 text-orange-500 px-6 py-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 text-sm font-medium group"
                    >
                        <span>Download Resume</span>
                        <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </a>
                </div>

                {/* Mobile Toggle - Visible on tablet/mobile */}
                <button
                    className="lg:hidden text-white p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col space-y-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-white/80 hover:text-white text-2xl font-medium block border-b border-white/5 pb-4"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="https://drive.google.com/file/d/1Gg1Eiz9j7FaLHLxRGffHFB3IJX12APau/view?usp=drive_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 font-medium text-lg flex items-center gap-3 pt-2"
                            >
                                Download Resume <Download className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
