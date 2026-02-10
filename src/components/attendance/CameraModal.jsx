import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../ui/Button';
import { X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
};

const CameraModal = ({ isOpen, onClose, onCapture, title = "Verification" }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
    };

    const confirm = () => {
        if (imgSrc) {
            onCapture(imgSrc);
            onClose();
        }
    };

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

                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border-2 border-white/20 mb-6 group">
                            {imgSrc ? (
                                <img src={imgSrc} alt="Captured" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={videoConstraints}
                                        className="w-full h-full object-cover mirror"
                                    />
                                    {/* Face Guide Overlay */}
                                    <div className="absolute inset-0 border-[3px] border-dashed border-white/30 rounded-full scale-75 pointer-events-none opacity-50" />
                                </>
                            )}
                        </div>

                        <div className="flex gap-4 w-full">
                            {!imgSrc ? (
                                <Button className="w-full" onClick={capture}>
                                    <Camera className="mr-2" size={20} /> Capture
                                </Button>
                            ) : (
                                <>
                                    <Button variant="secondary" className="flex-1" onClick={retake}>
                                        Retake
                                    </Button>
                                    <Button className="flex-1" onClick={confirm}>
                                        Confirm
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CameraModal;
