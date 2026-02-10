import { useRef, useEffect, useState } from 'react';
import { Home, User, Bell, Activity, Clock, Users, Search, ChevronRight, MessageSquare, CreditCard, Calendar, Filter, X, Edit2, Shield, Phone, Mail, Building, Landmark, Save, RefreshCw, LogOut as LogOutIcon, Umbrella, ChevronLeft, Globe, Send, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import useAuthStore from '../store/authStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const API_UPLOADS = 'https://portal.flaneurglobal.com/api/uploads/';

const Dashboard = () => {
    const { user, staffList } = useAuthStore();
    const isAdmin = user?.role?.toLowerCase() === 'admin';

    if (isAdmin) return <AdminDashboard user={user} staffList={staffList} />;
    return <StaffDashboard user={user} />;
};

const StaffDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currDate, setCurrDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 17) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
        return () => clearInterval(timer);
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get(`?pin=${user.pin}&t=${Date.now()}`);
            if (response.data.attendance) {
                setLogs(response.data.attendance);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user.pin]);

    const monthStart = startOfMonth(currDate);
    const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(currDate) });
    const firstDayIdx = monthStart.getDay();

    const getDayStatus = (date) => {
        const dStr = format(date, 'dd/MM/yyyy');
        const dayLogs = logs.filter(l => l.Date === dStr);
        const types = dayLogs.map(l => l.Type);
        
        if (types.includes('LEAVE')) return 'leave';
        if (types.includes('HALF DAY')) return 'half';
        if (types.includes('IN') || types.includes('OUT')) return 'present';
        return null;
    };

    return (
        <div className="space-y-8 pb-32">
             <header className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[0.25em] mb-1">{greeting},</h2>
                    <h1 className="text-2xl font-black text-[#1A181E] tracking-tight leading-none">{user?.name}</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/messages')} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-[#8E8E93] active:scale-95 transition-all relative">
                        <MessageSquare size={20} />
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                    </button>
                    <div 
                        className="w-12 h-12 rounded-2xl bg-asana-teal/10 flex items-center justify-center text-asana-teal font-black border border-asana-teal/20 shadow-sm overflow-hidden active:scale-95 transition-all cursor-pointer"
                        onClick={() => navigate('/profile')}
                    >
                        {user?.profile_pic ? (
                            <img src={`${API_UPLOADS}${user.profile_pic}`} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0)
                        )}
                    </div>
                </div>
            </header>

            {/* Premium Staff Heatmap */}
            <div className="bg-white rounded-[40px] p-8 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] mx-1">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-asana-teal" />
                        <h3 className="text-sm font-black text-[#1A181E] uppercase tracking-widest">{format(currDate, 'MMMM yyyy')}</h3>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrDate(subMonths(currDate, 1))} className="p-2 text-[#8E8E93]/40 hover:text-asana-teal"><ChevronLeft size={20} /></button>
                        <button onClick={() => setCurrDate(addMonths(currDate, 1))} className="p-2 text-[#8E8E93]/40 hover:text-asana-teal"><ChevronRight size={20} /></button>
                    </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-4">
                    {['S','M','T','W','T','F','S'].map(d => (
                        <span key={d} className="text-[10px] font-black text-[#8E8E93]/30">{d}</span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: firstDayIdx }).map((_, i) => <div key={i} />)}
                    {days.map(day => {
                        const status = getDayStatus(day);
                        const isToday = isSameDay(day, new Date());
                        
                        let style = "bg-[#F8FAFF] text-[#8E8E93]/20";
                        if (status === 'leave') style = "bg-red-700 text-white shadow-lg shadow-red-700/20";
                        else if (status === 'half') style = "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20";
                        else if (status === 'present') style = "bg-green-500 text-white shadow-lg shadow-green-500/20 scale-105 z-10";

                        return (
                            <div 
                                key={day.toString()}
                                className={cn(
                                    "aspect-square rounded-2xl flex items-center justify-center text-[10px] font-black transition-all relative",
                                    style,
                                    isToday && !status && "border-2 border-asana-teal/50 text-asana-teal"
                                )}
                            >
                                {format(day, 'd')}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-4 px-2">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em]">Activity Feed</h3>
                    <RefreshCw size={12} className={cn("text-[#8E8E93]/40", loading && "animate-spin")} />
                </div>
                <div className="space-y-4">
                    {loading && logs.length === 0 ? (
                        <div className="bg-white rounded-[32px] p-12 flex flex-col items-center justify-center shadow-sm">
                            <span className="w-8 h-8 border-3 border-asana-teal/20 border-t-asana-teal rounded-full animate-spin mb-4" />
                            <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">Syncing Records...</p>
                        </div>
                    ) : (
                        logs.map((log, i) => {
                            const isLeave = log.Type === 'LEAVE';
                            const isHalf = log.Type === 'HALF DAY';
                            const isOut = log.Type === 'OUT';
                            
                            return (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white p-5 rounded-[32px] shadow-sm flex items-center gap-5 border border-white hover:border-gray-100 transition-all active:scale-[0.98]"
                                >
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
                                        isLeave ? "bg-red-50 text-red-700" : isHalf ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"
                                    )}>
                                        {isLeave ? <Umbrella size={24} /> : isHalf ? <Clock size={24} /> : isOut ? <Activity size={24} /> : <Globe size={24} />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-base font-black text-[#1A181E] tracking-tight leading-none mb-1.5">{log.Type}</h4>
                                                <p className="text-[11px] font-bold text-[#8E8E93] tracking-wide uppercase opacity-60">{log.Date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-[#1A181E] tracking-tighter uppercase mb-1">{log.Time}</p>
                                                {log.reason && (
                                                    <div className="flex items-center gap-1 opacity-40">
                                                        <MessageSquare size={10} />
                                                        <span className="text-[9px] font-bold italic truncate max-w-[80px]">{log.reason}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-[#8E8E93]/20" />
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = ({ user, staffList }) => {
    const navigate = useNavigate();
    const [allLogs, setAllLogs] = useState([]);
    const [stats, setStats] = useState({ present: 0, leave: 0, total: 0 });
    const [search, setSearch] = useState("");
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 17) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        const fetchAll = async () => {
            try {
                const response = await api.get(`?pin=${user.pin}&t=${Date.now()}`);
                if (response.data.attendance) {
                    const logs = response.data.attendance;
                    setAllLogs(logs);
                    const today = format(new Date(), 'dd/MM/yyyy');
                    const td = logs.filter(l => l.Date === today);
                    setStats({
                        present: new Set(td.filter(l => l.Type === 'IN').map(l => l.Name)).size,
                        leave: new Set(td.filter(l => l.Type === 'LEAVE').map(l => l.Name)).size,
                        total: (staffList?.length || 1) - 1
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchAll();
    }, [user.pin, staffList]);

    return (
        <div className="space-y-8 pb-32">
            <header className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[0.25em] mb-1">{greeting} Boss,</h2>
                    <h1 className="text-2xl font-black text-[#1A181E] tracking-tight leading-none">Admin Center</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/messages')} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-[#8E8E93] active:scale-95 transition-all relative">
                        <Bell size={20} />
                        <div className="absolute top-2 right-2.5 w-2 h-2 bg-asana-teal rounded-full border-2 border-white animate-ping" />
                        <div className="absolute top-2 right-2.5 w-2 h-2 bg-asana-teal rounded-full border-2 border-white" />
                    </button>
                    <div 
                        className="w-12 h-12 bg-asana-teal/10 border border-asana-teal/20 rounded-2xl flex items-center justify-center text-asana-teal font-black shadow-sm overflow-hidden cursor-pointer"
                        onClick={() => navigate('/profile')}
                    >
                         {user?.profile_pic ? (
                            <img src={`${API_UPLOADS}${user.profile_pic}`} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            "A"
                        )}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-3 gap-3 px-1">
                <StatCard label="Live" val={stats.present} color="text-green-500" />
                <StatCard label="Leaves" val={stats.leave} color="text-red-600" />
                <StatCard label="Total" val={stats.total} />
            </div>

            {/* Premium Admin Activity List (No colored sidebars/SS, clean Asana look) */}
            <div className="bg-white rounded-[40px] px-8 pt-8 pb-4 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] mx-1">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em]">Latest Activity</h3>
                    <div className="flex gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500/20" />
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-1">
                    {allLogs.slice(0, 15).map((l, i) => (
                        <div key={i} className="flex items-center gap-5 group transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-[#F8FAFF] flex items-center justify-center text-asana-teal border border-gray-50 overflow-hidden shadow-inner">
                                 {staffList.find(s => s.name === l.Name)?.profile_pic ? (
                                     <img src={`${API_UPLOADS}${staffList.find(s => s.name === l.Name).profile_pic}`} className="w-full h-full object-cover" />
                                 ) : (
                                     l.Name.charAt(0)
                                 )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-[#1A181E] tracking-tight mb-0.5">{l.Name}</p>
                                <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest opacity-60">{l.Type} • {l.Time}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-asana-teal/40 group-hover:text-asana-teal transition-colors tracking-tighter">{l.Date}</p>
                            </div>
                        </div>
                    ))}
                    {allLogs.length === 0 && (
                        <div className="py-20 text-center opacity-20 flex flex-col items-center">
                            <Activity size={32} className="mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No activity found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Directory (Premium List) */}
            <div className="px-2">
                <div className="flex justify-between items-center mb-6 px-2">
                    <h3 className="text-xl font-black text-[#1A181E] tracking-tight">Staff Directory</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]/40" size={14} />
                        <input 
                            type="text" 
                            placeholder="Find staff..." 
                            className="bg-white border-none rounded-2xl py-2 pl-10 pr-4 text-xs w-36 focus:ring-2 focus:ring-asana-teal/10 shadow-sm transition-all outline-none font-medium"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-3 pb-8">
                    {staffList?.filter(s => s.role !== 'admin' && s.name.toLowerCase().includes(search.toLowerCase())).map((s, i) => (
                        <motion.div 
                            key={i} 
                            whileTap={{ scale: 0.98 }}
                            className="bg-white p-5 rounded-[32px] flex items-center justify-between border border-white shadow-sm hover:border-asana-teal/10 transition-all"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-[#F8FAFF] rounded-2xl border border-gray-50 flex items-center justify-center font-black text-asana-teal overflow-hidden relative shadow-inner">
                                     {s.profile_pic ? (
                                         <img src={`${API_UPLOADS}${s.profile_pic}`} alt={s.name} className="w-full h-full object-cover" />
                                     ) : (
                                         s.name.charAt(0)
                                     )}
                                     <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                                </div>
                                <div>
                                    <p className="text-base font-black text-[#1A181E] tracking-tight leading-none mb-1.5">{s.name}</p>
                                    <p className="text-[10px] text-[#8E8E93] uppercase font-black tracking-widest opacity-60 leading-none">{s.designation}</p>
                                </div>
                            </div>
                            <Button 
                                size="sm" 
                                variant="secondary" 
                                className="h-10 rounded-xl px-5 text-[10px] font-black tracking-widest bg-asana-teal/5 border border-asana-teal/10 text-asana-teal hover:bg-asana-teal hover:text-white transition-all shadow-sm"
                                onClick={() => setSelectedStaff(s)}
                            >
                                MANAGE
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedStaff && (
                    <StaffDetailModal 
                        staff={selectedStaff} 
                        logs={allLogs.filter(l => l.Name === selectedStaff.name)}
                        adminPin={user.pin}
                        onClose={() => setSelectedStaff(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const StaffDetailModal = ({ staff, logs, adminPin, onClose }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({ ...staff, newCode: staff.pin });
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MM/yyyy'));
    const fileRef = useRef(null);

    const months = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
            val: format(d, 'MM/yyyy'),
            label: format(d, 'MMMM yyyy')
        };
    });

    const filteredLogs = logs.filter(l => l.Date.includes(selectedMonth));

    const handleSave = async () => {
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('action', 'update_staff');
            fd.append('pin', adminPin);
            fd.append('name', staff.name);
            fd.append('phone', formData.phone || "");
            fd.append('email', formData.email || "");
            fd.append('dept', formData.department || "");
            fd.append('join', formData.joining_date || "");
            fd.append('state', formData.state || "");
            fd.append('exp', formData.experience || "");
            fd.append('bank_account', formData.bank_account || "");
            fd.append('ifsc_code', formData.ifsc_code || "");
            fd.append('adhar_number', formData.adhar_number || "");
            fd.append('pan_number', formData.pan_number || "");
            fd.append('newCode', formData.newCode || "");
            
            if(fileRef.current?.files[0]) {
                fd.append('profile_pic', fileRef.current.files[0]);
            }

            const response = await api.post('', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.result === 'success') {
                toast.success("Profile Updated Successfully!");
                setIsEdit(false);
                setTimeout(() => window.location.reload(), 1000);
            } else {
                toast.error(response.data.message || "Failed to update");
            }
        } catch (err) {
            toast.error("Network Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
            <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="w-full max-w-lg bg-[#F8FAFF] sm:rounded-[48px] rounded-t-[48px] h-[92vh] overflow-hidden flex flex-col shadow-2xl"
            >
                <div className="p-8 pb-4 flex justify-between items-start">
                    <div className="flex items-center gap-5">
                         <div 
                            className="w-20 h-20 rounded-[28px] bg-white border-4 border-white flex items-center justify-center font-black text-asana-teal text-3xl overflow-hidden shadow-xl ring-1 ring-black/5 relative"
                            onClick={() => isEdit && fileRef.current?.click()}
                        >
                            {staff.profile_pic ? (
                                <img src={`${API_UPLOADS}${staff.profile_pic}`} alt={staff.name} className="w-full h-full object-cover" />
                            ) : (
                                staff.name.charAt(0)
                            )}
                            {isEdit && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[8px] text-white">UPLOAD</div>}
                        </div>
                        <input type="file" ref={fileRef} className="hidden" accept="image/*" />
                        <div>
                            <h2 className="text-2xl font-black text-[#1A181E] tracking-tight leading-none mb-2">{staff.name}</h2>
                            <span className="bg-asana-teal/10 text-asana-teal text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{staff.designation}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white rounded-2xl shadow-sm text-[#8E8E93] active:scale-95 transition-all"><X size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
                     <div className="bg-white rounded-[32px] p-2 shadow-sm border border-white">
                         <button 
                            onClick={() => setIsEdit(!isEdit)}
                            className={cn(
                                "w-full py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                                isEdit ? "bg-asana-teal text-white shadow-lg" : "bg-gray-50 text-[#8E8E93]"
                            )}
                         >
                             {isEdit ? 'Finish Editing' : 'Edit Staff Records'}
                         </button>
                     </div>

                     {isEdit ? (
                        <div className="space-y-4 px-2">
                            <EditField label="Phone" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                            <EditField label="Email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                            <EditField label="Dept" value={formData.department} onChange={(v) => setFormData({...formData, department: v})} />
                            <EditField label="Login PIN" value={formData.newCode} onChange={(v) => setFormData({...formData, newCode: v})} />
                            <Button className="w-full h-[64px] rounded-[24px] mt-6 bg-asana-teal font-black tracking-tight" onClick={handleSave} isLoading={loading}>Update System</Button>
                        </div>
                     ) : (
                        <div className="space-y-8 pb-10">
                            <div className="grid grid-cols-2 gap-4">
                                <QuickInfo label="Employee ID" val={`#${staff.id}`} />
                                <QuickInfo label="Joined" val={staff.joining_date || 'New'} />
                            </div>

                            <div className="bg-white rounded-[32px] border border-white shadow-sm overflow-hidden">
                                <InfoRow icon={<Phone size={16}/>} label="Phone" value={staff.phone} />
                                <InfoRow icon={<MailIcon size={16}/>} label="Email" value={staff.email} />
                                <InfoRow icon={<Landmark size={16}/>} label="Bank A/C" value={staff.bank_account} />
                                <InfoRow icon={<Shield size={16}/>} label="Auth PIN" value={staff.pin} />
                            </div>

                            {/* Monthly Calendar for Admin in Modal */}
                            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-white">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">Attendance Audit</h3>
                                    <select 
                                        className="bg-[#F8FAFF] text-[10px] font-black text-[#1A181E] border-none rounded-xl px-4 py-2 outline-none shadow-sm"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {Array.from({ length: 31 }).map((_, i) => {
                                        const day = (i + 1).toString().padStart(2, '0');
                                        const dayLogs = filteredLogs.filter(l => l.Date.startsWith(day));
                                        const types = dayLogs.map(l => l.Type);

                                        let style = "bg-[#F8FAFF] text-[#8E8E93]/20";
                                        if (types.includes('LEAVE')) style = "bg-red-700 text-white";
                                        else if (types.includes('HALF DAY')) style = "bg-yellow-400 text-black";
                                        else if (types.includes('IN') || types.includes('OUT')) style = "bg-green-500 text-white";

                                        return (
                                            <div key={i} className={cn("aspect-square rounded-xl flex items-center justify-center text-[10px] font-black shadow-sm transition-all", style)}>
                                                {i + 1}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                     )}
                </div>
            </motion.div>
        </motion.div>
    );
};

const QuickInfo = ({ label, val }) => (
    <div className="bg-white p-6 rounded-[32px] border border-white shadow-sm text-center">
        <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-sm font-black text-[#1A181E] uppercase tracking-tighter">{val}</p>
    </div>
);

const EditField = ({ label, value, onChange }) => (
    <div>
        <label className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest ml-4 mb-2 block">{label}</label>
        <input 
            type="text" 
            value={value || ""} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-14 bg-white border-2 border-transparent focus:border-asana-teal/10 rounded-[24px] px-6 text-sm font-medium text-[#1A181E] shadow-sm outline-none transition-all"
        />
    </div>
);

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between p-6 border-b border-[#F8FAFF] last:border-0 hover:bg-[#F8FAFF]/50 transition-colors group">
        <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#F8FAFF] group-hover:bg-asana-teal/5 text-[#8E8E93] group-hover:text-asana-teal flex items-center justify-center transition-all shadow-inner">{icon}</div>
            <div>
                <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest mb-1 opacity-60">{label}</p>
                <p className="text-sm font-black text-[#1A181E] tracking-tight">{value || '---'}</p>
            </div>
        </div>
        <ChevronRight size={14} className="text-[#8E8E93]/20" />
    </div>
);

const StatCard = ({ label, val, color }) => (
    <div className="bg-white p-6 rounded-[40px] text-center border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:scale-[1.05] transition-transform duration-300">
        <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2">{label}</p>
        <h4 className={cn("text-3xl font-black tracking-tighter", color || "text-[#1A181E]")}>{val}</h4>
    </div>
);

export default Dashboard;
