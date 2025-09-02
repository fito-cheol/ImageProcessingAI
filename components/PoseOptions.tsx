import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tooltip } from './Tooltip';
import { TryOnPose } from '../services/geminiService';
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

interface PoseOptionsProps {
    currentPose: TryOnPose;
    onPoseChange: (pose: TryOnPose) => void;
}

export const PoseOptions: React.FC<PoseOptionsProps> = ({ currentPose, onPoseChange }) => {
    const { t, td } = useLanguage();
    // FIX: Use new unambiguous pose values.
    const poses: readonly TryOnPose[] = ['Original Pose', 'Try On: Standing', 'Fashion Model', 'Walking', 'Try On: Sitting'];

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-2xl">
            <h3 className="text-center text-lg font-semibold text-gray-100 mb-4">{t('poseSectionTitle')}</h3>
            <div className="flex flex-wrap gap-3 justify-center">
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
    );
};