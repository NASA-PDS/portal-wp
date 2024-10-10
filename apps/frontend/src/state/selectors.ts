import { createSelector } from "@reduxjs/toolkit";
import { INVESTIGATION_TYPE, Investigation } from "src/types/investigation";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { RootState } from "src/state/store";
import { InstrumentItems } from "src/state/slices/instrumentsSlice";
import { InstrumentHostItems } from "src/state/slices/instrumentHostsSlice";
import { InvestigationItems } from "src/state/slices/investigationsSlice";
import { TargetItems } from "src/state/slices/targetsSlice";
import { Instrument, INSTRUMENT_TYPE } from "src/types/instrument";
import { InstrumentHost } from "src/types/instrumentHost";
import { Target } from "src/types/target";



export const instrumentDataReady = (state:RootState):boolean => {
  return state.instruments.status === 'succeeded';
};

export const instrumentHostDataReady = (state:RootState):boolean => {
  return state.instrumentHosts.status === 'succeeded';
};

export const investigationDataReady = (state:RootState):boolean => {
  return state.investigations.status === 'succeeded';
};

export const targetDataReady = (state:RootState):boolean => {
  return state.targets.status === 'succeeded';
};

/**
 * A redux selector to retrieve all instruments stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {InstrumentItems} An data structure containing the current state of versioned instruments
 */
const selectInstruments = (state:RootState): InstrumentItems => {
  return state.instruments.items;
};

/**
 * A redux selector to retrieve an instrument stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @param {string} lid The lid of the instrument that needs to be returned
 * @returns {Object<[key: string]: Instrument>} A hash array of instrument versions
 */
const selectInstrument = (state:RootState, lid:string):{[key:string]: Instrument} => {
  return state.instruments.items[lid];
}

/**
 * A redux selector to retrieve all instrument hosts stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {InstrumentHostItems} A data structure containing the current state of versioned instrument hosts
 */
const selectInstrumentHosts = (state:RootState): InstrumentHostItems => {
  return state.instrumentHosts.items;
};

/**
 * A redux selector to retrieve an instrument host stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {InstrumentHostItems} A data structure containing the current state of versioned instrument hosts
 */
const selectInstrumentHost = (state:RootState, lid:string) => {
  return state.instrumentHosts.items[lid];
};


/**
 * A redux selector to retrieve investigation data stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {InvestigationItems} An object containing the current state of versioned investigations
 */
const selectInvestigations = (state:RootState): InvestigationItems => {
  return state.investigations.items;
};

/**
 * A redux selector to retrieve an investigation stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {Investigation[]} An object containing versions of an investigation
 */
const selectInvestigation = (state:RootState, lid:string) => {
  return state.investigations.items[lid];
}

/**
 * The search filter that should be applied to the list of instruments.
 * @param {RootState} state The redux state of type RootState
 * @returns {string} The search filter currently being applied
 */
const selectInstrumentDirectorySearchFilters = (state:RootState) => {
  return state.instruments.searchFilters;
};

/**
 * The search filter that should be applied to the list of investigations.
 * @param {RootState} state The redux state of type RootState
 * @returns {string} The search filter currently being applied
 */
const selectInvestigationDirectorySearchFilters = (state:RootState) => {
  return state.investigations.searchFilters;
};

export const selectInvestigationVersion = (state:RootState, lid:string, version:string) => {
  return state.investigations.items[lid][version]
};

/**
 * A redux selector to retrieve target data stored in our redux state.
 * @param {RootState} state The redux state of type RootState
 * @returns {TargetItems} An data structure containing the current state of versioned targets
 */
