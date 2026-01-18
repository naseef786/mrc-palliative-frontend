import { i18n } from "@/i18n";
import { useLanguageStore } from "@/store/language.store";

export const useTranslation = () => {
  const { language } = useLanguageStore();
  i18n.locale = language;
  return (key: string) => i18n.t(key);
};