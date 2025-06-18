import React, { createContext, useContext, useEffect, useState } from "react";

export type TextSize = "small" | "medium" | "large";
export type Language = "en" | "de";

interface SettingsState {
  textSize: TextSize;
  audioNarration: boolean;
  highContrast: boolean;
  language: Language;
}

interface SettingsContextType extends SettingsState {
  setTextSize: (size: TextSize) => void;
  setAudioNarration: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setLanguage: (language: Language) => void;
  saveSettings: () => void;
  resetSettings: () => void;
}

const defaultSettings: SettingsState = {
  textSize: "medium",
  audioNarration: true,
  highContrast: false,
  language: "en",
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("mittweida-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  // Apply text size to document root
  useEffect(() => {
    const root = document.documentElement;

    // Remove any existing text size classes
    root.classList.remove(
      "text-size-small",
      "text-size-medium",
      "text-size-large"
    );

    // Add current text size class
    root.classList.add(`text-size-${settings.textSize}`);
  }, [settings.textSize]);

  // Apply high contrast mode
  useEffect(() => {
    const root = document.documentElement;

    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [settings.highContrast]);

  const saveToLocalStorage = (newSettings: SettingsState) => {
    localStorage.setItem("mittweida-settings", JSON.stringify(newSettings));
  };

  const setTextSize = (size: TextSize) => {
    const newSettings = { ...settings, textSize: size };
    setSettings(newSettings);
    saveToLocalStorage(newSettings);
  };

  const setAudioNarration = (enabled: boolean) => {
    const newSettings = { ...settings, audioNarration: enabled };
    setSettings(newSettings);
    saveToLocalStorage(newSettings);
  };

  const setHighContrast = (enabled: boolean) => {
    const newSettings = { ...settings, highContrast: enabled };
    setSettings(newSettings);
    saveToLocalStorage(newSettings);
  };

  const setLanguage = (language: Language) => {
    const newSettings = { ...settings, language };
    setSettings(newSettings);
    saveToLocalStorage(newSettings);
  };
  const saveSettings = () => {
    saveToLocalStorage(settings);
    console.log("Settings saved successfully");
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    saveToLocalStorage(defaultSettings);
    localStorage.removeItem("mittweida-settings");
  };

  const value: SettingsContextType = {
    ...settings,
    setTextSize,
    setAudioNarration,
    setHighContrast,
    setLanguage,
    saveSettings,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
