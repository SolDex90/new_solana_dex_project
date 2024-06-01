import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to the Solana DEX",
      // Add more translations
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido al Solana DEX",
      // Add more translations
    }
  },
  // Add more languages
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
