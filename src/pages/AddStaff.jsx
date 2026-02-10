import { useState } from 'react';
import { ArrowLeft, Save, User, Phone, Mail, Building, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddStaff = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        dob: '',
        dept: 'Sales',
        desig: '',
        type: 'Full-Time',
        join: '',
        state: '',
        exp: '',
        pin: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.pin) {
            return toast.error("Name and PIN are mandatory!");
        }

        setLoading(true);
        try {
            const response = await api.post('', {
                action: 'add_staff',
                pin: user.pin, // Authorizing with Admin PIN
                newCode: formData.pin, // The new PIN for the employee
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                dob: formData.dob,
                dept: formData.dept,
                desig: formData.desig,
                type: formData.type,
                join: formData.join,
                state: formData.state,
                exp: formData.exp
            });

            if (response.data.result === 'success') {
                toast.success("Employee Created Successfully!");
                navigate('/dashboard');
            } else {
                toast.error(response.data.message || "Failed to create profile");
            }
        } catch (err) {
            toast.error("Network or Server Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-32">
            <header className="flex items-center gap-4 px-2">
                <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm text-[#8E8E93] active:scale-95 transition-all outline-none">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-black text-[#1A181E] tracking-tight">Access Control</h1>
            </header>

            <form onSubmit={handleSave} className="space-y-8 px-1">
                <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-asana-teal" />
                        <h3 className="text-[10px] font-black text-[#1A181E] uppercase tracking-[0.2em]">Primary Identification</h3>
                    </div>
                    
                    <div className="space-y-5">
                        <PremiumInput 
                            label="Full Name" 
                            name="name" 
                            placeholder="Employee Name"
                            value={formData.name} 
                            onChange={handleChange} 
                            icon={<User size={18} />} 
                        />
                        <PremiumInput 
                            label="Contact" 
                            name="phone" 
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.phone} 
                            onChange={handleChange} 
                            icon={<Phone size={18} />} 
                        />
                        <PremiumInput 
                            label="Email" 
                            name="email" 
                            placeholder="staff@flaneur.com"
                            value={formData.email} 
                            onChange={handleChange} 
                            icon={<Mail size={18} />} 
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-asana-teal" />
                        <h3 className="text-[10px] font-black text-[#1A181E] uppercase tracking-[0.2em]">Work Designation</h3>
                    </div>
                    
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest ml-4">Department</label>
                            <select 
                                name="dept" 
                                className="w-full h-14 bg-[#F8FAFF] border-none rounded-[24px] px-6 text-sm font-medium outline-none shadow-inner"
                                value={formData.dept}
                                onChange={handleChange}
                            >
                                <option>Sales</option>
                                <option>Design</option>
                                <option>Tech</option>
                                <option>HR</option>
                                <option>Operations</option>
                            </select>
                        </div>
                        <PremiumInput 
                            label="Designation" 
                            name="desig" 
                            placeholder="Software Engineer"
                            value={formData.desig} 
                            onChange={handleChange} 
                            icon={<Building size={18} />} 
                        />
                        <PremiumInput 
                            label="Login PIN" 
                            name="pin" 
                            placeholder="4-Digit Code"
                            type="password"
                            value={formData.pin} 
                            onChange={handleChange} 
                            icon={<ShieldCheck size={18} className="text-asana-teal" />} 
                        />
                    </div>
                </div>

                <div className="px-2">
                    <Button 
                        type="submit" 
                        className="w-full h-[72px] rounded-[28px] bg-asana-teal font-black tracking-tight shadow-xl shadow-asana-teal/20 text-lg flex gap-3 active:scale-95 transition-all"
                        disabled={loading}
                    >
                        {loading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={24} />}
                        {loading ? "Registering..." : "Create Identity"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

const PremiumInput = ({ label, name, placeholder, value, onChange, icon, type = "text" }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest ml-4 group-focus-within:text-asana-teal transition-colors">{label}</label>
        <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8E8E93]/40 group-focus-within:text-asana-teal transition-colors">
                {icon}
            </div>
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-14 bg-[#F8FAFF] border-transparent focus:bg-white focus:ring-2 focus:ring-asana-teal/10 rounded-[24px] pl-14 pr-6 text-sm font-medium text-[#1A181E] shadow-inner transition-all outline-none"
            />
        </div>
    </div>
);

export default AddStaff;
