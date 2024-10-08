import { PDS4_INFO_MODEL } from "./pds4-info-model";

export type Instrument = {

  // PDS Information Model Fields
  [PDS4_INFO_MODEL.LID]:string;
  [PDS4_INFO_MODEL.LIDVID]:string;
  [PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST]:string[];
  [PDS4_INFO_MODEL.TITLE]:string;
  [PDS4_INFO_MODEL.VID]:string;
  [PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE]:string[];
  [PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION]:string;
  [PDS4_INFO_MODEL.INSTRUMENT.NAME]:string;
  [PDS4_INFO_MODEL.INSTRUMENT.TYPE]:string[];

}

export enum INSTRUMENT_TYPE {
  ALL = "ALL",
  ACCELEROMETER = "Accelerometer",
  ALTIMETER = "Altimeter",
  ATMOSPHERIC_SCIENCES = "Atmospheric Sciences",
  DUST = "Dust",
  DUST_DETECTOR = "Dust Detector",
  ENERGETIC_PARTICLE_DETECTOR = "Energetic Particle Detector",
  GRAVIMETER = "Gravimeter",
  IMAGER = "Imager",
  IMAGING_SPECTROMETER = "Imaging Spectrometer",
  INTERFEROMETER = "Interferometer",
  MAGNETOMETER = "Magnetometer",
  MASS_SPECTROMETER = "Mass Spectrometer",
  MICROSCOPE = "Microscope",
  NEUTRON_DETECTOR = "Neutron Detector",
  PARTICLE_DETECTOR = "Particle Detector",
  PHOTOMETER = "Photometer",
  PLASMA_ANALYZER = "Plasma Analyzer",
  PLASMA_WAVE_SPECTROMETER = "Plasma Wave Spectrometer",
  POLARIMETER = "Polarimeter",
  RADIOMETER = "Radiometer",
  RADIO_RADAR = "Radio-Radar",
  RADIO_SCIENCE = "Radio Science",
  REGOLITH_PROPERTIES = "Regolith Properties",
  SEISMOMETER = "Seismometer",
  SMALL_BODIES_SCIENCES = "Small Bodies Sciences",
  SPECTROMETER = "Spectrometer",
  SPECTROGRAPH = "Spectrograph",
  ULTRAVIOLET_SPECTROMETER = "Ultraviolet Spectrometer",
  WEATHER_STATION = "Weather Station",
}