import { createSelector } from "@reduxjs/toolkit";
import { InstrumentHost } from "src/types/instrumentHost.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { RootState } from "src/state/store";
import { InstrumentHostItems } from "src/state/slices/instrumentHostsSlice";

/**
 * A redux selector to efficiently retrieve a list of the latest instrument hosts.
 * @param {RootState} state The instrument hosts redux state of type InstrumentHostsState
 * @returns {InstrumentHost[]} An array containing the list of the latest versions of all instrument hosts
 */
export const selectLatestVersionInstrumentHosts = (state:RootState): InstrumentHostItems => {
  return state.instrumentHosts.items;
};

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of instrument hosts.
 * @returns {InstrumentHost[]} An filtered, and latest list of instrument hosts
 */
export const selectFilteredInstrumentHosts = createSelector([selectLatestVersionInstrumentHosts], (instrumentHosts:InstrumentHostItems) => {

  let latestInstrumentHosts:InstrumentHost[] = [];
  
  // Find the latest version of each instrument host and store it in an array
  let latestVersion:string = "";
  Object.keys(instrumentHosts).forEach( (lid) => {
    latestVersion = Object.keys(instrumentHosts[lid]).sort().reverse()[0];
    latestInstrumentHosts.push( instrumentHosts[lid][latestVersion] );
  });
  
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