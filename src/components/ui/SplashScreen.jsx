import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Allow exit animation to finish
        }, 2200);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="w-24 h-24 bg-asana-teal rounded-[28px] flex items-center justify-center shadow-2xl overflow-hidden relative">
                             <motion.div 
                                initial={{ y: 50 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                                className="text-white text-4xl font-black"
                             >
                                FG
                             </motion.div>
                             
                             {/* Liquid Fill Animation */}
                             <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute bottom-0 left-0 w-full bg-white/20 z-0"
                             />
                        </div>
                        
                        {/* Circular Glow */}
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 2, opacity: 0.2 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-asana-teal rounded-full blur-3xl -z-10"
                        />
                    </motion.div>
                    
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 text-center"
                    >
                        <h2 className="text-xl font-black text-[#1A181E] tracking-tighter uppercase whitespace-nowrap">Flâneur Global</h2>
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-asana-teal animate-pulse" />
                            <p className="text-[10px] font-black text-asana-teal/60 uppercase tracking-[0.3em]">Authorized Access Only</p>
                        </div>
                    </motion.div>

                    {/* Loading Bar */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="h-full bg-asana-teal shadow-[0_0_10px_rgba(36,179,184,0.5)]"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
