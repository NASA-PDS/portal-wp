import { createSelector } from "@reduxjs/toolkit";
import { TargetItems } from "src/state/slices/targetsSlice";
import { RootState } from "src/state/store";
import { Target } from "src/types/target.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";

export const targetDataReady = (state:RootState):boolean => {
  return state.targets.status === 'succeeded';
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
 * A memoized redux selector that efficiently returns the latest list of targets.
 * @returns {Target[]} A list of the latest targets.
 */
export const selectLatestVersionTargets = createSelector([selectTargets], (targets) => {

  let latestTargets:Target[] = [];
  
  // Find the latest version of each target and store it in an array
  let latestVersion:string = "";
  Object.keys(targets).forEach( (lid) => {
    latestVersion = Object.keys(targets[lid]).sort().reverse()[0];
    latestTargets.push( targets[lid][latestVersion] );
  });

  return latestTargets;

});

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of targets.
 * @returns {Target[]} A filtered, latest list of targets.
 */
export const selectFilteredTargets = createSelector([selectLatestVersionTargets], (latestTargets:Target[]) => {
  
  // Sort targets alphabetically by title
  latestTargets.sort( (a:Target,b:Target) => {
    if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return -1
    } else if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return 1
    }
    return 0;
  });

});

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