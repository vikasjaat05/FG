import { useEffect, useRef } from 'react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const useAutoLogout = (timeoutMs = 300000) => { // 5 minutes default
    const { logout, isAuthenticated } = useAuthStore();
    const timerRef = useRef(null);

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            if (isAuthenticated) {
                logout();
                toast.error("Session expired due to inactivity.");
            }
        }, timeoutMs);
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        
        const handleActivity = () => resetTimer();

        events.forEach(event => window.addEventListener(event, handleActivity));
        
        resetTimer(); // Start timer

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isAuthenticated, logout, timeoutMs]);
};

export default useAutoLogout;
