/** The PDS4 Information Model for components of the Planetary Data System (PDS) */
export namespace PDS4_INFO_MODEL {

  /** An identifier for the set of all versions of an object */
  export const LID = "lid";

  /** An identifier for the version of something else  */
  export const VID = "vid";

  /** The concatenation of a logical identifier (LID) with a version identifier (VID) */
  export const LIDVID = "lidvid";

  /** An identifier for the set of related target logical identifiers (LID) */
  export const REF_LID_TARGET = "ref_lid_target";

  /** An identifier for the set of related instrument logical identifiers (LID) */
  export const REF_LID_INSTRUMENT = "ref_lid_instrument";
  
  /** An identifier for the set of related instrument host logical identifiers (LID) */
  export const REF_LID_INSTRUMENT_HOST = "ref_lid_instrument_host";
  
  /** The title attribute provides a short, descriptive text string suitable for use as a title or brief description in a display or listing of products. */
  export const TITLE = "title";
  
  /** The Alias class provides a single alternate name and identification for this product in this or some other archive or data system. */
  export enum ALIAS {

    /** The alternate_id attribute provides an additional identifier supplied by the data provider. */
    ALTERNATE_ID = "pds:Alias.pds:alternate_id",
    
    /** The alternate _title attribute provides an alternate title for the product. */
    ALTERNATE_TITLE = "pds:Alias.pds:alternate_title",

  }

  /** The identification area consists of attributes that identify and name an object. */
  export enum IDENTIFICATION_AREA {
  
    /** The title attribute provides a short, descriptive text string suitable use as a title or brief description in display or listing of products. */
    TITLE = "pds:Identification_Area/pds:title",
  
    /** The version_id attribute provides the version of the product, expressed in the PDS [m.n] notation. */
    VERSION_ID = "pds:Identification_Area.pds:version_id",
  
  }

  /** A set of experiments and/or observations with a clearly defined purpose. */
  export enum INVESTIGATION {
  
    /** The description attribute provides a statement, picture in words, or account that describes or is otherwise relevant to the object. */
    DESCRIPTION = "pds:Investigation.pds:description",
  
    /** The name attribute provides a word or combination of words by which the object is known. */
    NAME = "pds:Investigation.pds:name",
  
    /** The start_date attribute provides the date when an activity began.  */
    START_DATE = "pds:Investigation.pds:start_date",
  
    /** The stop_date attribute provides the date when an activity ended. */
    STOP_DATE = "pds:Investigation.pds:stop_date",

    TERSE_DESCRIPTION = "pds:Investigation.pds:terse_description",
  
    /** The type attribute classifies the investigation according to its scope. */
    TYPE = "pds:Investigation.pds:type",
  
  }

  export enum INSTRUMENT {
    DESCRIPTION = "pds:Instrument.pds:description",
    NAME = "pds:Instrument.pds:name",
    TYPE = "pds:Instrument.pds:type"
  }

  export enum INSTRUMENT_HOST {
    DESCRIPTION = "pds:Instrument_Host/pds:description",
    TYPE = "pds:Instrument_Host/pds:type",
  }

  export enum TARGET {
    DESCRIPTION = "pds:Target.pds:description",
    NAME = "pds:Target.pds:name",
    TYPE = "pds:Target.pds:type",
  }

  export enum CTLI_TYPE_LIST {
    TYPE = "ctli:Type_List.ctli:type"
  }

}