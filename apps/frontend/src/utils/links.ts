import { generatePath } from "react-router-dom";
import { convertLogicalIdentifier, LID_FORMAT } from "./strings";

export type InvestigationDetailPathParams = {
  lid:string;
}

const generateLinkPath = (template:string, params:{[key:string]:string}) => {
  return generatePath(template, params)
}

export const getLinkToInvestigation = (params:InvestigationDetailPathParams) => {
  params.lid = convertLogicalIdentifier(params.lid,LID_FORMAT.URL_FRIENDLY);
  return generateLinkPath("/investigations/:lid/instruments", params);
};
