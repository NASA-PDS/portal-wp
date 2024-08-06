import { createSelector } from "@reduxjs/toolkit";
import { INVESTIGATION_TYPE, Investigation } from "src/types/investigation.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { RootState } from "src/state/store";
import { InvestigationItems } from "src/state/slices/investigationsSlice";
import { selectLatestVersionTargets } from "./targets";
import { selectLatestVersionInstruments } from "./instruments";
import { Instrument } from "src/types/instrument.d";

export const investigationDataReady = (state:RootState):boolean => {
  return state.investigations.status === 'succeeded';
};

/**
 * A redux selector to retrieve investigation data stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {InvestigationItems} An data structure containing the current state of versioned investigations
 */
const selectInvestigations = (state:RootState): InvestigationItems => {
  return state.investigations.items;
};

const selectInvestigation = (state:RootState, lid:string) => {
  return state.investigations.items[lid];
}

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
 * @returns {Investigation[]} A list of the latest investigations.
 */
export const selectLatestVersionInvestigations = createSelector([selectInvestigations], (investigations) => {

  const latestInvestigations:Investigation[] = [];
  
  // Find the latest version of each investigation and store it in an array
  let latestVersion:string = "";
  Object.keys(investigations).forEach( (lid) => {
    latestVersion = Object.keys(investigations[lid]).sort().reverse()[0];
    latestInvestigations.push( investigations[lid][latestVersion] );
  });

  return latestInvestigations;

});

/**
 * A memoized redux selector that efficiently returns the latest list of investigations.
 * @returns {Investigation[]} A list of the latest investigations.
 */
export const selectLatestInvestigationVersion = createSelector( [selectInvestigation], (investigationVersions) => {

  // Find the latest version of the investigation
  const latestVersion:string = Object.keys(investigationVersions).sort().reverse()[0];

  return investigationVersions[latestVersion];

});

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of investigations.
 * @returns {Investigation[]} A filtered, latest list of investigations
 */
/*export const selectFilteredInvestigations = createSelector([selectLatestVersionInvestigations, selectSearchFilters], (latestInvestigations:Investigation[], searchFilters) => {

  // Sort investigations alphabetically by title
  latestInvestigations.sort( (a:Investigation,b:Investigation) => {
    if( a[PDS4_INFO_MODEL.INVESTIGATION.NAME].toLowerCase() < b[PDS4_INFO_MODEL.INVESTIGATION.NAME].toLowerCase() ) {
      return -1
    } else if( a[PDS4_INFO_MODEL.INVESTIGATION.NAME].toLowerCase() > b[PDS4_INFO_MODEL.INVESTIGATION.NAME].toLowerCase() ) {
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
        item[PDS4_INFO_MODEL.INVESTIGATION.NAME].toLowerCase().includes(searchFilters?.freeText || "")
        &&
        ( searchFilters.type === undefined || searchFilters.type === INVESTIGATION_TYPE.ALL || item[PDS4_INFO_MODEL.INVESTIGATION.TYPE] === searchFilters.type )
      )
    }
  );

});*/

export const selectFilteredInvestigations = createSelector(
  [ selectLatestVersionInvestigations, selectLatestVersionTargets, selectLatestVersionInstruments, selectSearchFilters ],
  ( latestInvestigations, latestTargets, latestInstruments, searchFilters ) => {

    let filteredInvestigations = latestInvestigations;

    // Search Filters are undefined, so return full list of investigations
    if( searchFilters !== undefined ) {
      
      let foundTargetLids:string[] = [];
      let foundInstrumentLids:Instrument[] = [];
      if( searchFilters.freeText !== undefined ) {
  
        // Get LIDS for targets that match free-text search filter
        foundTargetLids = latestTargets.filter( (target) => {
          return (
            target[PDS4_INFO_MODEL.TARGET.NAME]?.toLowerCase().includes(searchFilters?.freeText.toLowerCase() || "")
            ||
            target[PDS4_INFO_MODEL.LID]?.toLowerCase().includes(searchFilters?.freeText.toLowerCase() || "")
          )
        }).map( (target) => { return target[PDS4_INFO_MODEL.LID]});
  
        // Get LIDS for instruments that match free-text search filter
        foundInstrumentLids = latestInstruments.filter( (instrument) => {
          return (
            instrument[PDS4_INFO_MODEL.INSTRUMENT.NAME]?.toLowerCase().includes(searchFilters?.freeText.toLowerCase() || "")
            ||
            instrument[PDS4_INFO_MODEL.LID]?.toLowerCase().includes(searchFilters?.freeText.toLowerCase() || "")
          )
        });
      }
  
      // Get LIDS for instruments hosts of those that matched free-text search filter
      const foundInstrumentHostLids:string[] = [];
      foundInstrumentLids.forEach( (instrument:Instrument) => {
        instrument[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST]?.forEach( (instrumentHost) => {
          if( !foundInstrumentHostLids.includes(instrumentHost) ) {
            foundInstrumentHostLids.push(instrumentHost);
          }
        })
      });
  
      const targetInvestigationLids = latestInvestigations.filter( (investigation:Investigation) => {
        return investigation[PDS4_INFO_MODEL.REF_LID_TARGET]?.filter( (investigationTarget) => {
          return foundTargetLids.includes(investigationTarget);
        }).length > 0
      }).map( (investigation:Investigation) => { return investigation[PDS4_INFO_MODEL.LID]});
  
      const instrumentHostInvestigationLids = latestInvestigations.filter( (investigation:Investigation) => {
        return investigation[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST]?.filter( (investigationInstrumentHost) => {
          return foundInstrumentHostLids.includes(investigationInstrumentHost);
        }).length > 0
      }).map( (investigation:Investigation) => { return investigation[PDS4_INFO_MODEL.LID]});
  
      filteredInvestigations = latestInvestigations.filter(
        (investigation) => {
          return (
            (
              searchFilters.freeText === undefined 
              || investigation[PDS4_INFO_MODEL.TITLE].toLowerCase().includes(searchFilters?.freeText.toLowerCase() || "")
              || investigation[PDS4_INFO_MODEL.LID].toLowerCase().includes(searchFilters?.freeText.toLowerCase() || "")
              || targetInvestigationLids.includes(investigation[PDS4_INFO_MODEL.LID])
              || instrumentHostInvestigationLids.includes(investigation[PDS4_INFO_MODEL.LID])
            )
            &&
            ( 
              searchFilters.type === undefined 
              || searchFilters.type === INVESTIGATION_TYPE.ALL 
              || searchFilters.type === investigation[PDS4_INFO_MODEL.INVESTIGATION.TYPE] 
            )
          )
        }
      );

    }

    // Sort investigations alphabetically by title and then return the list
    return filteredInvestigations.sort( (a:Investigation,b:Investigation) => {
      if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
        return -1
      } else if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
        return 1
      }
      return 0;
    });

  }
)