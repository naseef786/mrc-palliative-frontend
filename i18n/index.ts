import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import en from "./en";
import ml from "./ml";

export const i18n = new I18n({
    en,
    ml,
});

i18n.enableFallback = true;

// ✅ Correct system language detection
const systemLanguage =
    Localization.getLocales()?.[0]?.languageCode === "ml" ? "ml" : "en";

i18n.locale = systemLanguage;
