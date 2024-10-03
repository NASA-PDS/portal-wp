import { createSelector } from "@reduxjs/toolkit";
import { Instrument, INSTRUMENT_TYPE } from "src/types/instrument.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { RootState } from "src/state/store";
import { InstrumentItems } from "src/state/slices/instrumentsSlice";
import { selectLatestVersionTargets } from "./targets";
import { selectLatestVersionInstrumentHosts } from "./instrumentHost";

export const instrumentDataReady = (state:RootState):boolean => {
  return state.instruments.status === 'succeeded';
};

/**
 * A redux selector to retrieve instrument data stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {InstrumentItems} An data structure containing the current state of versioned instruments
 */
const selectInstruments = (state:RootState): InstrumentItems => {
  return state.instruments.items;
};

/**
 * A redux selector to retrieve instrument data stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @param {string} lid The lid of the instrument that needs to be returned
 * @returns {Object<[key: string]: Instrument>} A hash array of instrument versions
 */
const selectInstrument = (state:RootState, lid:string):{[key:string]: Instrument} => {
  return state.instruments.items[lid];
}

/**
 * The search filter that should be applied to the list of instruments.
 * @param {RootState} state The redux state of type RootState
 * @returns {string} The search filter currently being applied
 */
const selectSearchFilters = (state:RootState) => {
  return state.instruments.searchFilters;
};

/**
 * A memoized redux selector that efficiently returns the latest list of instruments.
 * @returns {Instrument[]} A list of the latest instruments.
 */
export const selectLatestVersionInstruments = createSelector([selectInstruments], (instruments) => {

  const latestInstruments:Instrument[] = [];
  
  // Find the latest version of each instrument and store it in an array
  let latestVersion:string = "";
  Object.keys(instruments).forEach( (lid) => {
    latestVersion = Object.keys(instruments[lid]).sort().reverse()[0];
    latestInstruments.push( instruments[lid][latestVersion] );
  });

  return latestInstruments;

});

/**
 * A memoized redux selector that returns the latest instrument.
 * @returns {Instrument} The latest instrument.
 */
export const selectLatestInstrumentVersion = createSelector( [selectInstrument], (instrumentVersions) => {

  // Find the latest version of the instrument
  const latestVersion:string = Object.keys(instrumentVersions).sort().reverse()[0];

  return instrumentVersions[latestVersion];

});

/**
 * A memoized redux selector that returns a list of instruments based on the
 * provided list of instrument hosts
 * 
 */
export const selectLatestInstrumentsForInstrumentHost = createSelector(
  [
    selectLatestVersionInstruments,
    (_, instrumentLids) => instrumentLids
  ],
  (latestInstruments, instrumentLids) => {

    return latestInstruments.filter(
      (instrument) => {
        return instrumentLids.includes(instrument[PDS4_INFO_MODEL.LID])
      }
    );

  }
);

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of instruments.
 * @returns {Instrument[]} A filtered, latest list of instruments.
 */
export const selectFilteredInstruments = createSelector(
  [
    selectLatestVersionInstruments,
    selectLatestVersionInstrumentHosts,
    selectLatestVersionTargets,
    selectSearchFilters], 
  (
    latestInstruments,
    latestInstrumentHosts,
    latestTargets,
    searchFilters
  ) => {

    let filteredInstruments = latestInstruments;

    // Search Filters are undefined, so return full list of investigations
    if( searchFilters !== undefined ) {

      filteredInstruments = filteredInstruments.filter(
        (instrument) => {
          return (
            (
              searchFilters.freeText === undefined 
              || instrument[PDS4_INFO_MODEL.TITLE].toLowerCase().includes(searchFilters?.freeText.toLowerCase() || "")
              || instrument[PDS4_INFO_MODEL.LID].toLowerCase().includes(searchFilters?.freeText.toLowerCase() || "")
            )
            &&
            ( 
              searchFilters.type === undefined 
              || searchFilters.type === INSTRUMENT_TYPE.ALL 
              || instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE].includes(searchFilters.type)
            )
          )
        }
      );

    }

    // Sort instruments alphabetically by title
    return filteredInstruments.sort( (a:Instrument,b:Instrument) => {
      if( a[PDS4_INFO_MODEL.INSTRUMENT.NAME].toLowerCase() < b[PDS4_INFO_MODEL.INSTRUMENT.NAME].toLowerCase() ) {
        return -1
      } else if( a[PDS4_INFO_MODEL.INSTRUMENT.NAME].toLowerCase() > b[PDS4_INFO_MODEL.INSTRUMENT.NAME].toLowerCase() ) {
        return 1
      }
      return 0;
    });

  }
);