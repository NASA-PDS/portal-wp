import { PDS4_INFO_MODEL } from "./pds4-info-model";

export type Target = {

  // PDS Information Model Fields
  [PDS4_INFO_MODEL.LID]:string;
  [PDS4_INFO_MODEL.LIDVID]:string;
  [PDS4_INFO_MODEL.TITLE]:string;
  [PDS4_INFO_MODEL.VID]:string;

}