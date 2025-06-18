import { useSettings } from "../contexts/SettingsContext";
import { translations } from "../translations";
import type { TranslationKey } from "../translations";

export const useTranslation = () => {
  const { language } = useSettings();

  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    let translation =
      translations[language][key] || translations.en[key] || key;

    // Simple parameter substitution
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value);
      });
    }

    return translation;
  };

  return { t, language };
};
