import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ title, description, icon, onClick }) => (
    <button 
        onClick={onClick}
        className="group flex flex-col items-center p-8 bg-gray-800/50 border border-gray-700 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 hover:bg-gray-800/80 hover:border-indigo-500/50 shadow-lg"
    >
        <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-400 max-w-xs">{description}</p>
    </button>
);

interface ServiceSelectorProps {
    onSelect: (service: 'figure' | 'try-on') => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onSelect }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-4xl mx-auto">
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
            />
             <ServiceButton 
                title={t('tryOnTitle')}
                description={t('tryOnDescription')}
                icon={<ShirtIcon />}
                onClick={() => onSelect('try-on')}
            />
        </div>
    </div>
  );
};
