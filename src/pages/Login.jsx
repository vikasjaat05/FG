import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [pin, setPin] = useState("");
    const [shake, setShake] = useState(false);
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 17) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

    const handlePinChange = (e) => {
        const val = e.target.value;
        if (error) useAuthStore.setState({ error: null });
        if (val.length <= 4) setPin(val);
        if (val.length === 4) handleLogin(val);
    };

    const handleLogin = async (code) => {
        const success = await login(code);
        if (success) {
            navigate("/dashboard");
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setPin("");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center overflow-hidden">
            {/* Top Illustration Area (Asana Style) - Adjusted Height and Padding */}
            <div className="w-full h-[40vh] min-h-[300px] relative bg-[#F0FDFD] flex items-center justify-center p-6 sm:p-12">
                {/* Floating Elements Animation */}
                <motion.div 
                    animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] aspect-square bg-[#22B3B8] rounded-[40px] shadow-2xl overflow-hidden flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    
                    {/* Animated Geometric Shapes */}
                    <motion.div 
                         animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }}
                         transition={{ duration: 12, repeat: Infinity }}
                         className="absolute top-[-15%] right-[-15%] w-40 h-40 bg-white/10 rounded-full blur-xl"
                    />
                    
                    <div className="text-white text-center relative z-20">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="text-6xl font-black tracking-tighter mb-2"
                        >
                            FG
                        </motion.div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">Staff Portal</p>
                    </div>

                    {/* Dashboard Mesh Animation (Smoothed) */}
                    <div className="absolute bottom-6 left-6 right-6 h-1/4 flex gap-3 z-10">
                         {[1,2,3].map(i => (
                             <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: '70%', opacity: [0.1, 0.3, 0.1] }}
                                transition={{ delay: 0.8 + (i*0.2), duration: 2, repeat: Infinity }}
                                className="flex-1 bg-white/30 rounded-t-2xl"
                             />
                         ))}
                    </div>
                </motion.div>

                {/* Background Decor - Fixed positions to prevent clipping */}
                <div className="absolute top-[15%] left-[10%] w-6 h-6 rounded-full bg-[#22B3B8]/20 blur-sm" />
                <div className="absolute bottom-[25%] right-[10%] w-10 h-10 rounded-2xl bg-[#22B3B8]/10 rotate-12 blur-[1px]" />
                <div className="absolute top-[20%] right-[15%] w-3 h-3 rounded-full bg-[#22B3B8]/15" />
            </div>

            {/* Login Card (Bottom Sheet Style) */}
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-md bg-white -mt-12 rounded-t-[48px] relative z-20 px-8 pt-12 pb-20 flex-1 flex flex-col shadow-[0_-30px_60px_rgba(0,0,0,0.06)] border-t border-gray-50 overflow-y-auto"
            >
                <div className="mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-black text-[#1A181E] tracking-tighter">
                            {greeting},
                        </h2>
                        <p className="text-[#8E8E93] text-sm mt-1 font-medium tracking-tight">Access Your Professional Workspace</p>
                        <div className="w-16 h-1.5 bg-[#22B3B8] rounded-full mt-5 shadow-sm shadow-[#22B3B8]/20" />
                    </motion.div>
                </div>

                <div className="space-y-8 flex-1">
                    <div className="group relative">
                        <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.25em] mb-4 ml-1 group-focus-within:text-[#22B3B8] transition-colors leading-none">Authorization Identity</p>
                        <motion.div 
                            animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
                            className="relative"
                        >
                            <input
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={4}
                                placeholder="••••"
                                value={pin}
                                onChange={handlePinChange}
                                className="w-full bg-[#F8FAFF] border-2 border-transparent rounded-[28px] h-[76px] text-center text-4xl font-black tracking-[0.8em] text-[#1A181E] placeholder:text-[#8E8E93]/10 focus:bg-white focus:border-[#22B3B8]/20 focus:ring-4 focus:ring-[#22B3B8]/5 transition-all outline-none shadow-inner"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                {isLoading && <div className="w-6 h-6 border-3 border-[#22B3B8]/20 border-t-[#22B3B8] rounded-full animate-spin" />}
                            </div>
                        </motion.div>
                        {error && (
                            <motion.p 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-[10px] font-black uppercase text-center mt-4 tracking-widest bg-red-50 py-2 rounded-xl"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-[11px] text-[#8E8E93] text-center px-6 leading-relaxed font-bold opacity-60">
                            Secure authentication required to sync your enterprise attendance records.
                        </p>
                    </div>
                </div>

                <div className="mt-12 space-y-5">
                    <Button
                        className="w-full h-18 rounded-[28px] bg-[#22B3B8] hover:bg-[#1a9ba0] text-lg font-black tracking-tight shadow-xl shadow-[#22B3B8]/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                        onClick={() => handleLogin(pin)}
                        isLoading={isLoading}
                        disabled={pin.length < 4}
                    >
                        Validate Access
                    </Button>
                    
                    <div className="flex justify-center items-center gap-3 pt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-asana-teal/20" />
                        <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.4em] opacity-40">
                            v3.0 Secure Protocol
                        </p>
                        <div className="w-1.5 h-1.5 rounded-full bg-asana-teal/20" />
                    </div>
                </div>
            </motion.div>

            {/* Bottom Safe Indicator */}
            <div className="h-6 w-full bg-white relative z-20" />
        </div>
    );
};

export default Login;
