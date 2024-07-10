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

export const ellipsisText = (str:string, maxLength:number):string => {

  if( str.length > maxLength ) {
    return str.substring(0,maxLength) + "..."
  }

  return str

}

// Reference: https://www.freecodecamp.org/news/copy-text-to-clipboard-javascript/
export const copyToClipboard = async (element:string) => {
  const text = document.getElementById(element)?.innerHTML || "";
  try {
    await navigator.clipboard.writeText(text);
    alert("\"" + text + "\" has been copied to your clipboard!");
    console.log('Content copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}