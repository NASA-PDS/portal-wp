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

export const getFacilityDescription = (title:string, description:string) => {
  return `Portal for ${title}, providing data, telescopes, and other resources. ${description}`;
}

export const getInstrumentDescription = (title:string, description:string) => {
  return `Portal for the ${title} instrument, providing data, tools, and other resources. ${description}`;
}

export const getInstrumentHostDescription = (title:string, description:string) => {
  return `Portal for the ${title} instrument host, providing data, instruments, and other resources. ${description}`;
}

export const getInvestigationDescription = (title:string, description:string) => {
  return `Portal for the ${title} investigation, providing data, instrument hosts, instruments, and other resources. ${description}`;
}

export const getTargetDescription = (title:string, description:string) => {
  return `Portal for the target ${title}, providing data, investigations, and other resources. ${description}`;
}

export const getTelescopeDescription = (title:string, description:string) => {
  return `Portal for ${title}, providing data, instruments, and other resources. ${description}`;
}