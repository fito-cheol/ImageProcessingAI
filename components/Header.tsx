import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKey } from '../contexts/LanguageContext';

interface HeaderProps {
  titleKey?: TranslationKey;
  subtitleKey?: TranslationKey;
}

export const Header: React.FC<HeaderProps> = ({ titleKey = 'headerTitle', subtitleKey = 'headerSubtitle' }) => {
  const { t } = useLanguage();
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 mb-2">
        {t(titleKey)}
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
        {t(subtitleKey)}
      </p>
    </header>
  );
};
