import { PDS4_INFO_MODEL } from "./pds4-info-model";

export type Instrument = {

  // PDS Information Model Fields
  [PDS4_INFO_MODEL.LID]:string;
  [PDS4_INFO_MODEL.LIDVID]:string;
  [PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST]:string[];
  [PDS4_INFO_MODEL.TITLE]:string;
  [PDS4_INFO_MODEL.VID]:string;
  [PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION]:string;
  [PDS4_INFO_MODEL.INSTRUMENT.NAME]:string;
  [PDS4_INFO_MODEL.INSTRUMENT.TYPE]:string[];

}