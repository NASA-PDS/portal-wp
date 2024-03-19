import { createSelector } from "@reduxjs/toolkit";
import { INVESTIGATION_TYPE, Investigation } from "src/types/investigation.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { RootState } from "src/state/store";
import { InvestigationItems } from "src/state/slices/investigationsSlice";

/**
 * A redux selector to retrieve investigation data stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {InvestigationItems} An data structure containing the current state of versioned investigations
 */
const selectInvestigations = (state:RootState): InvestigationItems => {
  return state.investigations.items;
};

/**
 * The search filter that should be applied to the list of investigations.
 * @param {RootState} state The redux state of type RootState
 * @returns {string} The search filter currently being applied
 */
const selectSearchFilters = (state:RootState) => {
  return state.investigations.searchFilters;
};

export const selectInvestigationVersion = (state:RootState, lid:string, version:string) => {
  return state.investigations.items[lid][version]
};

/**
 * A memoized redux selector that efficiently returns the latest list of investigations.
 * @returns {Investigation[]} An filtered, and latest list of investigations
 */
const selectLatestVersionInvestigations = createSelector([selectInvestigations], (investigations) => {

  let latestInvestigations:Investigation[] = [];
  
  // Find the latest version of each investigation and store it in an array
  let latestVersion:string = "";
  Object.keys(investigations).forEach( (lid) => {
    latestVersion = Object.keys(investigations[lid]).sort().reverse()[0];
    latestInvestigations.push( investigations[lid][latestVersion] );
  });

  return latestInvestigations;

});

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of investigations.
 * @returns {Investigation[]} An filtered, and latest list of investigations
 */
export const selectFilteredInvestigations = createSelector([selectLatestVersionInvestigations, selectSearchFilters], (latestInvestigations:Investigation[], searchFilters) => {

  // Sort investigations alphabetically by title
  latestInvestigations.sort( (a:Investigation,b:Investigation) => {
    if( a[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase() ) {
      return -1
    } else if( a[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase() ) {
      return 1
    }
    return 0;
  });

  if( searchFilters === undefined ) {
    return latestInvestigations;
  }

  return latestInvestigations.filter(
    (item) => {
      return (
        item[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase().includes(searchFilters?.freeText || "")
        &&
        ( searchFilters.type === undefined || searchFilters.type === INVESTIGATION_TYPE.ALL || item[PDS4_INFO_MODEL.INVESTIGATION.TYPE] === searchFilters.type )
      )
    }
  );

});