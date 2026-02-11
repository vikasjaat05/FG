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
        <div className="min-h-screen bg-[#F0FDFD] lg:flex lg:items-center lg:justify-center overflow-hidden font-family-sans">
            {/* Ambient Background for Desktop */}
            <div className="hidden lg:block fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-asana-teal/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-asana-teal/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-[1100px] lg:flex lg:bg-white lg:rounded-[60px] lg:shadow-[0_40px_100px_rgba(0,0,0,0.08)] lg:overflow-hidden lg:h-[700px] relative z-20">
                {/* Illustration Area */}
                <div className="w-full lg:w-1/2 h-[40vh] lg:h-full relative bg-[#F0FDFD] flex items-center justify-center p-6 sm:p-12">
                    <motion.div 
                        animate={{ y: [0, -15, 0], rotate: [0, 1, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] aspect-square bg-[#22B3B8] rounded-[40px] shadow-2xl overflow-hidden flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                        <motion.div 
                            animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }}
                            transition={{ duration: 12, repeat: Infinity }}
                            className="absolute top-[-15%] right-[-15%] w-40 h-40 bg-white/10 rounded-full blur-xl"
                        />
                        <div className="text-white text-center relative z-20 font-family-sans">
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

                    <div className="absolute top-[15%] left-[10%] w-6 h-6 rounded-full bg-[#22B3B8]/20 blur-sm" />
                    <div className="absolute bottom-[25%] right-[10%] w-10 h-10 rounded-2xl bg-[#22B3B8]/10 rotate-12 blur-[1px]" />
                </div>

                {/* Login Form Area */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full lg:w-1/2 bg-white lg:bg-transparent -mt-12 lg:mt-0 rounded-t-[48px] lg:rounded-none relative z-20 px-8 lg:px-16 pt-12 lg:pt-16 pb-20 lg:pb-16 flex flex-col shadow-[0_-30px_60px_rgba(0,0,0,0.06)] lg:shadow-none border-t lg:border-none border-gray-50 lg:justify-center"
                >
                    <div className="mb-10">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <h2 className="text-3xl font-black text-[#1A181E] tracking-tighter">
                                {greeting},
                            </h2>
                            <p className="text-[#8E8E93] text-sm mt-1 font-medium tracking-tight">Access Your Professional Workspace</p>
                            <div className="w-16 h-1.5 bg-[#22B3B8] rounded-full mt-5 shadow-sm shadow-[#22B3B8]/20" />
                        </motion.div>
                    </div>

                    <div className="space-y-8">
                        <div className="group relative">
                            <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.25em] mb-4 ml-1 group-focus-within:text-[#22B3B8] transition-colors leading-none">Authorization Identity</p>
                            <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} className="relative">
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    placeholder="••••"
                                    maxLength={4}
                                    value={pin}
                                    onChange={handlePinChange}
                                    className="w-full bg-[#F8FAFF] border-2 border-transparent rounded-[28px] h-[76px] text-center text-4xl font-black tracking-[0.8em] text-[#1A181E] focus:bg-white focus:border-[#22B3B8]/10 transition-all outline-none shadow-inner"
                                />
                            </motion.div>
                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-[10px] font-black uppercase text-center mt-4 tracking-widest bg-red-50 py-2 rounded-xl"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </div>

                        <p className="text-[11px] text-[#8E8E93] text-center px-6 leading-relaxed font-bold opacity-60">
                            Secure authentication required to sync enterprise records.
                        </p>
                    </div>

                    <div className="mt-12 space-y-5">
                        <Button
                            className="w-full h-18 rounded-[28px] bg-[#22B3B8] text-lg font-black tracking-tight shadow-xl shadow-[#22B3B8]/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            onClick={() => handleLogin(pin)}
                            isLoading={isLoading}
                            disabled={pin.length < 4}
                        >
                            Validate Access
                        </Button>
                        <div className="flex justify-center items-center gap-3 opacity-40">
                            <div className="w-1.5 h-1.5 rounded-full bg-asana-teal" />
                            <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.4em]">v3.5 Secure Node</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-asana-teal" />
                        </div>
                    </div>
                </motion.div>
            </div>
            {/* Bottom Safe Indicator Mobile Only */}
            <div className="lg:hidden h-6 w-full bg-white relative z-20" />
        </div>
    );
};


export default Login;
