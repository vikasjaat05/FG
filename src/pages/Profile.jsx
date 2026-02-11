import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { 
    User, LogOut, Shield, Phone, Mail, Building, Landmark, 
    CreditCard, FileCheck, FileText, Camera, MoreHorizontal, 
    ChevronRight, Save, Edit2, MapPin, Briefcase, Calendar, 
    Layers, Droplets, Globe, Award, Lock
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const API_UPLOADS = 'https://portal.flaneurglobal.com/api/uploads/';

const Profile = () => {
    const { logout, user, updateUser } = useAuthStore();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    const isAdmin = user?.role?.toLowerCase() === 'admin';

    // Update formData when user changes
    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setUploading(true);
        try {
            const response = await api.post('', {
                action: 'update_staff',
                pin: user.pin,
                ...formData
            });

            if (response.data.result === 'success') {
                toast.success("Profile updated successfully!");
                updateUser(formData);
                setIsEditing(false);
            } else {
                toast.error(response.data.message || "Update failed");
            }
        } catch (err) {
            toast.error("Network Error");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('action', 'update_staff');
        data.append('pin', user.pin);
        data.append('profile_pic', file);

        try {
            const response = await api.post('', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.result === 'success') {
                toast.success("Profile picture updated!");
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

    if (isAdmin) {
        return (
            <div className="space-y-8 pb-32">
                <header className="flex justify-between items-center px-4">
                    <h1 className="text-2xl font-black text-[#1A181E] tracking-tight">Admin Profile</h1>
                    <div className="bg-asana-teal/10 text-asana-teal px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-asana-teal/20 shadow-sm">
                        Console Access
                    </div>
                </header>

                <div className="bg-white p-8 rounded-[40px] flex flex-col items-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white">
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-asana-teal/5 to-transparent" />
                    <div className="w-24 h-24 rounded-[32px] bg-asana-teal text-white flex items-center justify-center text-3xl font-black mb-4 relative z-10 shadow-xl shadow-asana-teal/20">
                        {user?.name?.charAt(0) || "A"}
                    </div>
                    <h2 className="text-2xl font-black text-[#1A181E] relative z-10 tracking-tight">{user?.name}</h2>
                    <p className="text-[10px] text-asana-teal font-black tracking-[0.2em] uppercase opacity-80 mt-1">Super Admin</p>
                </div>

                <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white overflow-hidden p-2">
                    <DetailRow icon={<Phone size={18} />} label="Security Contact" value={user?.phone || '---'} />
                    <DetailRow icon={<Lock size={18} />} label="Access PIN" value={`****${user?.pin?.slice(-1) || ''}`} />
                </div>

                <div className="px-2">
                    <Button 
                        variant="secondary" 
                        className="w-full h-16 rounded-[28px] bg-red-50 text-red-500 border-none hover:bg-red-500 hover:text-white transition-all font-black tracking-widest shadow-sm active:scale-95 flex items-center justify-center gap-3"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} /> CLOSE SESSION
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-32">
            <header className="flex justify-between items-center px-4">
                <h1 className="text-2xl font-black text-[#1A181E] tracking-tight">My Identity</h1>
                <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`px-6 h-12 rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm
                        ${isEditing ? 'bg-asana-teal text-white shadow-asana-teal/20' : 'bg-white text-[#1A181E] border border-gray-100'}`}
                >
                    {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
                    {isEditing ? "Save Identity" : "Edit Profile"}
                </button>
            </header>

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

                {isEditing ? (
                    <input 
                        className="text-2xl font-black text-[#1A181E] text-center bg-gray-50 rounded-xl px-4 py-1 outline-none focus:ring-2 focus:ring-asana-teal/20 w-full max-w-[250px]"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                ) : (
                    <h2 className="text-2xl font-black text-[#1A181E] relative z-10 tracking-tight">{user?.name}</h2>
                )}
                
                <div className="flex items-center gap-2 mt-2 relative z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-asana-teal animate-pulse" />
                    <p className="text-[10px] text-asana-teal font-black tracking-[0.2em] uppercase opacity-80">{user?.designation || user?.role}</p>
                </div>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-start">
                <div className="space-y-8">
                    <SectionTitle title="Core Identity" />
                    <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white overflow-hidden p-2">
                        <DetailRow icon={<Shield size={18} />} label="Employee ID" value={user?.id || '---'} />
                        <EditableRow icon={<Phone size={18} />} label="Phone Number" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<Mail size={18} />} label="Official Email" name="email" value={formData.email} isEditing={isEditing} onChange={handleChange} />
                        <DetailRow icon={<Lock size={18} />} label="Access PIN" value={user?.pin || '---'} />
                        <DetailRow icon={<Calendar size={18} />} label="Member Since" value={user?.created_at || user?.crested || '---'} />
                    </div>

                    <SectionTitle title="Personal Info" />
                    <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white overflow-hidden p-2">
                        <EditableRow icon={<Droplets size={18} />} label="Blood Group" name="blood_group" value={formData.blood_group} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<Globe size={18} />} label="Country" name="country" value={formData.country} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<MapPin size={18} />} label="State" name="state" value={formData.state} isEditing={isEditing} onChange={handleChange} />
                    </div>
                </div>

                <div className="space-y-8 mt-8 lg:mt-0">
                    <SectionTitle title="Professional Stats" />
                    <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white overflow-hidden p-2">
                        <EditableRow icon={<Building size={18} />} label="Department" name="department" value={formData.department} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<Briefcase size={18} />} label="Designation" name="designation" value={formData.designation} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<Layers size={18} />} label="Employee Type" name="employee_type" value={formData.employee_type} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<Calendar size={18} />} label="Joining Date" name="joining_date" value={formData.joining_date} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<Award size={18} />} label="Experience" name="experience" value={formData.experience} isEditing={isEditing} onChange={handleChange} />
                    </div>

                    <SectionTitle title="Financial & KYC" />
                    <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white overflow-hidden p-2">
                        <EditableRow icon={<Landmark size={18} />} label="Bank Name" name="bank_name" value={formData.bank_name} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<CreditCard size={18} />} label="Account Number" name="account_number" value={formData.account_number} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<Layers size={18} />} label="IFSC Code" name="ifsc_code" value={formData.ifsc_code} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<FileCheck size={18} />} label="Aadhar Number" name="adhar_number" value={formData.adhar_number} isEditing={isEditing} onChange={handleChange} />
                        <EditableRow icon={<FileText size={18} />} label="PAN Number" name="pan_number" value={formData.pan_number} isEditing={isEditing} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <SectionTitle title="Documents" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 overflow-x-hidden">
                <DocumentCard label="Aadhar Front" value={user?.adhar_front} />
                <DocumentCard label="PAN Front" value={user?.pan_front} />
            </div>


            <div className="px-4 py-8">
                <Button 
                    variant="secondary" 
                    className="w-full h-16 rounded-[28px] bg-red-50 text-red-500 border-none hover:bg-red-500 hover:text-white transition-all font-black tracking-widest shadow-sm active:scale-95 flex items-center justify-center gap-3"
                    onClick={handleLogout}
                >
                    <LogOut size={20} /> CLOSE SESSION
                </Button>
            </div>
            
            <div className="text-center space-y-1 pb-12">
                <p className="text-[9px] text-[#8E8E93] uppercase font-black tracking-[0.3em] opacity-40">Secure Identity Module • V3.5</p>
                <p className="text-[8px] text-[#8E8E93] opacity-20 uppercase font-bold tracking-widest">Employee: {user?.id} • {user?.role}</p>
            </div>
        </div>
    );
};

