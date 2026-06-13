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

const updateMeta = (selector, content) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute('content', content);
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const isArabic = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    const title = isArabic
      ? 'مباريات كأس العالم 2026 | النتائج المباشرة والجدول والترتيب'
      : 'World Cup Matches Online | Live Scores, Schedule & Standings';
    const description = isArabic
      ? 'تابع نتائج مباريات كأس العالم 2026 مباشرة، وجدول المباريات بالتوقيت المحلي، وترتيب المجموعات، والأدوار الإقصائية.'
      : 'Follow World Cup 2026 live scores, local kickoff times, the complete match schedule, group standings, and knockout fixtures.';

    document.title = title;
    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:locale"]', isArabic ? 'ar_PS' : 'en_US');
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
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
