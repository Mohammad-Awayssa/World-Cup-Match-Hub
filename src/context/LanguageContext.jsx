import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

export const LanguageContext = createContext(null);

const getInitialLanguage = () => {
  try {
    return localStorage.getItem('wc2026-language') === 'ar' ? 'ar' : 'en';
  } catch {
    return 'en';
  }
};

const readPath = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const isArabic = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.title = translations[language].footer.title;
    try {
      localStorage.setItem('wc2026-language', language);
    } catch {
      // The selected language still works for this session when storage is blocked.
    }
  }, [isArabic, language]);

  const t = useCallback((key, values = {}) => {
    const template = readPath(translations[language], key) ?? readPath(translations.en, key) ?? key;
    if (typeof template !== 'string') return template;
    return Object.entries(values).reduce(
      (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
      template,
    );
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === 'en' ? 'ar' : 'en'));
  }, []);

  const value = useMemo(() => ({
    language,
    locale: isArabic ? 'ar' : 'en',
    isArabic,
    setLanguage,
    toggleLanguage,
    t,
  }), [isArabic, language, t, toggleLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
