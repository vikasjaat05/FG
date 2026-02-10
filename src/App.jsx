import { useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from 'react';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Profile from "./pages/Profile";
import AddStaff from "./pages/AddStaff";
import Messages from "./pages/Messages";
import MobileLayout from "./components/layout/MobileLayout";
import SplashScreen from "./components/ui/SplashScreen";
import useAuthStore from "./store/authStore";
import useThemeStore from "./store/themeStore";
import useAutoLogout from "./hooks/useAutoLogout";

const NotFound = () => <div className="p-8 text-center text-red-400">404 - Page Not Found</div>;

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Component to wrap the app and handle hooks that need router context or auth checks
const AppContent = () => {
    const { init } = useThemeStore();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => { init(); }, []);
    useAutoLogout(5 * 60 * 1000); // 5 minutes inactivity timeout
    
    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="leaves" element={<Leaves />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="add-staff" element={<AddStaff />} />
                    <Route path="messages" element={<Messages />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster 
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#FFFFFF',
                        color: '#1d1d1f',
                        border: '1px solid rgba(0,0,0,0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        padding: '16px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.08)'
                    },
                }}
            />
        </>
    );
};

function App() {
  return (
      <BrowserRouter>
          <AppContent />
      </BrowserRouter>
  );
}

export default App;
