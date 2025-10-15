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

const IOSInstallPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-white max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">{t('iosInstallPromptTitle')}</h3>
                <p className="text-gray-300 mb-6">{t('iosInstallPromptBody')}</p>
                <div className="flex justify-center items-center gap-4 text-gray-400 mb-6">
                    <span className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="text-xs mt-1 block">{t('iosShareIconLabel')}</span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    <span className="text-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs mt-1 block">{t('iosAddHomeScreenIconLabel')}</span>
                    </span>
                </div>

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
    const [canShowIOSInstall, setCanShowIOSInstall] = useState(false);
    const [showIOSPopup, setShowIOSPopup] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        
        if (isAppleDevice && !isInStandaloneMode) {
            setCanShowIOSInstall(true);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) {
            return;
        }
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

                    {installPrompt && (
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
                    
                    {canShowIOSInstall && !installPrompt && (
                         <>
                            <span className="text-gray-600">|</span>
                            <button 
                                onClick={() => setShowIOSPopup(true)} 
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
            {showIOSPopup && <IOSInstallPopup onClose={() => setShowIOSPopup(false)} />}
        </>
    );
};
