import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Clock, Calendar, User, PlusCircle, MessageSquare } from 'lucide-react';
import { cn } from '../../utils/cn';
import useAuthStore from '../../store/authStore';
import { motion } from 'framer-motion';

const MobileLayout = () => {
    const { user } = useAuthStore();
    const isAdmin = user?.role?.toLowerCase() === 'admin';

    return (
        <div className="min-h-screen bg-[#F8FAFF] pb-32 relative overflow-hidden transition-colors duration-400">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-asana-teal/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-asana-teal/5 rounded-full blur-[100px]" />
            </div>

            {/* Content Area */}
            <div className="relative z-10 p-5 pt-6">
                <Outlet />
            </div>

            {/* Bottom Navigation (5-item refined pill) */}
            <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-[35px] flex justify-between items-center px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white/50 ring-1 ring-black/5">
                    {isAdmin ? (
                        <>
                            <NavItem to="/dashboard" icon={<Home size={22} />} label="Home" />
                            <NavItem to="/add-staff" icon={<PlusCircle size={22} />} label="Add" />
                            <NavItem to="/messages" icon={<MessageSquare size={22} />} label="Inbox" />
                            <NavItem to="/profile" icon={<User size={22} />} label="Settings" />
                        </>
                    ) : (
                        <>
                            <NavItem to="/dashboard" icon={<Home size={22} />} label="Home" />
                            <NavItem to="/attendance" icon={<Clock size={22} />} label="Punch" />
                            <NavItem to="/messages" icon={<MessageSquare size={22} />} label="Chat" />
                            <NavItem to="/leaves" icon={<Calendar size={22} />} label="Leaves" />
                            <NavItem to="/profile" icon={<User size={22} />} label="Profile" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink 
        to={to} 
        className={({ isActive }) => cn(
            "flex flex-col items-center justify-center w-full transition-all duration-300 relative",
            isActive ? "text-asana-teal" : "text-[#8E8E93]/40"
        )}
    >
        {({ isActive }) => (
            <>
                <motion.div 
                    animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                    className="relative transition-all duration-300 mb-1.5"
                >
                    {icon}
                    {label === "Inbox" || label === "Chat" ? (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    ) : null}
                </motion.div>
                <span className={cn(
                    "text-[8px] font-black uppercase tracking-[0.2em] transition-all",
                    isActive ? "opacity-100" : "opacity-100"
                )}>
                    {label}
                </span>
                
                {isActive && (
                    <motion.div 
                        layoutId="nav-dot"
                        className="absolute -bottom-1.5 w-1 h-1 bg-asana-teal rounded-full" 
                    />
                )}
            </>
        )}
    </NavLink>
);

export default MobileLayout;
