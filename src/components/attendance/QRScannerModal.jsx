import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QRScannerModal = ({ isOpen, onClose, onScan, title = "Scan QR Code" }) => {
    const [scanResult, setScanResult] = useState(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        if (isOpen && !scanResult) {
            // Small timeout to ensure DOM is ready
            const timer = setTimeout(() => {
                const scanner = new Html5QrcodeScanner(
                    "reader",
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    /* verbose= */ false
                );

                scanner.render(
                    (decodedText) => {
                        scanner.clear();
                        setScanResult(decodedText);
                        onScan(decodedText);
                    },
                    (error) => {
                         // console.warn(error);
                    }
                );
                scannerRef.current = scanner;
            }, 100);

            return () => {
                clearTimeout(timer);
                if (scannerRef.current) {
                    try {
                        scannerRef.current.clear();
                    } catch (e) {
                        // ignore cleanup errors
                    }
                }
            };
        }
    }, [isOpen, scanResult, onScan]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4"
                >
                    <div className="w-full max-w-md relative glass-card p-4 rounded-3xl flex flex-col items-center">
                        <div className="w-full flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">{title}</h3>
                            <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="w-full aspect-square bg-black rounded-2xl overflow-hidden relative">
                            <div id="reader" className="w-full h-full" />
                        </div>
                        
                        <p className="text-sm text-white/50 mt-4 text-center">
                            Point your camera at the Store QR Code
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QRScannerModal;
