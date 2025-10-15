

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tooltip } from './Tooltip';
import { TryOnPose, TryOnBackground } from '../services/geminiService';
import { TranslationKey } from '../contexts/LanguageContext';

interface OptionButtonProps<T> {
    option: T;
    label: string;
    description: string;
    isSelected: boolean;
    onClick: (value: T) => void;
}

const OptionButton = <T extends string>({ option, label, description, isSelected, onClick }: OptionButtonProps<T>) => (
    <Tooltip text={description}>
        <button
            onClick={() => onClick(option)}
            className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 flex-grow text-center ${
                isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
            {label}
        </button>
    </Tooltip>
);

interface TryOnOptionsProps {
    currentPose: TryOnPose;
    onPoseChange: (pose: TryOnPose) => void;
    currentBackground: TryOnBackground;
    onBackgroundChange: (background: TryOnBackground) => void;
}

export const TryOnOptions: React.FC<TryOnOptionsProps> = ({ currentPose, onPoseChange, currentBackground, onBackgroundChange }) => {
    const { t, td } = useLanguage();
    const poses: readonly TryOnPose[] = ['Original Pose', 'Try On: Standing', 'Fashion Model', 'Walking', 'Try On: Sitting'];
    const backgrounds: readonly TryOnBackground[] = ['Original Background', 'Studio', 'Urban', 'Nature', 'Cafe'];

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-2xl space-y-8">
            <div>
                <h3 className="text-center text-lg font-semibold text-gray-100 mb-4">{t('poseSectionTitle')}</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                    {/* FIX: Avoid TypeScript error with 'key' prop by passing props directly. */}
                    {poses.map((pose) => (
                        <OptionButton 
                            key={pose}
                            option={pose}
                            label={t(pose as TranslationKey)}
                            description={td(pose as any)}
                            isSelected={currentPose === pose}
                            onClick={onPoseChange}
                        />
                    ))}
                </div>
            </div>
            <div className="border-t border-gray-700"></div>
            <div>
                <h3 className="text-center text-lg font-semibold text-gray-100 mb-4">{t('backgroundSectionTitle')}</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                    {/* FIX: Avoid TypeScript error with 'key' prop by passing props directly. */}
                    {backgrounds.map((background) => (
                         <OptionButton
                            key={background}
                            option={background}
                            label={t(background as TranslationKey)}
                            description={td(background as any)}
                            isSelected={currentBackground === background}
                            onClick={onBackgroundChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
