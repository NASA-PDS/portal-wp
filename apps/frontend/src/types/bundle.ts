import { PDS4_INFO_MODEL } from "./pds4-info-model"

export type Bundle = {
  [PDS4_INFO_MODEL.LID]:string;
  [PDS4_INFO_MODEL.TITLE]:string;
  [PDS4_INFO_MODEL.BUNDLE.DESCRIPTION]:string;
  [PDS4_INFO_MODEL.BUNDLE.TYPE]:string
}