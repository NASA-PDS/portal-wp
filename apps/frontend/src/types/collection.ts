import { PDS4_INFO_MODEL } from "./pds4-info-model";

export type Collection = {

  [PDS4_INFO_MODEL.CITATION_INFORMATION.DESCRIPTION]:string;
  [PDS4_INFO_MODEL.CITATION_INFORMATION.DOI]:string;
  [PDS4_INFO_MODEL.COLLECTION.DESCRIPTION]:string;
  [PDS4_INFO_MODEL.COLLECTION.TYPE]:string;
  [PDS4_INFO_MODEL.LID]:string;
  [PDS4_INFO_MODEL.REF_LID_INSTRUMENT]:string[];
  [PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST]:string[];
  [PDS4_INFO_MODEL.REF_LID_INVESTIGATION]:string[];
  [PDS4_INFO_MODEL.REF_LID_TARGET]:string[];
  [PDS4_INFO_MODEL.PRIMARY_RESULT_SUMMARY.PROCESSING_LEVEL]:string[];
  [PDS4_INFO_MODEL.SCIENCE_FACETS.DISCIPLINE_NAME]:string[];
  [PDS4_INFO_MODEL.SOURCE_PRODUCT_EXTERNAL.DOI]:string;
  [PDS4_INFO_MODEL.TIME_COORDINATES.START_DATE_TIME]:string;
  [PDS4_INFO_MODEL.TIME_COORDINATES.STOP_DATE_TIME]:string;
  [PDS4_INFO_MODEL.TITLE]:string;

}