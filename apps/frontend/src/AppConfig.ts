import { PROCESSING_LEVEL_KEYS } from "@nasapds/wds-react";
import { BannerProps } from "@nasapds/wds-react";

type AppConfig = {
  GENERAL: {
    VERSION:string
    BANNER_MESSAGES:Array<BannerProps>
  }
  SETTINGS: {
    SORT_ORDER: {
      PROCESSING_LEVELS:Array<PROCESSING_LEVEL_KEYS>
    }
  }
}

export const APP_CONFIG:AppConfig = {

  GENERAL: {
    VERSION: import.meta.env.VITE_APP_VERSION,
    BANNER_MESSAGES: []
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