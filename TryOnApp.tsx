import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Loader } from './components/Loader';
import { virtualTryOn, TryOnPose, TryOnBackground } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { useLanguage } from './contexts/LanguageContext';
import { TryOnOptions } from './components/PoseOptions';
import { Footer } from './components/Footer';

const MAX_ITEMS = 4;

const ItemUploader: React.FC<{ onUpload: (file: File) => void }> = ({ onUpload }) => {
    const { t } = useLanguage();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onUpload(event.target.files[0]);
        }
    };
    return (
        <label className="aspect-square flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 border-gray-600 hover:border-gray-500 bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
             <p className="text-xs text-gray-500 mt-1">{t('uploadItemText')}</p>
            <input type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
        </label>
    );
};


export const TryOnApp: React.FC = () => {
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [itemFiles, setItemFiles] = useState<(File | null)[]>(Array(MAX_ITEMS).fill(null));
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pose, setPose] = useState<TryOnPose>('Original Pose');
  const [background, setBackground] = useState<TryOnBackground>('Original Background');
  const { t } = useLanguage();

  const handlePersonUpload = (file: File) => {
    setPersonFile(file);
    setGeneratedImage(null);
    setError(null);
  };
  
  const handleItemUpload = (file: File) => {
    const newItems = [...itemFiles];
    const firstEmptySlot = newItems.findIndex(item => item === null);
    if(firstEmptySlot !== -1) {
        newItems[firstEmptySlot] = file;
        setItemFiles(newItems);
    }
  }

  const handleItemRemove = (index: number) => {
    const newItems = [...itemFiles];
    newItems[index] = null;
    setItemFiles(newItems);
  }

  const resetState = () => {
      setPersonFile(null);
      setItemFiles(Array(MAX_ITEMS).fill(null));
      setGeneratedImage(null);
      setError(null);
      setIsLoading(false);
      setPose('Original Pose');
      setBackground('Original Background');
  };

  const handleGenerate = useCallback(async () => {
    if (!personFile) {
      setError(t('errorPerson'));
      return;
    }
    const validItems = itemFiles.filter(f => f !== null) as File[];
    if (validItems.length === 0) {
      setError(t('errorItems'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const personData = await fileToBase64(personFile);
      const itemsData = await Promise.all(validItems.map(file => fileToBase64(file)));
      
      const result = await virtualTryOn(personData, itemsData, pose, background);
      
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
  }, [personFile, itemFiles, t, pose, background]);
  
  const personPreview = personFile ? URL.createObjectURL(personFile) : null;
  const itemPreviews = itemFiles.map(file => file ? URL.createObjectURL(file) : null);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased flex flex-col">
      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow flex flex-col">
        <Header titleKey="tryOnHeaderTitle" subtitleKey="tryOnHeaderSubtitle" />

        {error && (
          <div className="my-8 text-left bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">{t('errorTitle')}: </strong>
            <span className="block sm:inline whitespace-pre-wrap">{error}</span>
          </div>
        )}
        
        {isLoading && <Loader />}
        
        <div className="max-w-7xl mx-auto w-full flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* --- LEFT PANEL: INPUTS --- */}
            <div className="space-y-8">
                {/* Person Image */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-400 mb-3 text-center">{t('personImageTitle')}</h3>
                    <div className="aspect-square w-full max-w-md mx-auto rounded-xl bg-gray-800 shadow-lg overflow-hidden relative">
                        {personPreview ? (
                            <img src={personPreview} alt={t('personImageTitle')} className="w-full h-full object-contain" />
                        ) : (
                            <div className="p-4 h-full flex items-center justify-center">
                                <ImageUploader onImageUpload={handlePersonUpload} titleKey="uploadPersonTitle" subtitleKey="uploadPersonSubtitle" />
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Clothing Items */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-400 mb-3 text-center">{t('clothingItemsTitle')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {itemPreviews.map((preview, index) => (
                            <div key={index} className="aspect-square w-full rounded-xl bg-gray-800 shadow-lg overflow-hidden relative">
                                {preview ? (
                                    <>
                                        <img src={preview} alt={`Item ${index + 1}`} className="w-full h-full object-contain" />
                                        <button onClick={() => handleItemRemove(index)} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/80 transition-colors" aria-label={`Remove item ${index + 1}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </>
                                ) : (
                                    <ItemUploader onUpload={handleItemUpload} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- RIGHT PANEL: OUTPUT --- */}
            <div className="w-full flex flex-col items-center lg:sticky lg:top-12">
                <h3 className="text-2xl font-bold text-gray-300 mb-4">{t('generatedResultTitle')}</h3>
                <div className="w-full max-w-2xl aspect-square rounded-xl bg-gray-800 shadow-lg overflow-hidden relative">
                     {generatedImage && !isLoading ? (
                        <img src={generatedImage} alt={t('generatedResultTitle')} className="w-full h-full object-contain" />
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
            </div>

          </div>
        </div>

        {personFile && !isLoading && (
          <>
            <TryOnOptions
              currentPose={pose}
              onPoseChange={setPose}
              currentBackground={background}
              onBackgroundChange={setBackground}
            />
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
          </>
        )}

      </main>
      <Footer />
    </div>
  );
};
