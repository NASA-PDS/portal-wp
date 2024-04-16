import { PDS4_INFO_MODEL } from "./pds4-info-model";

export type InstrumentHost = {

  // PDS Information Model Fields
  [PDS4_INFO_MODEL.LID]:string;
  [PDS4_INFO_MODEL.LIDVID]:string;
  [PDS4_INFO_MODEL.REF_LID_INSTRUMENT]:string[];
  [PDS4_INFO_MODEL.REF_LID_TARGET]:string[];
  [PDS4_INFO_MODEL.TITLE]:string;
  [PDS4_INFO_MODEL.VID]:string;
  [PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE]:string;
  [PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION]:string;
  [PDS4_INFO_MODEL.INSTRUMENT_HOST.TYPE]:string;
  
}