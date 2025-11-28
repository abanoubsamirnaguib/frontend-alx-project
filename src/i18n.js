import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en
            },
            ar: {
                translation: ar
            }
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

// Set initial direction
document.documentElement.setAttribute('dir', i18n.dir(i18n.language));

// Update dir attribute whenever language changes
i18n.on('languageChanged', (lng) => {
    document.documentElement.setAttribute('dir', i18n.dir(lng));
});

export default i18n;
