import { Link } from "wouter";
import { ArrowLeft, Database, Trash2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import type { TextSize, Language } from "../contexts/SettingsContext";
import Notification from "../components/Notification";
import { useTranslation } from "../hooks/useTranslation";
import {
  getCacheStats,
  clearRouteCache,
  preloadRouteCache,
} from "../utils/routeUtils";
import { fetchData } from "../utils/api";

const Settings = () => {
  const {
    textSize,
    audioNarration,
    highContrast,
    language,
    setTextSize,
    setAudioNarration,
    setHighContrast,
    setLanguage,
  } = useSettings();

  const { t } = useTranslation();

  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const [cacheStats, setCacheStats] = useState({ size: 0 });
  const [isPreloading, setIsPreloading] = useState(false);

  const updateCacheStats = () => {
    const stats = getCacheStats();
    setCacheStats(stats);
  };

  // Update cache stats when component mounts and when cache operations occur
  useEffect(() => {
    updateCacheStats();
  }, []);

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
  };

  const handleTextSizeChange = (size: TextSize) => {
    setTextSize(size);
    showNotification(t("textSizeChanged", { size: t(size) }));
  };

  const handleAudioToggle = (enabled: boolean) => {
    setAudioNarration(enabled);
    showNotification(
      enabled ? t("audioNarrationEnabled") : t("audioNarrationDisabled")
    );
  };

  const handleContrastToggle = (enabled: boolean) => {
    setHighContrast(enabled);
    showNotification(
      enabled ? t("highContrastEnabled") : t("highContrastDisabled")
    );
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    showNotification(
      t("languageChanged", {
        language: lang === "en" ? t("english") : t("german"),
      })
    );
  };

  const handleCachePreload = async () => {
    setIsPreloading(true);
    try {
      // Fetch all routes from API and extract their IDs
      const routes = await fetchData("/routes");
      const routeIds = Array.isArray(routes) ? routes.map((r) => r.id) : [];
      await preloadRouteCache(routeIds);
      updateCacheStats();
      showNotification(t("cachePreloaded"));
    } catch (error) {
      showNotification(t("cachePreloadError"));
    } finally {
      setIsPreloading(false);
    }
  };

  const handleCacheClear = () => {
    clearRouteCache();
    updateCacheStats();
    showNotification(t("cacheCleared"));
  };

  return (
    <div className="min-h-screen bg-cream">
      <Notification
        show={notification.show}
        message={notification.message}
        onHide={() => setNotification({ show: false, message: "" })}
      />{" "}
      {/* Header */}
      <header className="p-6 border-b border-sandstone/20">
        <h1 className="text-display text-2xl font-bold text-charcoal">
          {t("settings")}
        </h1>
      </header>
      {/* Settings Content */}
      <div className="p-6 space-y-8 pb-32 overflow-y-auto max-h-[calc(100vh-120px)]">
        {" "}
        {/* Text Size */}
        <div className="space-y-4">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            {t("textSize")}:
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {" "}
            {(["small", "medium", "large"] as TextSize[]).map((size) => (
              <button
                key={size}
                onClick={() => handleTextSizeChange(size)}
                className={`p-4 rounded-xl border-2 transition-colors capitalize ${
                  textSize === size
                    ? "border-sage bg-sage text-white"
                    : "border-charcoal text-charcoal hover:bg-charcoal hover:text-cream"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="font-medium">{t(size)}</span>
                  <span
                    className={`text-xs ${
                      size === "small"
                        ? "text-[12px]"
                        : size === "medium"
                        ? "text-[14px]"
                        : "text-[16px]"
                    }`}
                  >
                    {t("sample")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>{" "}
        {/* Audio Narration */}
        <div className="flex justify-between items-center">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            {t("enableAudioNarration")}:
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            {" "}
            <input
              type="checkbox"
              checked={audioNarration}
              onChange={(e) => handleAudioToggle(e.target.checked)}
              className="sr-only"
              aria-label={t("toggleAudioNarration")}
            />
            <div
              className={`w-14 h-8 rounded-full transition-colors ${
                audioNarration ? "bg-sage" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform m-1 ${
                  audioNarration ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>{" "}
        {/* High Contrast Mode */}
        <div className="flex justify-between items-center">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            {t("highContrastMode")}:
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            {" "}
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => handleContrastToggle(e.target.checked)}
              className="sr-only"
              aria-label={t("toggleHighContrast")}
            />
            <div
              className={`w-14 h-8 rounded-full transition-colors ${
                highContrast ? "bg-sage" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform m-1 ${
                  highContrast ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>{" "}
        {/* Language */}
        <div className="space-y-4">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            {t("language")}:
          </h2>{" "}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="w-full p-4 rounded-xl border-2 border-charcoal bg-white text-charcoal text-lg focus:ring-2 focus:ring-sage focus:border-sage"
            aria-label={t("selectLanguage")}
          >
            <option value="en">{t("english")}</option>
            <option value="de">{t("german")}</option>
          </select>
        </div>{" "}
        {/* Cache Management */}
        <div className="space-y-4">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            {t("routeCacheManagement")}:
          </h2>
          <div className="flex gap-4">
            <button
              onClick={handleCachePreload}
              className="flex-1 p-4 rounded-xl bg-sage text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isPreloading}
            >
              {isPreloading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Database size={18} />
              )}
              {isPreloading ? t("preloadingCache") : t("preloadCache")}
            </button>
            <button
              onClick={handleCacheClear}
              className="flex-1 p-4 rounded-xl bg-terracotta text-white font-semibold transition-all flex items-center justify-center gap-2 hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-terracotta"
              disabled={cacheStats.size === 0}
            >
              <Trash2 size={18} />
              {cacheStats.size === 0
                ? t("noCachedRoutes")
                : cacheStats.size === 1
                ? t("clearRoutes", { count: cacheStats.size.toString() })
                : t("clearRoutesPlural", { count: cacheStats.size.toString() })}
            </button>
          </div>
        </div>
      </div>{" "}
      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-cream border-t border-sandstone/20 z-10">
        <Link href="/">
          <button className="btn-primary">
            <div className="flex items-center justify-center gap-2">
              <ArrowLeft size={20} />
              {t("backToHome")}
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Settings;
