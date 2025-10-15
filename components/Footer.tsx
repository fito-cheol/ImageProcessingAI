import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Define the interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const ManualInstallPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-white max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">{t('iosInstallPromptTitle')}</h3>
                <p className="text-gray-300 mb-6">{t('iosInstallPromptBody')}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    {t('iosInstallPromptClose')}
                </button>
            </div>
        </div>
    );
};


export const Footer: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [showManualPopup, setShowManualPopup] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        
        if (isMobile && !isInStandaloneMode) {
            setShowInstallButton(true);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (installPrompt) {
            await installPrompt.prompt();
            // The userChoice property returns a Promise that resolves to an object containing the outcome of the user's choice.
            const { outcome } = await installPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            // We can only use the prompt once.
            setInstallPrompt(null);
        } else {
            // If no native prompt is available, show manual instructions.
            setShowManualPopup(true);
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ko' : 'en');
    };

    return (
        <>
            <footer className="text-center py-6 text-gray-500 text-sm">
                <div className="flex justify-center items-center gap-4">
                    <button onClick={toggleLanguage} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        {language === 'en' ? '한국어로 변경' : 'Switch to English'}
                    </button>

                    {showInstallButton && (
                        <>
                            <span className="text-gray-600">|</span>
                            <button 
                                onClick={handleInstallClick} 
                                className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                                title={t('installAppTitle')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {t('installAppButton')}
                            </button>
                        </>
                    )}
                </div>
            </footer>
            {showManualPopup && <ManualInstallPopup onClose={() => setShowManualPopup(false)} />}
        </>
    );
};