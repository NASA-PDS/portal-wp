import { Collection } from "src/types";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";

/**
 * This function generates a distinct set of values using 
 * the supplied array.
 * @param arr The array containing items to generate a distinct array
 * @returns An array containing distinct items
 */
export const distinct = <T>(arr:Array<T>) =>{
  return arr.filter( (value:unknown, index:number, array:Array<T>) => {
    return array.indexOf(<T>value) === index;
  });
}

/**
 * This function is used to sort collections by their title in ascending order
 * @param a The first collection for comparison
 * @param b The second collection for comparison
 * @returns Sorted Array of collections
 */
export const sortByTitle = (a:Collection, b:Collection) => {
  if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
    return -1
  } else if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
    return 1
  }
  return 0;
}