import { createSelector } from "@reduxjs/toolkit";
import { InstrumentHost } from "src/types/instrumentHost.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { RootState } from "src/state/store";
import { InstrumentHostItems } from "src/state/slices/instrumentHostsSlice";

export const instrumentHostDataReady = (state:RootState):boolean => {
  return state.instrumentHosts.status === 'succeeded';
};

/**
 * A redux selector to retrieve instrument host data stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {InstrumentHostItems} A data structure containing the current state of versioned instrument hosts
 */
const selectInstrumentHosts = (state:RootState): InstrumentHostItems => {
  return state.instrumentHosts.items;
};

/**
 * A memoized redux selector that efficiently returns the latest list of instrument hosts.
 * @returns {InstrumentHost[]} A list of the latest instrument hosts.
 */
export const selectLatestVersionInstrumentHosts = createSelector([selectInstrumentHosts], (instrumentHosts) => {

  let latestInstrumentHost:InstrumentHost[] = [];
  
  // Find the latest version of each instrument and store it in an array
  let latestVersion:string = "";
  Object.keys(instrumentHosts).forEach( (lid) => {
    latestVersion = Object.keys(instrumentHosts[lid]).sort().reverse()[0];
    latestInstrumentHost.push( instrumentHosts[lid][latestVersion] );
  });

  return latestInstrumentHost;

});

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of instrument hosts.
 * @returns {InstrumentHost[]} A filtered, latest list of instrument hosts
 */
export const selectFilteredInstrumentHosts = createSelector([selectLatestVersionInstrumentHosts], (latestInstrumentHosts:InstrumentHost[]) => {
 
  // Sort instrument hosts alphabetically by title
  latestInstrumentHosts.sort( (a:InstrumentHost,b:InstrumentHost) => {
    if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return -1
    } else if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return 1
    }
    return 0;
  });

});

export const selectLatestInstrumentHostsForInvestigation = createSelector(
  [
    selectLatestVersionInstrumentHosts,
    (_, instrumentHostLids) => instrumentHostLids
  ],
  (latestInstrumentHosts, instrumentHostLids) => {
    return latestInstrumentHosts.filter(
      (instrumentHost) => {
        return instrumentHostLids?.includes(instrumentHost[PDS4_INFO_MODEL.LID])
      }
    );
  }
);