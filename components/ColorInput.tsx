import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKey } from '../contexts/LanguageContext';

interface ColorInputProps {
    labelKey: TranslationKey;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const ColorInput: React.FC<ColorInputProps> = ({ labelKey, value, onChange, placeholder }) => {
    const { t } = useLanguage();

    const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    // A simple regex to check if a string is a valid hex color, because the color input's value must be a hex.
    const isHexColor = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

    // If the text value is not a valid hex (e.g., "Royal Blue"), the color picker input itself
    // needs a fallback hex value. We'll use black as a neutral default. The user's actual
    // value ("Royal Blue") is still stored in the state and displayed in the text input.
    const colorPickerValue = isHexColor(value) ? value : '#000000';

    return (
        <div>
            <label htmlFor={`${labelKey}-text`} className="text-sm font-semibold text-gray-400 mb-2 block">{t(labelKey)}</label>
            <div className="flex items-center gap-2 bg-gray-700 border border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition">
                <div className="relative h-10 w-12 flex-shrink-0">
                    <input
                        id={`${labelKey}-color`}
                        type="color"
                        value={colorPickerValue}
                        onChange={handleColorPickerChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label={`${t(labelKey)} color picker`}
                    />
                    <div
                        className="w-full h-full rounded-l-md border-r-2 border-gray-600"
                        style={{ backgroundColor: value }}
                        aria-hidden="true"
                    ></div>
                </div>
                <input
                    id={`${labelKey}-text`}
                    type="text"
                    value={value}
                    onChange={handleTextInputChange}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent w-full pr-3 py-2 text-white outline-none"
                />
            </div>
        </div>
    );
};
