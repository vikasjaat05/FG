import { useState } from 'react';
import { 
    ArrowLeft, Save, User, Phone, Mail, Building, ShieldCheck, 
    ChevronLeft, Droplets, Globe, MapPin, Briefcase, Calendar, 
    Layers, Award, Landmark, CreditCard, FileCheck, FileText 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
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
        country: 'India',
        blood_group: '',
        exp: '',
        bank_name: '',
        bank_acc: '',
        ifsc: '',
        adhar: '',
        pan: '',
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
                pin: user.pin, // Admin PIN
                newCode: formData.pin,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                dob: formData.dob,
                dept: formData.dept,
                desig: formData.desig,
                type: formData.type,
                join: formData.join,
                state: formData.state,
                country: formData.country,
                blood_group: formData.blood_group,
                exp: formData.exp,
                bank_name: formData.bank_name,
                bank_account: formData.bank_acc,
                ifsc_code: formData.ifsc,
                adhar_number: formData.adhar,
                pan_number: formData.pan
            });

            if (response.data.result === 'success') {
                toast.success("Employee Record Created!");
                navigate('/dashboard');
            } else {
                toast.error(response.data.message || "Failed to create identity");
            }
        } catch (err) {
            toast.error("Network or Backend Error");
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
                <h1 className="text-2xl font-black text-[#1A181E] tracking-tight">Add New Staff</h1>
            </header>

            <form onSubmit={handleSave} className="space-y-8 px-1">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-start">
                    <div className="space-y-8">
                        {/* 1. Personal Identity */}
                        <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white">
                            <SectionHeader title="Core Identity" />
                            <div className="space-y-5">
                                <PremiumInput label="Full Name" name="name" placeholder="Legal Name" value={formData.name} onChange={handleChange} icon={<User size={18} />} />
                                <PremiumInput label="Contact" name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} icon={<Phone size={18} />} />
                                <PremiumInput label="Email Address" name="email" placeholder="official@flaneur.com" value={formData.email} onChange={handleChange} icon={<Mail size={18} />} />
                                <PremiumInput label="Login PIN" name="pin" placeholder="Access Code" type="password" value={formData.pin} onChange={handleChange} icon={<ShieldCheck size={18} className="text-asana-teal" />} />
                            </div>
                        </div>

                        {/* 2. Professional Details */}
                        <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white">
                            <SectionHeader title="Professional Matrix" />
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest ml-4">Department</label>
                                    <select name="dept" className="w-full h-14 bg-[#F8FAFF] border-none rounded-[24px] px-6 text-sm font-medium outline-none shadow-inner" value={formData.dept} onChange={handleChange}>
                                        <option>Sales</option><option>Design</option><option>Tech</option><option>HR</option><option>Operations</option>
                                    </select>
                                </div>
                                <PremiumInput label="Designation" name="desig" placeholder="Role Title" value={formData.desig} onChange={handleChange} icon={<Briefcase size={18} />} />
                                <PremiumInput label="Employee Type" name="type" placeholder="Full-Time / Intern" value={formData.type} onChange={handleChange} icon={<Layers size={18} />} />
                                <PremiumInput label="Joining Date" name="join" type="date" value={formData.join} onChange={handleChange} icon={<Calendar size={18} />} />
                                <PremiumInput label="Experience" name="exp" placeholder="e.g. 2 Years" value={formData.exp} onChange={handleChange} icon={<Award size={18} />} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 mt-8 lg:mt-0">
                        {/* 3. Personal Info */}
                        <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white">
                            <SectionHeader title="Geographics & Bio" />
                            <div className="space-y-5">
                                <PremiumInput label="Blood Group" name="blood_group" placeholder="B+ / O-" value={formData.blood_group} onChange={handleChange} icon={<Droplets size={18} />} />
                                <PremiumInput label="Country" name="country" value={formData.country} onChange={handleChange} icon={<Globe size={18} />} />
                                <PremiumInput label="State" name="state" placeholder="Work Location" value={formData.state} onChange={handleChange} icon={<MapPin size={18} />} />
                                <PremiumInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} icon={<Calendar size={18} />} />
                            </div>
                        </div>

                        {/* 4. Financial & KYC */}
                        <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white">
                            <SectionHeader title="Financial & KYC" />
                            <div className="space-y-5">
                                <PremiumInput label="Bank Name" name="bank_name" placeholder="SBI / HDFC" value={formData.bank_name} onChange={handleChange} icon={<Landmark size={18} />} />
                                <PremiumInput label="Account Number" name="bank_acc" placeholder="1234 5678 9012" value={formData.bank_acc} onChange={handleChange} icon={<CreditCard size={18} />} />
                                <PremiumInput label="IFSC Code" name="ifsc" placeholder="SBIN000..." value={formData.ifsc} onChange={handleChange} icon={<ShieldCheck size={18} />} />
                                <PremiumInput label="Aadhar Number" name="adhar" placeholder="Unique ID" value={formData.adhar} onChange={handleChange} icon={<FileCheck size={18} />} />
                                <PremiumInput label="PAN Number" name="pan" placeholder="Tax ID" value={formData.pan} onChange={handleChange} icon={<FileText size={18} />} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-2 max-w-2xl mx-auto lg:mt-12">
                    <Button type="submit" className="w-full h-[72px] rounded-[28px] bg-asana-teal font-black tracking-tight shadow-xl shadow-asana-teal/20 text-lg flex gap-3 active:scale-95 transition-all justify-center" disabled={loading}>
                        {loading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={24} />}
                        {loading ? "Syncing Identity..." : "Finalize Profile"}
                    </Button>
                </div>
            </form>

        </div>
    );
};

const SectionHeader = ({ title }) => (
    <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-asana-teal" />
        <h3 className="text-[10px] font-black text-[#1A181E] uppercase tracking-[0.2em]">{title}</h3>
    </div>
);

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
