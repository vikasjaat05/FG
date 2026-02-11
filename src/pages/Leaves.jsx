import { useState, useEffect } from 'react';
import { Umbrella, Clock, Plus, CheckCircle, XCircle, ChevronLeft, ChevronRight, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const Leaves = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await api.get(`?pin=${user.pin}&t=${Date.now()}&action=get_attendance&start_date=2025-12-01&end_date=2026-03-31&limit=50000`);
                if (response.data.attendance) {
                    const leaves = response.data.attendance.filter(l => l.Type === 'LEAVE' || l.Type === 'HALF DAY');
                    setHistory(leaves);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaves();
    }, [user.pin]);

    return (
        <div className="space-y-8 pb-32">
            <header className="flex items-center gap-4 px-2">
                <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm text-[#8E8E93] active:scale-95 transition-all outline-none">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-black text-[#1A181E] tracking-tight">Leave Records</h1>
            </header>

            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                <div className="lg:col-span-5 space-y-8">
                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-2 gap-4 px-1">
                        <div className="bg-white p-6 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-asana-teal/5 rounded-bl-[40px]" />
                            <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2">Total Taken</p>
                            <h4 className="text-3xl font-black text-[#1A181E] tracking-tighter">{history.length} <span className="text-[10px] text-[#8E8E93] font-bold">DAYS</span></h4>
                        </div>
                        <div className="bg-white p-6 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-[40px]" />
                            <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2">Status</p>
                            <h4 className="text-xl font-black text-green-500 tracking-tighter">Healthy</h4>
                        </div>
                    </div>

                    {/* Premium Notice Box */}
                    <div className="mx-1 bg-white p-6 rounded-[32px] border border-white shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 bg-asana-teal/5 rounded-2xl flex items-center justify-center text-asana-teal flex-shrink-0 shadow-inner">
                            <Umbrella size={24} />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black text-[#1A181E] uppercase tracking-widest mb-1">Company Policy</h4>
                            <p className="text-sm text-[#8E8E93] leading-relaxed font-medium">
                                Please apply for leave at least <span className="text-asana-teal font-black">24 hours</span> in advance for management approval.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 mt-8 lg:mt-0 px-2">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-lg font-black text-[#1A181E] tracking-tight flex items-center gap-2">
                           <Clock size={18} className="text-[#8E8E93]" />
                           Recent Requests
                        </h3>
                        <div className="text-[10px] font-black text-asana-teal uppercase tracking-widest border-b-2 border-asana-teal/20 pb-0.5 cursor-pointer">View All</div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="bg-white rounded-[32px] p-12 flex flex-col items-center justify-center shadow-sm">
                                <span className="w-8 h-8 border-3 border-asana-teal/20 border-t-asana-teal rounded-full animate-spin mb-4" />
                                <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">Retrieving Logs...</p>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="bg-white p-12 rounded-[40px] text-center border-2 border-dashed border-gray-100 flex flex-col items-center shadow-sm">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Calendar size={32} className="text-gray-200" />
                                </div>
                                <p className="text-sm font-black text-[#8E8E93] uppercase tracking-widest opacity-40">No records found</p>
                            </div>
                        ) : (
                            history.map((l, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white p-6 rounded-[36px] border border-white shadow-sm hover:shadow-md transition-all group active:scale-[0.98]"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                                                l.Type === 'LEAVE' ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"
                                            )}>
                                                {l.Type === 'LEAVE' ? <Umbrella size={22} /> : <Clock size={22} />}
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-[#1A181E] tracking-tight leading-none mb-1.5">{l.Type}</p>
                                                <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wide opacity-60 leading-none">{l.Date}</p>
                                            </div>
                                        </div>
                                        <div className="bg-green-500/10 text-green-600 px-3 py-1.5 rounded-xl text-[9px] font-black border border-green-500/20 uppercase tracking-widest">
                                            Approved
                                        </div>
                                    </div>
                                    {l.reason && (
                                        <div className="flex gap-3 bg-[#F8FAFF] p-4 rounded-2xl items-center border border-gray-50 group-hover:bg-white transition-colors">
                                            <MessageSquare size={14} className="text-[#8E8E93]/40" />
                                            <p className="text-[12px] text-[#8E8E93] font-bold italic leading-relaxed">
                                                “{l.reason}”
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>


            {/* Floating Action Button (Asana style) */}
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-28 right-6 w-16 h-16 bg-asana-teal rounded-[24px] shadow-2xl shadow-asana-teal/40 flex items-center justify-center text-white z-50 group overflow-hidden"
                onClick={() => navigate('/attendance')}
            >
                <motion.div 
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-x-0 h-full bg-white/10"
                />
                <Plus size={28} className="relative z-10" />
            </motion.button>
        </div>
    );
};

export default Leaves;
