import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKey } from '../contexts/LanguageContext';
import { ColorInput } from './ColorInput';
import { Tooltip } from './Tooltip';

// --- Type Definitions ---
export type RenderModel = 'Model: Standard' | 'Model: High Quality';

export interface SoccerUniformOptions {
    jersey: {
        mainColor: string;
        accentColor: string;
        pattern: 'None' | 'Stripes' | 'Checkered' | 'Gradient';
        teamLogo: string;
        sponsorLogo: string;
        playerNumber: string;
        playerName: string;
        fontStyle: 'Bold' | 'Italic' | 'Futuristic';
        neckline: 'V-Neck' | 'Round Neck' | 'Collar';
        sleeves: 'Short' | 'Long';
        fit: 'Slim Fit' | 'Athletic Cut' | 'Regular';
        material: 'Breathable Polyester' | 'Moisture-Wicking';
    };
    shorts: {
        mainColor: string;
        accentColor: string;
        pattern: 'None' | 'Side Stripes';
        teamLogo: boolean;
        length: 'Mid-thigh';
        waistband: 'Elastic with Drawstring';
        fit: 'Loose Fit';
    };
    render: {
        view: 'Front View' | '3/4 View' | 'Full Body View';
        style: 'Realistic' | 'Photorealistic' | '3D Style';
        model: RenderModel;
    };
}

interface SoccerUniformOptionsProps {
    currentOptions: SoccerUniformOptions;
    onOptionChange: (options: SoccerUniformOptions) => void;
}

// --- Reusable Sub-components ---
const Section: React.FC<{ titleKey: TranslationKey; children: React.ReactNode }> = ({ titleKey, children }) => {
    const { t } = useLanguage();
    return (
        <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-200 border-b-2 border-gray-700 pb-2">{t(titleKey)}</h4>
            {children}
        </div>
    );
}

interface OptionGroupProps<T extends string> {
    labelKey: TranslationKey;
    options: readonly T[];
    selectedValue: T;
    onChange: (value: T) => void;
}

const OptionGroup = <T extends string>({ labelKey, options, selectedValue, onChange }: OptionGroupProps<T>) => {
    const { t, td } = useLanguage();
    return (
        <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">{t(labelKey)}</h4>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <Tooltip key={option} text={td(option as any)}>
                        <button
                            onClick={() => onChange(option)}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                                selectedValue === option
                                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {t(option as any)}
                        </button>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};

interface TextInputProps {
    labelKey: TranslationKey;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ labelKey, value, onChange, placeholder }) => {
    const { t } = useLanguage();
    return (
        <div>
            <label htmlFor={labelKey} className="text-sm font-semibold text-gray-400 mb-2 block">{t(labelKey)}</label>
            <input
                id={labelKey}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
        </div>
    );
};

// --- Main Component ---
export const SoccerUniformOptions: React.FC<SoccerUniformOptionsProps> = ({ currentOptions, onOptionChange }) => {
    const handleOptionChange = <S extends keyof SoccerUniformOptions, K extends keyof SoccerUniformOptions[S]>(section: S, key: K, value: SoccerUniformOptions[S][K]) => {
        onOptionChange({
            ...currentOptions,
            [section]: {
                ...currentOptions[section],
                [key]: value
            }
        });
    };

    const renderModels: readonly RenderModel[] = ['Model: Standard', 'Model: High Quality'];

    return (
        <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl space-y-8">
            <Section titleKey="jerseyOptions">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorInput labelKey="mainColor" value={currentOptions.jersey.mainColor} onChange={(v) => handleOptionChange('jersey', 'mainColor', v)} placeholder="e.g., Red or #FF0000" />
                    <ColorInput labelKey="accentColor" value={currentOptions.jersey.accentColor} onChange={(v) => handleOptionChange('jersey', 'accentColor', v)} placeholder="e.g., White or #FFFFFF" />
                    <TextInput labelKey="logoTeam" value={currentOptions.jersey.teamLogo} onChange={(v) => handleOptionChange('jersey', 'teamLogo', v)} placeholder="e.g., Lion head emblem" />
                    <TextInput labelKey="logoSponsor" value={currentOptions.jersey.sponsorLogo} onChange={(v) => handleOptionChange('jersey', 'sponsorLogo', v)} placeholder="e.g., 'Fly High'" />
                    <TextInput labelKey="playerNumber" value={currentOptions.jersey.playerNumber} onChange={(v) => handleOptionChange('jersey', 'playerNumber', v)} placeholder="e.g., 7" />
                    <TextInput labelKey="playerName" value={currentOptions.jersey.playerName} onChange={(v) => handleOptionChange('jersey', 'playerName', v)} placeholder="e.g., 'RONALDO'" />
                </div>
                 <OptionGroup labelKey="pattern" options={['None', 'Stripes', 'Checkered', 'Gradient']} selectedValue={currentOptions.jersey.pattern} onChange={(v) => handleOptionChange('jersey', 'pattern', v)} />
                 <OptionGroup labelKey="fontStyle" options={['Bold', 'Italic', 'Futuristic']} selectedValue={currentOptions.jersey.fontStyle} onChange={(v) => handleOptionChange('jersey', 'fontStyle', v)} />
                 <OptionGroup labelKey="neckline" options={['V-Neck', 'Round Neck', 'Collar']} selectedValue={currentOptions.jersey.neckline} onChange={(v) => handleOptionChange('jersey', 'neckline', v)} />
                 <OptionGroup labelKey="fit" options={['Slim Fit', 'Athletic Cut', 'Regular']} selectedValue={currentOptions.jersey.fit} onChange={(v) => handleOptionChange('jersey', 'fit', v)} />
                 <OptionGroup labelKey="material" options={['Breathable Polyester', 'Moisture-Wicking']} selectedValue={currentOptions.jersey.material} onChange={(v) => handleOptionChange('jersey', 'material', v)} />
            </Section>

            <Section titleKey="shortsOptions">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <ColorInput labelKey="mainColor" value={currentOptions.shorts.mainColor} onChange={(v) => handleOptionChange('shorts', 'mainColor', v)} placeholder="e.g., White or #FFFFFF" />
                    <ColorInput labelKey="accentColor" value={currentOptions.shorts.accentColor} onChange={(v) => handleOptionChange('shorts', 'accentColor', v)} placeholder="e.g., Red or #FF0000" />
                 </div>
                 <OptionGroup labelKey="pattern" options={['None', 'Side Stripes']} selectedValue={currentOptions.shorts.pattern} onChange={(v) => handleOptionChange('shorts', 'pattern', v)} />
            </Section>
            
            <Section titleKey="renderOptions">
                <div className="space-y-4">
                    <OptionGroup labelKey="view" options={['Front View', '3/4 View', 'Full Body View']} selectedValue={currentOptions.render.view} onChange={(v) => handleOptionChange('render', 'view', v)} />
                    <OptionGroup labelKey="style" options={['Realistic', 'Photorealistic', '3D Style']} selectedValue={currentOptions.render.style} onChange={(v) => handleOptionChange('render', 'style', v)} />
                    <OptionGroup labelKey="generationModel" options={renderModels} selectedValue={currentOptions.render.model} onChange={(v) => handleOptionChange('render', 'model', v)} />
                </div>
            </Section>
        </div>
    );
};