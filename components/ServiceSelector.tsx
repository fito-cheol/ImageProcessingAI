import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const makeFigureImage = 'https://drive.google.com/uc?export=view&id=1TVJqlkWJ8L3X-16TRM2CfdH0fvGq8uT0';
const humanClothImage = 'https://drive.google.com/uc?export=view&id=1b1gpis2vpf2hAR_FPWAqq2Za0jzUle9A';

const CubeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ShirtIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        <path d="M15.5 10.5s-1 .5-3.5 .5-3.5-.5-3.5-.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


interface ServiceButtonProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    imageUrl: string;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ title, description, icon, onClick, imageUrl }) => (
    <button 
        onClick={onClick}
        className="group relative overflow-hidden bg-gray-900 border border-gray-700 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 hover:border-indigo-500/50 shadow-lg aspect-[4/3]"
    >
        <img 
            src={imageUrl} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" aria-hidden="true"></div>
        
        <div className="relative flex flex-col h-full justify-end p-6 md:p-8">
            <div className="mb-4 transition-transform duration-300 group-hover:scale-110 w-fit">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-2">{title}</h3>
            <p className="text-gray-300 max-w-xs">{description}</p>
        </div>
    </button>
);

interface ServiceSelectorProps {
    onSelect: (service: 'figure' | 'try-on') => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onSelect }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 mb-2">
                {t('selectServiceTitle')}
            </h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceButton 
                title={t('figureFusionTitle')}
                description={t('figureFusionDescription')}
                icon={<CubeIcon />}
                onClick={() => onSelect('figure')}
                imageUrl={makeFigureImage}
            />
             <ServiceButton 
                title={t('tryOnTitle')}
                description={t('tryOnDescription')}
                icon={<ShirtIcon />}
                onClick={() => onSelect('try-on')}
                imageUrl={humanClothImage}
            />
        </div>
    </div>
  );
};