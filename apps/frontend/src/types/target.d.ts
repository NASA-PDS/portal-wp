import { PDS4_INFO_MODEL } from "./pds4-info-model";

export type Target = {

  // PDS Information Model Fields
  [PDS4_INFO_MODEL.LID]:string;
  [PDS4_INFO_MODEL.LIDVID]:string;
  [PDS4_INFO_MODEL.VID]:string;
  [PDS4_INFO_MODEL.TARGET.DESCRIPTION]:string;
  [PDS4_INFO_MODEL.TARGET.NAME]:string;
  [PDS4_INFO_MODEL.TARGET.TYPE]:string;

}