const selectTargets = (state:RootState): TargetItems => {
  return state.targets.items;
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
 * A memoized redux selector that efficiently returns the latest list of instrument hosts.
 * @returns {InstrumentHost[]} A list of the latest instrument hosts.
 */
export const selectLatestVersionInstrumentHosts = createSelector([selectInstrumentHosts], (instrumentHosts) => {

  const latestInstrumentHost:InstrumentHost[] = [];
  
  // Find the latest version of each instrument and store it in an array
  let latestVersion:string = "";
  Object.keys(instrumentHosts).forEach( (lid) => {
    latestVersion = Object.keys(instrumentHosts[lid]).sort().reverse()[0];
    latestInstrumentHost.push( instrumentHosts[lid][latestVersion] );
  });

  return latestInstrumentHost;

});

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
 * A memoized redux selector that efficiently returns the latest list of targets.
 * @returns {Target[]} A list of the latest targets.
 */
export const selectLatestVersionTargets = createSelector([selectTargets], (targets) => {

  const latestTargets:Target[] = [];
  
  // Find the latest version of each target and store it in an array
  let latestVersion:string = "";
  Object.keys(targets).forEach( (lid) => {
    latestVersion = Object.keys(targets[lid]).sort().reverse()[0];
    latestTargets.push( targets[lid][latestVersion] );
  });

  return latestTargets;

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

export const selectLatestInstrumentHostVersion = createSelector( [selectInstrumentHost], (instrumentHostVersions) => {

  // Find the latest version of the instrument
  const latestVersion:string = Object.keys(instrumentHostVersions).sort().reverse()[0];

  return instrumentHostVersions[latestVersion];

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
 * A memoized redux selector that returns a list of instruments based on the
 * provided list of instrument hosts
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

export const selectLatestInstrumentHostsForInstrument = createSelector(
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

/**
 * A memoized redux selector that returns a list of targets based on the
 * provided list of instrument hosts
  */
export const selectLatestTargetsForInstrumentHost = createSelector(
  [
    selectLatestVersionTargets,
    (_, targetLids) => targetLids
  ],
  (latestTargets, targetLids) => {

    return latestTargets.filter(
      (target) => {
        return targetLids.includes(target[PDS4_INFO_MODEL.LID])
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
    selectLatestVersionInvestigations,
    selectLatestVersionTargets,
    selectInstrumentDirectorySearchFilters], 
  (
    latestInstruments,
    latestInstrumentHosts,
    latestInvestigations,
    latestTargets,
    searchFilters
  ) => {

    const searchText = searchFilters?.freeText?.toLowerCase() || "";
    let filteredInstruments = latestInstruments;

    // Search Filters are undefined, so return full list of investigations
    if( searchFilters !== undefined ) {
 
      let filteredInvestigations:string[] = [];
      let filteredTargets:string[] = [];
      let filteredInstrumentHosts:string[] = [];

      if( searchFilters.freeText !== undefined ) {

        // Get Investigations that match the search term
        filteredInvestigations = latestInvestigations.filter(
          (investigation) => {
            return (
              investigation[PDS4_INFO_MODEL.TITLE].toLowerCase().includes(searchText)
              ||
              investigation[PDS4_INFO_MODEL.LID].toLowerCase().includes(searchText)
            )
          }
        ).map( (investigation) => { return investigation[PDS4_INFO_MODEL.LID]});

        filteredTargets = latestTargets.filter(
          (target) => {
            return (
              target[PDS4_INFO_MODEL.TITLE].toLowerCase().includes(searchText)
              ||
              target[PDS4_INFO_MODEL.LID].toLowerCase().includes(searchText)
            )
          }
        ).map( (target) => { return target[PDS4_INFO_MODEL.LID]})

        filteredInstrumentHosts = latestInstrumentHosts.filter( (instrumentHost) => {
          return (
            instrumentHost[PDS4_INFO_MODEL.REF_LID_TARGET]?.filter( (instrumentHostTarget) => {
              return filteredTargets.includes(instrumentHostTarget);
            }).length > 0
            ||
            instrumentHost[PDS4_INFO_MODEL.REF_LID_INVESTIGATION]?.filter( (instrumentHostInvestigation) => {
              return filteredInvestigations.includes(instrumentHostInvestigation);
            }).length > 0
          )
        }).map( (instrumentHost) => { return instrumentHost[PDS4_INFO_MODEL.LID]});
      }

      filteredInstruments = filteredInstruments.filter(
        (instrument) => {
          return (
            (
              searchFilters.freeText === undefined 
              || instrument[PDS4_INFO_MODEL.TITLE].toLowerCase().includes(searchText || "")
              || instrument[PDS4_INFO_MODEL.LID].toLowerCase().includes(searchText || "")
              || instrument[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST].some( (lid) => filteredInstrumentHosts.includes(lid) )
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
      const instrumentA = a[PDS4_INFO_MODEL.TITLE].toLowerCase();
      const instrumentB = b[PDS4_INFO_MODEL.TITLE].toLowerCase();
      if( instrumentA < instrumentB ) {
        return -1
      } else if( instrumentA > instrumentB ) {
        return 1
      }
      return 0;
    });

  }
);

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of instrument hosts.
 * @returns {InstrumentHost[]} A filtered, latest list of instrument hosts
 */
export const selectFilteredInstrumentHosts = createSelector([selectLatestVersionInstrumentHosts], (latestInstrumentHosts:InstrumentHost[]) => {
 
  // Sort instrument hosts alphabetically by title
  latestInstrumentHosts.sort( (a:InstrumentHost,b:InstrumentHost) => {
    if( a[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME].toLowerCase() < b[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME].toLowerCase() ) {
      return -1
    } else if( a[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME].toLowerCase() > b[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME].toLowerCase() ) {
      return 1
    }
    return 0;
  });

});

export const selectFilteredInvestigations = createSelector(
  [ selectLatestVersionInvestigations, selectLatestVersionTargets, selectLatestVersionInstruments, selectInvestigationDirectorySearchFilters ],
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
            target[PDS4_INFO_MODEL.TITLE]?.toLowerCase().includes(searchFilters?.freeText.toLowerCase() || "")
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
);

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of targets.
 * @returns {Target[]} A filtered, latest list of targets.
 */
export const selectFilteredTargets = createSelector([selectLatestVersionTargets], (latestTargets:Target[]) => {
  
  // Sort targets alphabetically by title
  return latestTargets.sort( (a:Target,b:Target) => {
    if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return -1
    } else if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return 1
    }
    return 0;
  });

});