import { createSelector } from "@reduxjs/toolkit";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { InstrumentItems, InstrumentsState } from "src/state/slices/instrumentsSlice";
import { Instrument } from "src/types/instrument.d";

/**
 * A redux selector to efficiently retrieve a list of the latest instruments.
 * @param {InstrumentsState} state The instruments redux state of type InstrumentsState
 * @returns {Instrument[]} An array containing the list of the latest versions of all instruments
 */
export const selectLatestVersionInstruments = (state:InstrumentsState): InstrumentItems => {
  return state.items;
};

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of instruments.
 * @returns {Instrument[]} An filtered, and latest list of instruments
 */
export const selectFilteredInstruments = createSelector([selectLatestVersionInstruments], (instruments:InstrumentItems) => {

  let latestInstruments:Instrument[] = [];
  
  // Find the latest version of each instrument and store it in an array
  let latestVersion:string = "";
  Object.keys(instruments).forEach( (lid) => {
    latestVersion = Object.keys(instruments[lid]).sort().reverse()[0];
    latestInstruments.push( instruments[lid][latestVersion] );
  });
  
  // Sort instruments alphabetically by title
  latestInstruments.sort( (a:Instrument,b:Instrument) => {
    if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return -1
    } else if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return 1
    }
    return 0;
  });

});