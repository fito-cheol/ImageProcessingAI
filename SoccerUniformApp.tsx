import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { SoccerUniformOptions, SoccerUniformOptions as SoccerUniformOptionsType } from './components/SoccerUniformOptions';
import { generateSoccerUniform } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { useLanguage } from './contexts/LanguageContext';

const initialUniformOptions: SoccerUniformOptionsType = {
    jersey: {
        mainColor: 'White',
        accentColor: 'Royal Blue',
        pattern: 'None',
        teamLogo: 'Eagle shield',
        sponsorLogo: 'AI Sports',
        playerNumber: '10',
        playerName: 'GEMINI',
        fontStyle: 'Bold',
        neckline: 'V-Neck',
        sleeves: 'Short',
        fit: 'Athletic Cut',
        material: 'Breathable Polyester',
    },
    shorts: {
        mainColor: 'White',
        accentColor: 'Royal Blue',
        pattern: 'Side Stripes',
        teamLogo: true,
        length: 'Mid-thigh',
        waistband: 'Elastic with Drawstring',
        fit: 'Loose Fit',
    },
    render: {
        view: 'Front View',
        style: 'Photorealistic',
        model: 'Model: Standard',
    },
};

export const SoccerUniformApp: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uniformOptions, setUniformOptions] = useState<SoccerUniformOptionsType>(initialUniformOptions);
  const { language, setLanguage, t } = useLanguage();

  const resetState = () => {
      setGeneratedImage(null);
      setError(null);
      setIsLoading(false);
      setUniformOptions(initialUniformOptions);
  };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateSoccerUniform(uniformOptions);
      
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
      } else {
        setError(t('errorGenerate'));
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(`${t('errorTransform')}\n\nDetails: ${e.message}`);
      } else {
        setError(`${t('errorTransform')}\n\nDetails: ${String(e)}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [uniformOptions, t]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ko' : 'en');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased flex flex-col">
      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow flex flex-col">
        <Header titleKey="soccerHeaderTitle" subtitleKey="soccerHeaderSubtitle" />
        
        {isLoading && <Loader />}
        
        <div className="flex-grow w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* --- LEFT PANEL: OPTIONS --- */}
            <div className="w-full lg:w-1/2">
                <SoccerUniformOptions 
                    currentOptions={uniformOptions} 
                    onOptionChange={setUniformOptions} 
                />
            </div>
            
            {/* --- RIGHT PANEL: OUTPUT & ACTIONS --- */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-12 self-start">
                 {error && (
                  <div className="mb-4 text-left bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">{t('errorTitle')}: </strong>
                    <span className="block sm:inline whitespace-pre-wrap">{error}</span>
                  </div>
                )}
            
                <div className="w-full aspect-square rounded-xl bg-gray-800 shadow-lg overflow-hidden relative">
                     {generatedImage && !isLoading ? (
                        <img src={generatedImage} alt={t('generatedUniformTitle')} className="w-full h-full object-contain" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-700 rounded-xl">
                          <div className="text-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="mt-2 text-sm">{t('placeholderText')}</p>
                          </div>
                       </div>
                    )}
                </div>
                
                 <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-600/30"
                    >
                        <SparklesIcon />
                        {generatedImage ? t('regenerateButton') : t('generateButton')}
                    </button>
                     <button
                        onClick={resetState}
                        className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
                    >
                        {t('startOverButton')}
                    </button>
                </div>
            </div>
        </div>

      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <button onClick={toggleLanguage} className="text-indigo-400 hover:text-indigo-300 transition-colors">
            {language === 'en' ? '한국어로 변경' : 'Switch to English'}
        </button>
      </footer>
    </div>
  );
};