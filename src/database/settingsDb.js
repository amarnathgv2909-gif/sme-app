import { createSingleton } from "./db.js";
import { DEFAULT_SETTINGS } from "../constants/seedData.js";

export const settingsDb = createSingleton("sme_settings_db", DEFAULT_SETTINGS);
