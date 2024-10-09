/**
 * 
 * @param arr The array containing items to generate a distinct array
 * @returns An array containing distinct items
 */
export const distinct = <T>(arr:Array<T>) =>{
  return arr.filter( (value:unknown, index:number, array:Array<T>) => {
    return array.indexOf(<T>value) === index;
  });
}