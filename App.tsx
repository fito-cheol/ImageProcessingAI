import React, { useState } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import { ServiceSelector } from './components/ServiceSelector';
import { FigureFusionApp } from './FigureFusionApp';
import { TryOnApp } from './TryOnApp';

const App: React.FC = () => {
    const [service, setService] = useState<'figure' | 'try-on' | null>(null);
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ko' : 'en');
    };

    if (!service) {
        return (
            <div className="min-h-screen bg-gray-900 text-white font-sans antialiased flex flex-col">
                <main className="container mx-auto px-4 py-8 md:py-12 flex-grow flex flex-col items-center justify-center">
                    <ServiceSelector onSelect={setService} />
                </main>
                <footer className="text-center py-6 text-gray-500 text-sm">
                    <button onClick={toggleLanguage} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        {language === 'en' ? '한국어로 변경' : 'Switch to English'}
                    </button>
                </footer>
            </div>
        );
    }
    
    const renderBackButton = () => (
        <button 
            onClick={() => setService(null)} 
            className="absolute top-5 left-5 text-gray-400 hover:text-white transition-colors z-20 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70"
            aria-label={t('backButtonLabel')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
    );
    
    return (
        <div className="relative">
            {renderBackButton()}
            {service === 'figure' && <FigureFusionApp />}
            {service === 'try-on' && <TryOnApp />}
        </div>
    );
};

export default App;
