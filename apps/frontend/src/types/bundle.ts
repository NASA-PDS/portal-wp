import { PDS4_INFO_MODEL } from "./pds4-info-model";

type ObservingSystemComponent = {
  id:string;
  href:string;
}

export type Bundle = {

  [PDS4_INFO_MODEL.LID]:string;

  // This is not the PDS Class Observing System Component!!!
  [PDS4_INFO_MODEL.OBSERVING_SYSTEM_COMPONENTS]:ObservingSystemComponent[];

  [PDS4_INFO_MODEL.TITLE]:string;
  [PDS4_INFO_MODEL.BUNDLE.DESCRIPTION]:string;
  [PDS4_INFO_MODEL.BUNDLE.TYPE]:string;

}