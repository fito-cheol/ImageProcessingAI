import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SoccerBallIcon } from './icons/SoccerBallIcon';

const makeFigureImage = 'https://lh3.google.com/u/0/d/1TVJqlkWJ8L3X-16TRM2CfdH0fvGq8uT0=w1920-h945-iv1?auditContext=prefetch';
const humanClothImage = 'https://lh3.google.com/u/0/d/1lGroK1OmZEYlv2iBJF-7BU64mOudX5fS=w1920-h945-iv2?auditContext=prefetch';
const soccerUniformImage = 'https://lh3.google.com/u/0/d/18CBXS8roCba8VbVDmfAMClBzbozoUwxM=w1297-h945-iv1?auditContext=prefetch';


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
        className="group flex flex-col bg-gray-800/50 border border-gray-700 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:border-indigo-500/50 shadow-lg overflow-hidden"
    >
        <div className="bg-gray-900 overflow-hidden">
            <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-auto max-h-[60vh] object-contain transition-transform duration-300 group-hover:scale-105"
            />
        </div>
        
        <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-4">
                 <div className="transition-transform duration-300 group-hover:scale-110 w-fit">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-100">{title}</h3>
            </div>
            <p className="text-gray-300 max-w-lg">{description}</p>
        </div>
    </button>
);

interface ServiceSelectorProps {
    onSelect: (service: 'figure' | 'try-on' | 'soccer') => void;
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
        <div className="flex flex-col gap-8">
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
            <ServiceButton 
                title={t('soccerUniformTitle')}
                description={t('soccerUniformDescription')}
                icon={<SoccerBallIcon />}
                onClick={() => onSelect('soccer')}
                imageUrl={soccerUniformImage}
            />
        </div>
    </div>
  );
};