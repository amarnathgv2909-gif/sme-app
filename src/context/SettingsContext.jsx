import React, { createContext, useState, useCallback } from "react";
import { settingsDb } from "../database/index.js";

export const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(() => settingsDb.get());

  const saveSettings = useCallback((next) => {
    settingsDb.set(next);
    setSettingsState(next);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
