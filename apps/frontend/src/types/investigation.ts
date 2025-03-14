import { PDS4_INFO_MODEL } from "./pds4-info-model";

export type Investigation = {

  // PDS Information Model Fields
  [PDS4_INFO_MODEL.LID]:string;
  [PDS4_INFO_MODEL.LIDVID]:string;
  [PDS4_INFO_MODEL.REF_LID_TARGET]:string[];
  [PDS4_INFO_MODEL.REF_LID_INSTRUMENT]:string[];
  [PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST]:string[];
  [PDS4_INFO_MODEL.TITLE]:string;
  [PDS4_INFO_MODEL.VID]:string;
  [PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID]:string[];
  [PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE]:string[];
  [PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION]:string;
  [PDS4_INFO_MODEL.INVESTIGATION.NAME]:string;
  [PDS4_INFO_MODEL.INVESTIGATION.START_DATE]:string;
  [PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE]:string;
  [PDS4_INFO_MODEL.INVESTIGATION.TERSE_DESCRIPTION]:string;
  [PDS4_INFO_MODEL.INVESTIGATION.TYPE]:string;

}

export enum INVESTIGATION_TYPE {
  ALL = "ALL",
  FIELD_CAMPAIGN = "Field Campaign",
  INDIVIDUAL_INVESTIGATION = "Individual Investigation",
  MISSION = "Mission",
  OBSERVING_CAMPAIGN = "Observing Campaign",
  OTHER_INVESTIGATION = "Other Investigation"
}