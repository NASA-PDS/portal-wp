import { generatePath } from "react-router-dom";
import { convertLogicalIdentifier, LID_FORMAT } from "./strings";

type InstrumentDetailPathParams = {
  lid:string;
}

type InvestigationDetailPathParams = {
  lid:string;
}

const generateLinkPath = (template:string, params:{[key:string]:string}) => {
  return generatePath(template, params)
}

export const getLinkToInvestigationDetailPage = (params:InvestigationDetailPathParams) => {
  params.lid = convertLogicalIdentifier(params.lid,LID_FORMAT.URL_FRIENDLY);
  return generateLinkPath("/investigations/:lid/instruments", params);
};

export const getLinkToInstrumentDetailPage = (params:InstrumentDetailPathParams) => {
  params.lid = convertLogicalIdentifier(params.lid,LID_FORMAT.URL_FRIENDLY);
  return generateLinkPath("/instruments/:lid/data", params);
};