import { en } from './en';
import { de } from './de';

export const translations = {
  en,
  de,
};

export type TranslationKey = keyof typeof en;
export type Language = keyof typeof translations;
