import { useState, useEffect } from 'react';
import { Camera, MapPin, QrCode, XCircle, CheckCircle, MessageSquare, Activity, Globe, Umbrella, Clock, ChevronLeft } from 'lucide-react';
import CameraModal from '../components/attendance/CameraModal';
import QRScannerModal from '../components/attendance/QRScannerModal';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const STORE_LAT = 26.898974785511992;
const STORE_LON = 75.73904942667157;
const MAX_DISTANCE_METERS = 100;

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const Attendance = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [cameraOpen, setCameraOpen] = useState(false);
    const [status, setStatus] = useState('pending');
    const [location, setLocation] = useState(null);
    const [verifying, setVerifying] = useState(false);
    
    const [reasonModal, setReasonModal] = useState(false);
    const [reasonText, setReasonText] = useState("");
    const [pendingType, setPendingType] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation(pos.coords),
                (err) => toast.error("GPS Access Required"),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const handleAction = (type) => {
        if (!location && type !== 'LEAVE') {
            toast.error("Waiting for GPS...");
            return;
        }

        if (type !== 'LEAVE') {
            const dist = calculateDistance(STORE_LAT, STORE_LON, location.latitude, location.longitude);
            if (dist > MAX_DISTANCE_METERS) {
                toast.error(`Outside Zone: ${Math.round(dist)}m away.`);
                return;
            }
        }

        setPendingType(type);
        if (type === 'HALF DAY' || type === 'LEAVE') {
            setReasonModal(true);
        } else {
            setCameraOpen(true);
        }
    };

    const submitAttendance = async (type, reason = "") => {
        setVerifying(true);
        setStatus('verifying');
        
        try {
            const response = await api.post('', {
                action: 'attendance',
                pin: user.pin,
                type: type,
                reason: reason
            });

            if (response.data.result === 'success') {
                setStatus('success');
                toast.success(`${type} marked!`);
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            setStatus('failed');
            toast.error(err.message || "Marking failed");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="space-y-8 pb-32">
            <header className="flex items-center gap-4 px-2">
                <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm text-[#8E8E93] active:scale-95 transition-all outline-none">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-black text-[#1A181E] tracking-tight">Time Station</h1>
            </header>

            <div className="bg-white rounded-[40px] p-8 pb-12 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] mx-1 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-asana-teal/5 to-transparent -z-0" />
                
                <div className="relative z-10 flex flex-col items-center">
                    <motion.div 
                        animate={status === 'verifying' ? { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={cn(
                            "w-56 h-56 rounded-full flex items-center justify-center border-[12px] bg-white transition-all duration-700 shadow-2xl relative",
                            status === 'pending' ? "border-[#F8FAFF]" :
                            status === 'verifying' ? "border-asana-teal/20" :
                            status === 'success' ? "border-green-500/20" : "border-red-500/20"
                        )}
                    >
                        {status === 'pending' && (
                            <div className="flex flex-col items-center">
                                <MapPin size={48} className="text-asana-teal mb-2 animate-bounce" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#8E8E93]">Ready to Scan</p>
                            </div>
                        )}
                        {status === 'verifying' && (
                             <div className="flex flex-col items-center">
                                <Activity size={48} className="text-asana-teal mb-2 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-asana-teal">Face Verified</p>
                             </div>
                        )}
                        {status === 'success' && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500">
                                <CheckCircle size={64} />
                            </motion.div>
                        )}
                        {status === 'failed' && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-500">
                                <XCircle size={64} />
                            </motion.div>
                        )}
                    </motion.div>

                    <div className="mt-10 space-y-2">
                        <h4 className="text-lg font-black text-[#1A181E] tracking-tight whitespace-nowrap">Scan for Verification</h4>
                        <div className="flex items-center gap-2 justify-center opacity-40">
                             <Globe size={12} className="text-asana-teal" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Geo-fencing Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 px-2">
                <ActionCard 
                    icon={<Camera size={24} />} 
                    label="Punch In" 
                    desc="Start Shift"
                    variant="primary"
                    onClick={() => handleAction('IN')}
                />
                <ActionCard 
                    icon={<XCircle size={24} />} 
                    label="Punch Out" 
                    desc="End Shift"
                    variant="secondary"
                    onClick={() => handleAction('OUT')}
                />
                <ActionCard 
                    icon={<Clock size={22} />} 
                    label="Half Day" 
                    desc="Leave Early"
                    onClick={() => handleAction('HALF DAY')}
                />
                <ActionCard 
                    icon={<Umbrella size={22} />} 
                    label="Mark Leave" 
                    desc="Day Off"
                    onClick={() => handleAction('LEAVE')}
                />
            </div>

            <AnimatePresence>
                {reasonModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
                    >
                        <motion.div 
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="w-full max-w-sm bg-[#F8FAFF] rounded-t-[48px] sm:rounded-[48px] p-8 pb-12 shadow-2xl"
                        >
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
                            <h3 className="text-2xl font-black mb-2 text-[#1A181E] tracking-tight">{pendingType} Permission</h3>
                            <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-8">Please provide a valid reason</p>
                            
                            <textarea 
                                className="w-full h-40 bg-white border-2 border-transparent focus:border-asana-teal/10 rounded-[32px] p-6 text-sm font-medium text-[#1A181E] mb-8 outline-none shadow-sm transition-all"
                                placeholder="Wajah yahan likhein (min 5 characters)..."
                                value={reasonText}
                                onChange={(e) => setReasonText(e.target.value)}
                            />
                            
                            <div className="flex gap-4">
                                <button className="flex-1 h-[64px] bg-white rounded-[24px] text-[10px] font-black uppercase tracking-widest text-[#8E8E93] shadow-sm active:scale-95 transition-all" onClick={() => setReasonModal(false)}>Back</button>
                                <Button className="flex-[2] h-[64px] bg-asana-teal rounded-[24px] font-black tracking-tight shadow-lg shadow-asana-teal/20" onClick={() => {
                                    if(reasonText.length < 5) return toast.error("Reason too short");
                                    setReasonModal(false);
                                    submitAttendance(pendingType, reasonText);
                                }}>Request Submit</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col items-center gap-2 opacity-30">
                 <div className="px-5 py-2.5 bg-white rounded-full flex items-center gap-3 text-[9px] text-[#8E8E93] uppercase tracking-[0.2em] font-black shadow-sm">
                    <MapPin size={12} className={location ? "text-asana-teal" : "text-orange-500"} />
                    {location ? `Portal ID: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Syncing GPS..."}
                </div>
            </div>
            
            {cameraOpen && (
                <CameraModal 
                    isOpen={cameraOpen} 
                    onClose={() => setCameraOpen(false)}
                    onCapture={(img) => {
                        setCameraOpen(false);
                        submitAttendance(pendingType, "Face Verified");
                    }}
                />
            )}
        </div>
    );
};

const ActionCard = ({ icon, label, desc, variant, onClick }) => (
    <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
            "bg-white p-6 rounded-[36px] flex flex-col items-center text-center shadow-sm border border-white active:bg-[#F8FAFF] transition-all",
            variant === 'primary' && "bg-asana-teal border-asana-teal shadow-xl shadow-asana-teal/20 text-white",
            variant === 'secondary' && "bg-white border-white shadow-lg text-[#1A181E]"
        )}
    >
        <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-inner",
            variant === 'primary' ? "bg-white/20 text-white" : "bg-[#F8FAFF] text-[#8E8E93]"
        )}>
            {icon}
        </div>
        <h4 className="text-[13px] font-black uppercase tracking-tight leading-none mb-1">{label}</h4>
        <p className={cn("text-[9px] font-bold uppercase tracking-widest opacity-40", variant === 'primary' && "text-white opacity-60")}>{desc}</p>
    </motion.button>
);

export default Attendance;