const SectionTitle = ({ title }) => (
    <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.25em] ml-8 mb-4">{title}</p>
);

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between p-6 border-b border-[#F8FAFF] last:border-0 hover:bg-[#F8FAFF]/50 transition-colors group">
        <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-[20px] bg-[#F8FAFF] text-[#8E8E93] flex items-center justify-center group-hover:bg-asana-teal/10 group-hover:text-asana-teal transition-all">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest opacity-60 leading-none mb-1.5">{label}</p>
                <p className="text-[15px] font-bold text-[#1A181E] tracking-tight leading-none">{value || '---'}</p>
            </div>
        </div>
        <ChevronRight size={14} className="text-[#8E8E93]/20" />
    </div>
);

const EditableRow = ({ icon, label, name, value, isEditing, onChange }) => (
    <div className="flex items-center justify-between p-6 border-b border-[#F8FAFF] last:border-0 hover:bg-[#F8FAFF]/50 transition-colors group">
        <div className="flex items-center gap-5 flex-1">
            <div className="w-12 h-12 rounded-[20px] bg-[#F8FAFF] text-[#8E8E93] flex items-center justify-center group-hover:bg-asana-teal/10 group-hover:text-asana-teal transition-all">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest opacity-60 leading-none mb-1.5">{label}</p>
                {isEditing ? (
                    <input 
                        className="w-full text-[15px] font-bold text-[#1A181E] tracking-tight leading-none bg-gray-50 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-asana-teal/10 border-none"
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                    />
                ) : (
                    <p className="text-[15px] font-bold text-[#1A181E] tracking-tight leading-none">{value || '---'}</p>
                )}
            </div>
        </div>
        {isEditing && <div className="w-2 h-2 rounded-full bg-asana-teal animate-pulse" />}
    </div>
);

const DocumentCard = ({ label, value }) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-asana-teal/5 text-asana-teal flex items-center justify-center">
            <FileText size={20} />
        </div>
        <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest">{label}</p>
        <div className="w-full aspect-video bg-[#F8FAFF] rounded-xl flex items-center justify-center overflow-hidden border border-dashed border-gray-200">
            {value ? (
                <img src={`${API_UPLOADS}${value}`} className="w-full h-full object-cover" />
            ) : (
                <p className="text-[8px] font-bold text-[#8E8E93]/40">NO PREVIEW</p>
            )}
        </div>
    </div>
);

export default Profile;
