import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import type { TextSize, Language } from "../contexts/SettingsContext";
import Notification from "../components/Notification";

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

  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
  };

  const handleTextSizeChange = (size: TextSize) => {
    setTextSize(size);
    showNotification(`Text size changed to ${size}`);
  };

  const handleAudioToggle = (enabled: boolean) => {
    setAudioNarration(enabled);
    showNotification(`Audio narration ${enabled ? "enabled" : "disabled"}`);
  };

  const handleContrastToggle = (enabled: boolean) => {
    setHighContrast(enabled);
    showNotification(`High contrast mode ${enabled ? "enabled" : "disabled"}`);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    showNotification(
      `Language changed to ${lang === "en" ? "English" : "German"}`
    );
  };
  return (
    <div className="min-h-screen bg-cream">
      <Notification
        show={notification.show}
        message={notification.message}
        onHide={() => setNotification({ show: false, message: "" })}
      />
      {/* Header */}
      <header className="p-6 border-b border-sandstone/20">
        <h1 className="text-display text-2xl font-bold text-charcoal">
          Settings
        </h1>
      </header>
      {/* Settings Content */}
      <div className="p-6 space-y-8">
        {" "}
        {/* Text Size */}
        <div className="space-y-4">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            Text Size:
          </h2>

          {/* Preview Text */}
          <div className="card bg-white border border-sandstone/30">
            <h3 className="text-display font-semibold text-charcoal mb-2">
              Preview:
            </h3>
            <p className="text-body text-charcoal/80">
              This is how text will appear in the app with your selected size.
            </p>
          </div>

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
                  <span className="font-medium">{size}</span>
                  <span
                    className={`text-xs ${
                      size === "small"
                        ? "text-[12px]"
                        : size === "medium"
                        ? "text-[14px]"
                        : "text-[16px]"
                    }`}
                  >
                    Sample
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Audio Narration */}
        <div className="flex justify-between items-center">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            Enable Audio Narration:
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            {" "}
            <input
              type="checkbox"
              checked={audioNarration}
              onChange={(e) => handleAudioToggle(e.target.checked)}
              className="sr-only"
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
        </div>
        {/* High Contrast Mode */}
        <div className="flex justify-between items-center">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            High Contrast Mode:
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            {" "}
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => handleContrastToggle(e.target.checked)}
              className="sr-only"
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
        </div>
        {/* Language */}
        <div className="space-y-4">
          <h2 className="text-display text-xl font-semibold text-charcoal">
            Language:
          </h2>{" "}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="w-full p-4 rounded-xl border-2 border-charcoal bg-white text-charcoal text-lg focus:ring-2 focus:ring-sage focus:border-sage"
          >
            <option value="en">English</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>{" "}
      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-cream border-t border-sandstone/20">
        <Link href="/">
          <button className="btn-primary">
            <div className="flex items-center justify-center gap-2">
              <ArrowLeft size={20} />
              Back to Home
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Settings;
