import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home', icon: 'ri-home-4-line' },
        { name: 'About', href: '#about', icon: 'ri-user-line' },
        { name: 'Skills', href: '#skills', icon: 'ri-code-s-slash-line' },
        { name: 'Experience', href: '#experience', icon: 'ri-briefcase-line' },
        { name: 'Contact', href: '#contact', icon: 'ri-mail-line' },
    ];

    const handleNavClick = (e, link) => {
        // Route-based links (e.g. /projects)
        if (link.href.startsWith('/')) {
            e.preventDefault();
            navigate(link.href);
            setIsMobileMenuOpen(false);
            return;
        }
        if (location.pathname !== '/') {
            e.preventDefault();
            navigate('/' + link.href);
        }
        setIsMobileMenuOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSearchOpen(false);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 md:px-12 lg:px-24 flex justify-between items-center">
                <a
                    href="/"
                    onClick={() => window.dispatchEvent(new Event('logo-click'))}
                    className="text-2xl font-bold text-white tracking-wider"
                >
                    kartik<span className="text-orange-500">.</span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-1 lg:space-x-6 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link)}
                            className="text-gray-300 hover:text-orange-500 transition-colors text-sm font-medium px-2 flex items-center gap-1.5"
                        >
                            <i className={`${link.icon} text-base`}></i>
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Desktop Right Actions */}
                <div className="hidden lg:flex items-center gap-3">
                    {/* Search Toggle */}
                    <AnimatePresence>
                        {searchOpen && (
                            <motion.form
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 200, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSearch}
                                className="overflow-hidden"
                            >
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search blog..."
                                    autoFocus
                                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50"
                                    onBlur={() => {
                                        if (!searchQuery.trim()) setSearchOpen(false);
                                    }}
                                />
                            </motion.form>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="p-2.5 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-orange-500 hover:border-orange-500/30 transition-all"
                    >
                        <Search className="w-4 h-4" />
                    </button>

                    {/* Resume Button */}
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

                {/* Mobile Toggle */}
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
                        <div className="px-6 py-8 flex flex-col space-y-5">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="relative mb-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search blog..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50"
                                />
                            </form>

                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-white/80 hover:text-white text-xl font-medium flex items-center gap-3 border-b border-white/5 pb-4"
                                    onClick={(e) => handleNavClick(e, link)}
                                >
                                    <i className={`${link.icon} text-orange-500 text-lg`}></i>
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
