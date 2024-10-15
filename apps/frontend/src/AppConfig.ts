import { DATA_COLLECTION_GROUP_TITLE } from "@nasapds/wds-react";

export const APP_CONFIG = {

  GENERAL: {
     VERSION: import.meta.env.VITE_APP_VERSION,
  },

  SETTINGS: {
    SORT_ORDER: {
      PROCESSING_LEVELS: [
        DATA_COLLECTION_GROUP_TITLE.DERIVED,
        DATA_COLLECTION_GROUP_TITLE.CALIBRATED,
        DATA_COLLECTION_GROUP_TITLE.PARTIALLY_PROCESSED,
        DATA_COLLECTION_GROUP_TITLE.RAW,
        DATA_COLLECTION_GROUP_TITLE.TELEMETRY,
        DATA_COLLECTION_GROUP_TITLE.UNKNOWN
      ]
    }
  }

} as const;

if( import.meta.env.DEV ) {
 // Output Configuration on every call to help with debugging, only in DEV mode!
 console.log("APP_CONFIG", APP_CONFIG)
}