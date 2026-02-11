import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Clock, Calendar, User, PlusCircle, MessageSquare, LogOut, Shield } from 'lucide-react';
import { cn } from '../../utils/cn';
import useAuthStore from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
    const { user, logout } = useAuthStore();
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const location = useLocation();

    const navItems = isAdmin ? [
        { to: "/dashboard", icon: <Home size={22} />, label: "Dashboard" },
        { to: "/add-staff", icon: <PlusCircle size={22} />, label: "Add Staff" },
        { to: "/messages", icon: <MessageSquare size={22} />, label: "Messages" },
        { to: "/profile", icon: <User size={22} />, label: "Settings" },
    ] : [
        { to: "/dashboard", icon: <Home size={22} />, label: "Home" },
        { to: "/attendance", icon: <Clock size={22} />, label: "Attendance" },
        { to: "/messages", icon: <MessageSquare size={22} />, label: "Chat" },
        { to: "/leaves", icon: <Calendar size={22} />, label: "Leaves" },
        { to: "/profile", icon: <User size={22} />, label: "Profile" },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFF] relative overflow-x-hidden flex flex-col lg:flex-row">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-asana-teal/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-asana-teal/5 rounded-full blur-[100px]" />
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 bg-white border-r border-[#F0F2F5] z-50 p-6">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-asana-teal rounded-xl flex items-center justify-center text-white shadow-lg shadow-asana-teal/20">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-[#1A181E] leading-none">Flâneur</h1>
                        <p className="text-[9px] font-black text-asana-teal uppercase tracking-widest mt-1">Global Portal</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <SidebarNavItem key={item.to} {...item} />
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-[#F0F2F5]">
                    <div className="flex items-center gap-4 p-4 bg-[#F8FAFF] rounded-[24px] mb-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center font-black text-asana-teal text-sm">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-[#1A181E] truncate">{user?.name}</p>
                            <p className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-widest truncate">{user?.role}</p>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-6 py-4 text-[#8E8E93] hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest"
                    >
                        <LogOut size={18} />
                        Logout Session
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 lg:ml-72 min-h-screen">
                <div className="max-w-[1200px] mx-auto w-full p-4 sm:p-6 lg:p-10 pt-6 sm:pt-8 lg:pt-12">
                    <Outlet />
                </div>
                
                {/* Spacer for Bottom Nav on mobile */}
                <div className="h-32 lg:hidden" />
            </main>

            {/* Bottom Navigation (Mobile Only) */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 px-4 pb-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-[35px] flex justify-between items-center px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white/50 ring-1 ring-black/5">
                    {navItems.map((item) => (
                        <BottomNavItem key={item.to} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const SidebarNavItem = ({ to, icon, label }) => (
    <NavLink 
        to={to} 
        className={({ isActive }) => cn(
            "flex items-center gap-4 px-6 py-4 rounded-[22px] transition-all duration-300 font-black text-[11px] uppercase tracking-widest group",
            isActive ? "bg-asana-teal text-white shadow-lg shadow-asana-teal/20" : "text-[#8E8E93] hover:bg-[#F8FAFF] hover:text-[#1A181E]"
        )}
    >
        <span className="transition-transform group-active:scale-90">{icon}</span>
        {label}
    </NavLink>
);

const BottomNavItem = ({ to, icon, label }) => (
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
                    {(label === "Inbox" || label === "Chat" || label === "Messages") ? (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    ) : null}
                </motion.div>
                <span className={cn(
                    "text-[8px] font-black uppercase tracking-[0.2em] transition-all",
                    isActive ? "opacity-100" : "opacity-100"
                )}>
                    {label.split(' ')[0]} {/* Shorten label for bottom nav */}
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

export default MainLayout;
