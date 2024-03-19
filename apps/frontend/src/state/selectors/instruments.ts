import { createSelector } from "@reduxjs/toolkit";
import { Instrument } from "src/types/instrument.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { RootState } from "src/state/store";
import { InstrumentItems } from "src/state/slices/instrumentsSlice";

/**
 * A redux selector to retrieve instrument data stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {InstrumentItems} An data structure containing the current state of versioned instruments
 */
const selectInstruments = (state:RootState): InstrumentItems => {
  return state.instruments.items;
};

/**
 * A memoized redux selector that efficiently returns the latest list of instruments.
 * @returns {Instrument[]} A list of the latest instruments.
 */
export const selectLatestVersionInstruments = createSelector([selectInstruments], (instruments) => {

  let latestInstruments:Instrument[] = [];
  
  // Find the latest version of each instrument and store it in an array
  let latestVersion:string = "";
  Object.keys(instruments).forEach( (lid) => {
    latestVersion = Object.keys(instruments[lid]).sort().reverse()[0];
    latestInstruments.push( instruments[lid][latestVersion] );
  });

  return latestInstruments;

});

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of instruments.
 * @returns {Instrument[]} A filtered, latest list of instruments.
 */
export const selectFilteredInstruments = createSelector([selectLatestVersionInstruments], (latestInstruments:Instrument[]) => {
  
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