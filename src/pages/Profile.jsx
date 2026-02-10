import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { User, LogOut, Shield, Phone, Mail, Building, Landmark, Mail as MailIcon, CreditCard, FileCheck, FileText, Camera, MoreHorizontal, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const API_UPLOADS = 'https://portal.flaneurglobal.com/api/uploads/';

const Profile = () => {
    const { logout, user, setUser } = useAuthStore();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('action', 'update_staff'); // Reusing existing action
        formData.append('pin', user.pin);
        formData.append('name', user.name);
        formData.append('profile_pic', file);

        try {
            const response = await api.post('', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.result === 'success') {
                toast.success("Profile picture updated!");
                // Optionally update local user state if the API returns new pic name
                // For now, reload or re-fetch might be required depending on API
                window.location.reload(); 
            } else {
                toast.error(response.data.message || "Upload failed");
            }
        } catch (err) {
            toast.error("Network Error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8 pb-32">
            <h1 className="text-2xl font-black text-[#1A181E] tracking-tight px-2">Account Profile</h1>

            {/* Profile Header (Premium Asana Look) */}
            <div className="bg-white p-8 rounded-[40px] flex flex-col items-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white">
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-asana-teal/5 to-transparent" />
                
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-white border-8 border-[#F8FAFF] flex items-center justify-center text-4xl font-black text-asana-teal mb-4 relative z-10 shadow-xl overflow-hidden ring-4 ring-asana-teal/5">
                        {user?.profile_pic ? (
                            <img src={`${API_UPLOADS}${user.profile_pic}`} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0) || "U"
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-4 right-2 z-20 w-10 h-10 bg-asana-teal text-white rounded-full shadow-lg flex items-center justify-center border-4 border-white active:scale-95 transition-all"
                    >
                        <Camera size={18} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*" 
                    />
                </div>

                <h2 className="text-2xl font-black text-[#1A181E] relative z-10 tracking-tight">{user?.name}</h2>
                <div className="flex items-center gap-2 mt-2 relative z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-asana-teal animate-pulse" />
                    <p className="text-[10px] text-asana-teal font-black tracking-[0.2em] uppercase opacity-80">{user?.designation || user?.role}</p>
                </div>
            </div>

            {/* System Identity Section (Updated to match Screenshot 1) */}
            <SectionTitle title="Employment Details" />
            <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white overflow-hidden">
                <DetailRow icon={<Shield size={18} />} label="Employee ID" value={`#${user?.id || '---'}`} />
                <DetailRow icon={<MailIcon size={18} />} label="Official Email" value={user?.email || '---'} />
                <DetailRow icon={<Building size={18} />} label="Assigned Dept" value={user?.department || '---'} />
            </div>

            {/* Financial & KYC Records Section (Updated to match Screenshot 1) */}
            <SectionTitle title="Financial & KYC Records" />
            <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white overflow-hidden">
                <DetailRow icon={<Landmark size={18} />} label="Salary Bank A/c" value={user?.bank_account || '---'} />
                <DetailRow icon={<CreditCard size={18} />} label="IFSC / RTGS Code" value={user?.ifsc_code || '---'} />
                <DetailRow icon={<FileCheck size={18} />} label="Aadhar Document" value={user?.adhar_number || '---'} />
                <DetailRow icon={<FileText size={18} />} label="PAN Card Record" value={user?.pan_number || '---'} />
            </div>

            {/* Action Zone */}
            <div className="px-2 space-y-4">
                <Button 
                    variant="secondary" 
                    className="w-full h-16 rounded-[28px] bg-red-50 text-red-500 border-none hover:bg-red-500 hover:text-white transition-all font-black tracking-widest shadow-sm active:scale-95 flex items-center justify-center gap-3"
                    onClick={handleLogout}
                >
                    <LogOut size={20} /> END SESSION
                </Button>
            </div>

            <div className="text-center space-y-1 py-4">
                <p className="text-[9px] text-[#8E8E93] uppercase font-black tracking-[0.3em] opacity-40">Flâneur Global Secure Access • V3.0 Premium</p>
                <p className="text-[8px] text-[#8E8E93] opacity-20 uppercase font-bold tracking-widest">Build ID: 2026.02.10.IST</p>
            </div>
        </div>
    );
};

const SectionTitle = ({ title }) => (
    <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.25em] ml-6 mb-4">{title}</p>
);

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between p-6 border-b border-[#F8FAFF] last:border-0 hover:bg-[#F8FAFF]/50 transition-colors group">
        <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#F8FAFF] text-[#8E8E93] flex items-center justify-center group-hover:bg-asana-teal/10 group-hover:text-asana-teal transition-all shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest opacity-60 leading-none mb-1.5">{label}</p>
                <p className="text-[15px] font-bold text-[#1A181E] tracking-tight leading-none">{value}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <MoreHorizontal size={18} className="text-[#8E8E93]/20 group-hover:text-asana-teal/40 transition-colors" />
        </div>
    </div>
);

export default Profile;
