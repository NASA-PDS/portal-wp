export enum LID_FORMAT {
  DEFAULT = 'DEFAULT',
  URL_FRIENDLY = 'url-friendly'
}

export const convertLogicalIdentifier = (lid:string, toFormat:LID_FORMAT):string => {

  if( toFormat === LID_FORMAT.DEFAULT) {
    return lid.replace(/----/g, "_").replace(/---/g,".").replace(/--/g, ":")
  }
  
  if( toFormat === LID_FORMAT.URL_FRIENDLY) {
    return lid.replace(/:/g, "--").replace(/\./g, "---").replace(/_/g,"----")
  }

  return "";

};