import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ChevronLeft, Search, MoreVertical, Paperclip, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const API_UPLOADS = 'https://portal.flaneurglobal.com/api/uploads/';

const Messages = () => {
    const { user, staffList } = useAuthStore();
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const navigate = useNavigate();
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const contacts = isAdmin 
        ? staffList.filter(s => s.role !== 'admin')
        : staffList.filter(s => s.role === 'admin');

    useEffect(() => {
        if (selectedContact) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedContact]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await api.get(`?pin=${user.pin}&action=get_messages&with=${selectedContact.id}`);
            if (response.data.messages) {
                setMessages(response.data.messages);
            }
        } catch (err) {
            console.error("Message fetch failed", err);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || !selectedContact) return;
        
        try {
            const response = await api.post('', {
                action: 'send_message',
                pin: user.pin,
                to: selectedContact.id,
                message: input.trim()
            });

            if (response.data.result === 'success') {
                setMessages([...messages, { 
                    sender_id: user.id, 
                    message: input.trim(), 
                    timestamp: new Date().toISOString() 
                }]);
                setInput("");
            }
        } catch (err) {
            toast.error("Failed to send message");
        }
    };

    if (!selectedContact) {
        return (
            <div className="min-h-screen bg-[#F8FAFF] pb-32">
                <header className="p-6 bg-white border-b border-gray-100/50 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#8E8E93]"><ChevronLeft size={24} /></button>
                        <h1 className="text-xl font-black text-[#1A181E] tracking-tight">Messages</h1>
                    </div>
                </header>

                <div className="p-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]/40" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search contacts..." 
                            className="w-full h-14 bg-white rounded-2xl pl-12 pr-6 text-sm font-medium border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-asana-teal/20 transition-all"
                        />
                    </div>

                    <div className="space-y-3">
                        {contacts.map((contact, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedContact(contact)}
                                className="bg-white p-4 rounded-[24px] flex items-center justify-between shadow-sm active:scale-[0.98] transition-all border border-transparent hover:border-asana-teal/10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-asana-teal/5 flex items-center justify-center text-asana-teal font-black border border-asana-teal/10 overflow-hidden relative shadow-inner">
                                        {contact.profile_pic ? (
                                            <img src={`${API_UPLOADS}${contact.profile_pic}`} alt={contact.name} className="w-full h-full object-cover" />
                                        ) : (
                                            contact.name.charAt(0)
                                        )}
                                        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-[#1A181E] tracking-tight">{contact.name}</p>
                                        <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest opacity-60">
                                            {contact.designation || (contact.role === 'admin' ? 'Support HQ' : 'Staff')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 opacity-60">
                                    <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-tighter">Online</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {contacts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-4">
                                <MessageSquare className="text-asana-teal/20" size={32} />
                            </div>
                            <p className="text-sm font-black text-[#8E8E93] uppercase tracking-widest opacity-40">No threads active</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-[#F8FAFF] flex flex-col pt-safe">
            <header className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedContact(null)} className="p-2 -ml-2 text-[#8E8E93]"><ChevronLeft size={24} /></button>
                    <div className="w-10 h-10 rounded-xl bg-asana-teal/5 border border-asana-teal/10 flex items-center justify-center font-black text-asana-teal overflow-hidden shadow-inner">
                        {selectedContact.profile_pic ? (
                            <img src={`${API_UPLOADS}${selectedContact.profile_pic}`} alt={selectedContact.name} className="w-full h-full object-cover" />
                        ) : (
                            selectedContact.name.charAt(0)
                        )}
                    </div>
                    <div>
                        <h2 className="text-base font-black text-[#1A181E] leading-none mb-1">{selectedContact.name}</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest">Active Now</span>
                        </div>
                    </div>
                </div>
                <button className="p-2 text-[#8E8E93]"><MoreVertical size={20} /></button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                            <MessageSquare className="text-asana-teal" size={24} />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest">Start of end-to-end encrypted chat</p>
                    </div>
                ) : (
                    messages.map((m, i) => {
                        const isMe = m.sender_id === user.id;
                        return (
                            <motion.div 
                                key={i}
                                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                className={cn(
                                    "max-w-[80%] p-4 rounded-[24px] shadow-sm relative",
                                    isMe ? "bg-asana-teal text-white ml-auto rounded-tr-none shadow-asana-teal/20" : "bg-white text-[#1A181E] mr-auto rounded-tl-none"
                                )}
                            >
                                <p className="text-sm font-medium tracking-tight leading-relaxed">{m.message}</p>
                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-widest mt-2 block",
                                    isMe ? "text-white/60" : "text-[#8E8E93]"
                                )}>
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </motion.div>
                        )
                    })
                )}
                <div ref={scrollRef} />
            </div>

            <div className="p-6 bg-white border-t border-gray-100 flex items-center gap-3">
                <button className="p-3 bg-[#F8FAFF] rounded-2xl text-[#8E8E93] active:scale-95 transition-all"><Paperclip size={20} /></button>
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full h-14 bg-[#F8FAFF] rounded-[24px] px-6 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-asana-teal/20 transition-all"
                    />
                    <button 
                        onClick={handleSendMessage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-asana-teal text-white rounded-2xl flex items-center justify-center shadow-lg shadow-asana-teal/30 active:scale-95 transition-all disabled:opacity-50"
                        disabled={!input.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Messages;

// Temporary helper for Tailwind classes in JS if utils/cn is missing or different
import { cn } from '../utils/cn';
