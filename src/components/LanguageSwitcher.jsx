import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };

    // Direction now handled globally in i18n.js

    return (
        <button
            onClick={toggleLanguage}
            className="btn btn-secondary navbar-btn"
            style={{ marginLeft: '10px', marginRight: '10px' }}
        >
            {i18n.language === 'en' ? '🇺🇸 English' : '🇪🇬 العربية'}
        </button>
    );
};

export default LanguageSwitcher;
