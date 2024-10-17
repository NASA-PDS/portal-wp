import { PROCESSING_LEVEL_KEYS } from "@nasapds/wds-react";

export const APP_CONFIG = {

  GENERAL: {
     VERSION: import.meta.env.VITE_APP_VERSION,
  },

  SETTINGS: {
    SORT_ORDER: {
      PROCESSING_LEVELS: [
        PROCESSING_LEVEL_KEYS.DERIVED,
        PROCESSING_LEVEL_KEYS.CALIBRATED,
        PROCESSING_LEVEL_KEYS.PARTIALLY_PROCESSED,
        PROCESSING_LEVEL_KEYS.RAW,
        PROCESSING_LEVEL_KEYS.TELEMETRY,
        PROCESSING_LEVEL_KEYS.UNKNOWN
      ]
    }
  }

} as const;

if( import.meta.env.DEV ) {
 // Output Configuration on every call to help with debugging, only in DEV mode!
 console.log("APP_CONFIG", APP_CONFIG)
}