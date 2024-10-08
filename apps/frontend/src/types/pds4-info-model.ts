/** 
 * The PDS4 Information Model of the Planetary Data System (PDS) 
 * represented as a const for easy reference in queries and 
 * data objects
*/
export const PDS4_INFO_MODEL = {
  
  /** An identifier for the set of all versions of an object */
  LID: "lid",

  /** An identifier for the version of something else  */
  VID: "vid",

  /** The concatenation of a logical identifier (LID) with a version identifier (VID) */
  LIDVID: "lidvid",

  /** A set of related targets, listed by their respective logical identifiers (LID) */
  REF_LID_TARGET: "ref_lid_target",

  /** A set of related instruments, listed by their respective logical identifiers (LID) */
  REF_LID_INSTRUMENT: "ref_lid_instrument",
  
  /** An identifier for the set of related instrument host logical identifiers (LID) */
  REF_LID_INSTRUMENT_HOST: "ref_lid_instrument_host",

  /** An identifier for the set of related investigation logical identifiers (LID) */
  REF_LID_INVESTIGATION: "ref_lid_investigation",

  /** The Observing System Component class describes one or more subsystems used to collect data. */
  OBSERVING_SYSTEM_COMPONENTS: "observing_system_components",

  /** 
   * The title attribute provides a short, descriptive text string suitable for
   * use as a title or brief description in a display or listing of products.
   */
  TITLE: "title",
  
  /**
   * The Alias class provides a single alternate name and identification for
   * this product in this or some other archive or data system.
   */
  ALIAS: {

    /** The alternate_id attribute provides an additional identifier supplied
     * by the data provider.
     */
    ALTERNATE_ID: "pds:Alias.pds:alternate_id",
    
    /** The alternate _title attribute provides an alternate title for the product. */
    ALTERNATE_TITLE: "pds:Alias.pds:alternate_title",

  },

  /** The Bundle class describes a collection of collections. */
  BUNDLE: {

    /**
     * The description attribute provides a statement, picture in words, 
     * or account that describes or is otherwise relevant to the object. 
     */
    DESCRIPTION: "pds:Bundle.pds:description",

    /**
     * The bundle_type attribute provides a classification for the bundle.
     */
    TYPE: "pds:Bundle.pds:bundle_type",

  },

  /** The Type_List_Area allows the insertion of a Type List. */
  CTLI_TYPE_LIST: {

    /** The type attribute classifies the instrument according to its function. */
    TYPE: "ctli:Type_List.ctli:type",
    
  },

  /** The identification area consists of attributes that identify and name an object. */
  IDENTIFICATION_AREA: {

    /** 
     * The title attribute provides a short, descriptive text string suitable use as a 
     * title or brief description in display or listing of products.
     */
    TITLE: "pds:Identification_Area.pds:title",
      
    /** The version_id attribute provides the version of the product, expressed in the PDS [m.n] notation. */
    VERSION_ID: "pds:Identification_Area.pds:version_id",

  },

  /** The Instrument class provides a description of a physical object that collects data. */
  INSTRUMENT: {

    /**
     * The description attribute provides a statement, picture in words, 
     * or account that describes or is otherwise relevant to the object. 
     */
    DESCRIPTION: "pds:Instrument.pds:description",

    /** The name attribute provides a word or combination of words by which the object is known. */
    NAME: "pds:Instrument.pds:name",

    /** The type attribute classifies the instrument according to its function.  */
    TYPE: "pds:Instrument.pds:type",

  },
  
  /** The Instrument Host class provides a description of the physical object upon which an instrument is mounted. */
  INSTRUMENT_HOST: {

    /**
     * The description attribute provides a statement, picture in words, 
     * or account that describes or is otherwise relevant to the object. 
     */
    DESCRIPTION: "pds:Instrument_Host.pds:description",

    /** The name attribute provides a word or combination of words by which the object is known. */
    NAME: "pds:Instrument_Host.pds:name",

    /**
     * The type attribute classifies the instrument host. When more than one value is correct, 
     * the value with the finest granularity should be selected. That is, choose "rover" rather 
     * than "spacecraft" when both would be correct since rover more narrowly defines the 
     * type of instrument host. 
     */
    TYPE: "pds:Instrument_Host.pds:type",

  },

  /** A set of experiments and/or observations with a clearly defined purpose. */
  INVESTIGATION: {

    /**
     * The description attribute provides a statement, picture in words, 
     * or account that describes or is otherwise relevant to the object. 
     */
    DESCRIPTION: "pds:Investigation.pds:description",
  
    /** The name attribute provides a word or combination of words by which the object is known. */
    NAME: "pds:Investigation.pds:name",
  
    /** The start_date attribute provides the date when an activity began.  */
    START_DATE: "pds:Investigation.pds:start_date",
  
    /** The stop_date attribute provides the date when an activity ended. */
    STOP_DATE: "pds:Investigation.pds:stop_date",

    TERSE_DESCRIPTION: "pds:Investigation.pds:terse_description",
  
    /** The type attribute classifies the investigation according to its scope. */
    TYPE: "pds:Investigation.pds:type",
    
  },

  /** 
   * The Primary_Result_Summary class provides a high-level description of the types of 
   * products included in the collection or bundle
   */
  PRIMARY_RESULT_SUMMARY: {

    /** The processing_level attribute provides a broad classification of data processing level. */
    PROCESSING_LEVEL: "pds:Primary_Result_Summary.pds:processing_level"
  },

  /** The Target class provides a description of a physical object that is the object of data collection. */
  TARGET: {

    /**
     * The description attribute provides a statement, picture in words, 
     * or account that describes or is otherwise relevant to the object. 
     */
    DESCRIPTION: "pds:Target.pds:description",

    /** The name attribute provides a word or combination of words by which the object is known. */
    NAME: "pds:Target.pds:name",

    /** The type attribute classifies a target according to its size and properties. */
    TYPE: "pds:Target.pds:type",

  },

} as const;