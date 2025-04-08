import type { Resource } from 'i18next';
import translationEN from './en.json';
import translationFR from './fr.json';
import translationES from './es.json';
import translationDE from './de.json';

// The translations
export const appLanguageBundle: Resource = {
    en: { translation: translationEN },
    fr: { translation: translationFR },
    es: { translation: translationES },
    de: { translation: translationDE }
};