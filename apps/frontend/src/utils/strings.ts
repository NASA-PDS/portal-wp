export const stringCleanup = (str:string, lid:string | undefined = undefined, type:string | undefined = undefined):string => {

  let cleanedString:string = str;
  
  [
    "INSTRUMENT: IMAGING SCIENCE SUBSYSTEM - NARROW ANGLE SPACECRAFT: VOYAGER 1 Instrument Information ====================== Instrument Id : ISSN Instrument Host Id : VG1 Pi Pds User Id : BASMITH Naif Data Set Id : UNK Instrument Name : IMAGING SCIENCE SUBSYSTEM - NARROW ANGLE Instrument Type : VIDICON CAMERA Build Date : 1976-12-17 Instrument Mass : 22.060000 Instrument Length : 0.980000 Instrument Width : 0.250000 Instrument Height : 0.250000 Instrument Serial Number : SN07 Instrument Manufacturer Name : JET PROPULSION LABORATORY Instrument Description ====================== ",
    "INSTRUMENT: IMAGING SCIENCE SUBSYSTEM - WIDE ANGLE SPACECRAFT: VOYAGER 1 Instrument Information ====================== Instrument Id : ISSW Instrument Host Id : VG1 Pi Pds User Id : BASMITH Naif Data Set Id : UNK Instrument Name : IMAGING SCIENCE SUBSYSTEM - WIDE ANGLE Instrument Type : VIDICON CAMERA Build Date : 1976-12-17 Instrument Mass : 13.300000 Instrument Length : 0.550000 Instrument Width : 0.200000 Instrument Height : 0.200000 Instrument Serial Number : SN06 Instrument Manufacturer Name : JET PROPULSION LABORATORY Instrument Description ====================== ",
    "INSTRUMENT: FLUXGATE MAGNETOMETER SPACECRAFT: VOYAGER 1 Instrument Information ====================== Instrument Id : MAG Instrument Host Id : VG1 Pi Pds User Id : NNESS Principal Investigator : NORMAN F. NESS Instrument Name : FLUXGATE MAGNETOMETER Instrument Type : MAGNETOMETER Build Date : 1977-09-05 Instrument Mass : 5.600000 Instrument Length : 13.000000 Instrument Width : UNK Instrument Height : UNK Instrument Serial Number : UNK Instrument Description ====================== ",
    "Instrument Overview =================== ",
    "INSTRUMENT: LOW ENERGY CHARGED PARTICLE SPACECRAFT: VOYAGER 1 Instrument Information ====================== Instrument Id : LECP Instrument Host Id : VG1 PI Pds User Id : KRIMIGIS PI Full Name : STAMITIOS M. KRIMIGIS Instrument Name : LOW ENERGY CHARGED PARTICLE Instrument Type : CHARGED PARTICLE ANALYZER Build Date : 1977-09-05 Instrument Mass : 6.652000 Instrument Length : UNK Instrument Width : UNK Instrument Height : UNK Instrument Serial Number : 03 Instrument Manufacturer Name : JOHNS HOPKINS UNIVERSITY APPLIED PHYSICS LABORATORY ",
    "INSTRUMENT: PLASMA WAVE RECEIVER SPACECRAFT: VOYAGER 1 Instrument Id : PWS Instrument Host Id : VG1 Principal Investigator : DONALD A. GURNETT PI PDS User Id : DGURNETT Instrument Name : PLASMA WAVE RECEIVER Instrument Type : PLASMA WAVE SPECTROMETER Build Date : UNK Instrument Mass : 1.400000 Instrument Length : 0.318000 Instrument Width : 0.185000 Instrument Height : 0.048000 Instrument Serial Number : SN002 Instrument Manufacturer Name : THE UNIVERSITY OF IOWA ",
    "INSTRUMENT: PLANETARY RADIO ASTRONOMY RECEIVER SPACECRAFT: VOYAGER 1 Instrument Information ====================== Instrument Id : PRA Instrument Host Id : VG1 Instrument Name : PLANETARY RADIO ASTRONOMY RECEIVER Instrument Type : RADIO SPECTROMETER PI Name : JAMES W. WARWICK Build Date : UNK Instrument Mass : 7.700000 Instrument Height : UNK Instrument Length : UNK Instrument Width : UNK Instrument Manufacturer Name : MARTIN MARIETTA Instrument Serial Number : UNK Science Objectives ================== ",
    "INSTRUMENT: INFRARED INTERFEROMETER SPECTROMETER AND RADIOMETER HOST: VOYAGER 1 Instrument Information ====================== Instrument Id : IRIS Instrument Host Id : VG1 Instrument Name : INFRARED INTERFEROMETER SPECTROMETER AND RADIOMETER Instrument Type : INFRARED INTERFEROMETER Instrument Description ====================== ",
    "INSTRUMENT : PLASMA SCIENCE EXPERIMENT SPACECRAFT : VOYAGER 1 Instrument Information ====================== Instrument Id : PLS Instrument Host Id : VG1 Principal Investigator : JOHN D. RICHARDSON Pi Pds User Id : JRICHARDSON Instrument Name : PLASMA SCIENCE EXPERIMENT Instrument Type : PLASMA INSTRUMENT Build Date : 1973 Instrument Mass : 9.900000 Instrument Length : UNK Instrument Width : UNK Instrument Height : UNK Instrument Serial Number : SN002 Instrument Manufacturer Name : MASSACHUSETTS INSTITUTE OF TECHNOLOGY Instrument Description ====================== ",
    "INSTRUMENT: ULTRAVIOLET SPECTROMETER SPACECRAFT: VOYAGER 1 & 2 Instrument Information ====================== Instrument Id : UVS Instrument Host Id : { VG1, VG2 } Pi PDS User Id : ALBROADFOOT Instrument Name : ULTRAVIOLET SPECTROMETER Instrument Type : ULTRAVIOLET SPECTROMETER Build Date : N/A Instrument Mass : 4.52 Instrument Length : 43.18 Instrument Width : 14.78 Instrument Height : 17.15 Instrument Serial Number : 3 Instrument Manufacturer Name : N/A Instrument Description ====================== ",
    "INSTRUMENT: IMAGING SCIENCE SUBSYSTEM - NARROW ANGLE SPACECRAFT: VOYAGER 2 Instrument Information ====================== Instrument Id : ISSN Instrument Host Id : VG2 Pi Pds User Id : BASMITH Naif Data Set Id : UNK Instrument Name : IMAGING SCIENCE SUBSYSTEM - NARROW ANGLE Instrument Type : VIDICON CAMERA Build Date : 1976-12-17 Instrument Mass : 22.060000 Instrument Length : 0.980000 Instrument Width : 0.250000 Instrument Height : 0.250000 Instrument Serial Number : SN05 Instrument Manufacturer Name : JET PROPULSION LABORATORY Instrument Description ====================== ",
    "INSTRUMENT: IMAGING SCIENCE SUBSYSTEM - WIDE ANGLE SPACECRAFT: VOYAGER 2 Instrument Information ====================== Instrument Id : ISSW Instrument Host Id : VG2 Pi Pds User Id : BASMITH Naif Data Set Id : UNK Instrument Name : IMAGING SCIENCE SUBSYSTEM - WIDE ANGLE Instrument Type : VIDICON CAMERA Build Date : 1976-12-17 Instrument Mass : 13.300000 Instrument Length : 0.550000 Instrument Width : 0.200000 Instrument Height : 0.200000 Instrument Serial Number : SN04 Instrument Manufacturer Name : JET PROPULSION LABORATORY Instrument Description ====================== ",
    "INSTRUMENT: TRIAXIAL FLUXGATE MAGNETOMETER SPACECRAFT: VOYAGER 2 Instrument Information ====================== Instrument Id : MAG Instrument Host Id : VG2 Pi Pds User Id : NNESS Principal Investigator : NORMAN F. NESS Instrument Name : TRIAXIAL FLUXGATE MAGNETOMETER Instrument Type : MAGNETOMETER Build Date : 1977-08-20 Instrument Mass : 5.600000 Instrument Length : 13.000000 Instrument Width : UNK Instrument Height : UNK Instrument Serial Number : UNK Instrument Manufacturer Name : UNK Instrument Description ====================== ",
    "INSTRUMENT: LOW ENERGY CHARGED PARTICLE SPACECRAFT: VOYAGER 2 Instrument Information ====================== Instrument Id : LECP Instrument Host Id : VG2 PI Pds User Id : KRIMIGIS PI Full Name : STAMITIOS M. KRIMIGIS Instrument Name : LOW ENERGY CHARGED PARTICLE Instrument Type : CHARGED PARTICLE ANALYZER Build Date : 1977-08-20 Instrument Mass : 6.652000 Instrument Length : UNK Instrument Width : UNK Instrument Height : UNK Instrument Serial Number : 01 Instrument Manufacturer Name : JOHNS HOPKINS UNIVERSITY APPLIED PHYSICS LABORATORY ",
    "Principal Investigator: R.E. Vogt The following section on instrumentation has been extracted from the NSSDC documentation for the Voyager Cosmic Ray Subsystem (Reference_ID = NSSDCCRS1979). ",
    "INSTRUMENT: PHOTOPOLARIMETER SUBSYSTEM SPACECRAFT: VOYAGER 2 ",
    "INSTRUMENT: PLASMA WAVE RECEIVER SPACECRAFT: VOYAGER 2 Instrument Id : PWS Instrument Host Id : VG2 Principal Investigator : DONALD A. GURNETT PI PDS User Id : DGURNETT Instrument Name : PLASMA WAVE RECEIVER Instrument Type : PLASMA WAVE SPECTROMETER Build Date : 1976-11-28 Instrument Mass : 1.400000 Instrument Length : 0.318000 Instrument Width : 0.185000 Instrument Height : 0.048000 Instrument Serial Number : SN003 Instrument Manufacturer Name : THE UNIVERSITY OF IOWA ",
    "INSTRUMENT: PLASMA SCIENCE EXPERIMENT SPACECRAFT: VOYAGER 2 Instrument Information ====================== Instrument Id : PLS Instrument Host Id : VG2 Principal Investigator : JOHN W. BELCHER Pi Pds User Id : JBELCHER Instrument Name : PLASMA SCIENCE EXPERIMENT Instrument Type : PLASMA INSTRUMENT Build Date : 1973-01-01 Instrument Mass : 9.900000 Instrument Length : UNK Instrument Width : UNK Instrument Height : UNK Instrument Serial Number : SN001 Instrument Manufacturer Name : MASSACHUSETTS INSTITUTE OF TECHNOLOGY Instrument Description ====================== ",
    "INSTRUMENT: PLANETARY RADIO ASTRONOMY RECEIVER SPACECRAFT: VOYAGER 2 Instrument Information ====================== Instrument Id : PRA Instrument Host Id : VG2 Instrument Name : PLANETARY RADIO ASTRONOMY RECEIVER Instrument Type : RADIO SPECTROMETER PI Name : JAMES W. WARWICK Build Date : UNK Instrument Mass : 7.700000 Instrument Height : UNK Instrument Length : UNK Instrument Width : UNK Instrument Manufacturer Name : MARTIN MARIETTA Instrument Serial Number : UNK Science Objectives ================== ",
    "INSTRUMENT: INFRARED INTERFEROMETER SPECTROMETER AND RADIOMETER HOST: VOYAGER 2 Instrument Information ====================== Instrument Id : IRIS Instrument Host Id : VG2 Instrument Name : INFRARED INTERFEROMETER SPECTROMETER AND RADIOMETER Instrument Type : INFRARED INTERFEROMETER Instrument Description ====================== ",
    "Scientific Objectives ===================== ",
    "See external reference.",
    "SEE INSTRUMENT OVERVIEW BELOW",
    "Target Overview =============== "
  ].forEach( (entry) => {
    cleanedString = cleanedString.replace(entry, "")
  })
  
  /*if( lid === "urn:nasa:pds:context:instrument:accel.msl" ) {
    cleanedString = "The Curiosity rover has accelerometers for measuring acceleration and gyroscopes for measuring orientation and angular velocity on board. The very accurate sensors are used to navigate the surface of Mars and point its other instruments in the right direction. While these instruments weren’t designed for measuring gravity, scientists realized that they could use them to gather data.";
  } else if( lid === "urn:nasa:pds:context:instrument:mast_left.msl" ) {
    cleanedString = "The Mast-mounted Cameras (Mastcams) are two instrument suite of imaging systems on the Mars Science Laboratory rover's Remote Sensing Mast (RSM).";
  }*/

  switch (lid) {
    case "urn:nasa:pds:context:instrument:accel.msl":
      cleanedString = "The Curiosity rover has accelerometers for measuring acceleration and gyroscopes for measuring orientation and angular velocity on board. The very accurate sensors are used to navigate the surface of Mars and point its other instruments in the right direction. While these instruments weren’t designed for measuring gravity, scientists realized that they could use them to gather data.";
      break;
    case "urn:nasa:pds:context:instrument:mast_left.msl":
      cleanedString = "The Mast-mounted Cameras (Mastcams) are two instrument suite of imaging systems on the Mars Science Laboratory rover's Remote Sensing Mast (RSM).";
      break;
  }

  if( type?.toUpperCase() === "TARGET") {
    // Special replacements
    cleanedString = cleanedString.substring(0, cleanedString.indexOf(";"))
  }
  
  if( cleanedString.length > 200 ) {
    cleanedString = cleanedString.substring(0,200) + "..."
  }

  return cleanedString;
  
}