import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ChevronLeft, Search, MoreVertical, Paperclip, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const API_UPLOADS = 'https://portal.flaneurglobal.com/api/uploads/';

const Messages = () => {
    const { user, staffList } = useAuthStore();
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const navigate = useNavigate();
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const scrollRef = useRef(null);

    const contacts = (staffList || []).filter(s => {
        const matchesSearch = (s.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const isNotMe = String(s.id) !== String(user.id) && String(s.pin) !== String(user.pin);
        return matchesSearch && isNotMe;
    });

    useEffect(() => {
        if (selectedContact) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 4000);
            return () => clearInterval(interval);
        }
    }, [selectedContact]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await api.get(`?pin=${user.pin}&action=get_messages&with=${selectedContact.id}`);
            if (response.data.messages) setMessages(response.data.messages);
        } catch (err) { console.error(err); }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || !selectedContact) return;
        const tempMsg = input.trim();
        setInput("");
        try {
            const response = await api.post('', {
                action: 'send_message',
                pin: user.pin,
                to: selectedContact.id,
                message: tempMsg
            });
            if (response.data.result === 'success') {
                setMessages(prev => [...prev, { 
                    sender_id: user.id || user.pin, 
                    message: tempMsg, 
                    timestamp: new Date().toISOString() 
                }]);
            } else {
                toast.error(response.data.message || "Failed");
                setInput(tempMsg);
            }
        } catch (err) { toast.error("Error"); setInput(tempMsg); }
    };

    return (
        <div className="flex bg-white rounded-[40px] shadow-sm border border-white overflow-hidden h-[calc(100vh-160px)] min-h-[500px]">
            {/* Contacts Sidebar (Visible on all, hidden on mobile if contact selected) */}
            <div className={cn(
                "w-full lg:w-96 flex flex-col border-r border-gray-100",
                selectedContact ? "hidden lg:flex" : "flex"
            )}>
                <div className="p-6 border-b border-gray-100/50">
                    <h1 className="text-xl font-black text-[#1A181E] tracking-tight mb-4">Messaging</h1>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]/40 group-focus-within:text-asana-teal transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 bg-[#F8FAFF] rounded-2xl pl-12 pr-6 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-asana-teal/10 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {contacts.map((contact, i) => (
                        <div 
                            key={i}
                            onClick={() => setSelectedContact(contact)}
                            className={cn(
                                "p-4 rounded-[24px] flex items-center gap-4 cursor-pointer transition-all border border-transparent",
                                selectedContact?.id === contact.id ? "bg-asana-teal/5 border-asana-teal/10 shadow-sm" : "hover:bg-[#F8FAFF]"
                            )}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-asana-teal/5 flex items-center justify-center text-asana-teal font-black border border-asana-teal/10 overflow-hidden relative shadow-inner">
                                {contact.profile_pic ? <img src={`${API_UPLOADS}${contact.profile_pic}`} className="w-full h-full object-cover" /> : contact.name?.charAt(0)}
                                <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-[#1A181E] truncate">{contact.name}</p>
                                <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest opacity-60 truncate">
                                    {contact.designation || contact.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area (Visible on desktop, full-screen on mobile if contact selected) */}
            <div className={cn(
                "flex-1 flex flex-col bg-[#F8FAFF]/30",
                !selectedContact ? "hidden lg:flex items-center justify-center" : "flex"
            )}>
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <header className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedContact(null)} className="lg:hidden p-2 -ml-2 text-[#8E8E93]"><ChevronLeft size={24} /></button>
                                <div className="w-10 h-10 rounded-xl bg-asana-teal/5 border border-asana-teal/10 flex items-center justify-center font-black text-asana-teal overflow-hidden shadow-inner">
                                    {selectedContact.profile_pic ? <img src={`${API_UPLOADS}${selectedContact.profile_pic}`} className="w-full h-full object-cover" /> : selectedContact.name?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-[#1A181E] tracking-tight truncate max-w-[150px] lg:max-w-none">{selectedContact.name}</h2>
                                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Online</span>
                                </div>
                            </div>
                        </header>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.map((m, i) => {
                                const isMe = String(m.sender_id) === String(user.id) || String(m.sender_id) === String(user.pin);
                                return (
                                    <motion.div 
                                        key={i}
                                        initial={{ scale: 0.9, opacity: 0, y: 10 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        className={cn(
                                            "max-w-[75%] p-4 rounded-[28px] shadow-sm relative",
                                            isMe ? "bg-asana-teal text-white ml-auto rounded-tr-none shadow-lg shadow-asana-teal/10" : "bg-white text-[#1A181E] mr-auto rounded-tl-none border border-[#F8FAFF]"
                                        )}
                                    >
                                        <p className="text-sm font-semibold tracking-tight">{m.message}</p>
                                        <span className={cn("text-[8px] font-black uppercase tracking-widest mt-2 block opacity-50 text-right", isMe ? "text-white" : "text-[#8E8E93]")}>
                                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </motion.div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-gray-100 flex items-center gap-3">
                            <button className="hidden sm:block p-3 bg-[#F8FAFF] rounded-2xl text-[#8E8E93]"><Paperclip size={20} /></button>
                            <div className="flex-1 relative">
                                <input 
                                    type="text" 
                                    placeholder="Message..." 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="w-full h-14 bg-[#F8FAFF] rounded-[24px] px-6 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-asana-teal/10 transition-all"
                                />
                                <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-asana-teal text-white rounded-[18px] flex items-center justify-center shadow-lg active:scale-95 transition-all">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center opacity-40">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
                            <MessageSquare className="text-asana-teal" size={32} />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8E8E93]">Select a conversation to start chat</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
