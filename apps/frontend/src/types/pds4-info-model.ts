/** The PDS4 Information Model for components of the Planetary Data System (PDS) */
export namespace PDS4_INFO_MODEL {

  /** An identifier which identifies the set of all versions of an object */
  export const LID = "lid";

  /** An identifier which identifies the version of something else  */
  export const VID = "vid";

  /** The concatenation of a logical identifier (LID) with a version identifier (VID) */
  export const LIDVID = "lidvid";


  /** The Alias class provides a single alternate name and identification for this product in this or some other archive or data system. */
  export enum ALIAS {

    /** The alternate_id attribute provides an additional identifier supplied by the data provider. */
    ALTERNATE_ID = "pds:Alias/pds:alternate_id",
    
    /** The alternate _title attribute provides an alternate title for the product. */
    ALTERNATE_TITLE = "pds:Alias/pds:alternate_title",

  }

  /** The identification area consists of attributes that identify and name an object. */
  export enum IDENTIFICATION_AREA {
  
    /** The title attribute provides a short, descriptive text string suitable use as a title or brief description in display or listing of products. */
    TITLE = "pds:Identification_Area/pds:title",
  
    /** The version_id attribute provides the version of the product, expressed in the PDS [m.n] notation. */
    VERSION_ID = "pds:Identification_Area/pds:version_id",
  
  }

  /** A set of experiments and/or observations with a clearly defined purpose. */
  export enum INVESTIGATION {
  
    /** The description attribute provides a statement, picture in words, or account that describes or is otherwise relevant to the object. */
    DESCRIPTION = "pds:Investigation/pds:description",
  
    /** The name attribute provides a word or combination of words by which the object is known. */
    NAME = "pds:Investigation/pds:name",
  
    /** The start_date attribute provides the date when an activity began.  */
    START_DATE = "pds:Investigation/pds:start_date",
  
    /** The stop_date attribute provides the date when an activity ended. */
    STOP_DATE = "pds:Investigation/pds:stop_date",
  
    /** The type attribute classifies the investigation according to its scope. */
    TYPE = "pds:Investigation/pds:type",
  
  }

}