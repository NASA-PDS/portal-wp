import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Link as AnchorLink } from '@mui/material';
import { useState } from 'react';
import { Link } from "react-router-dom";

type PrimaryActionFunction = () => void;

export type FeaturedInstrumentLinkListItemProps = {
  description:string,
  primaryAction:PrimaryActionFunction,
  title:string,
  bundles:[]
}

const styles = {
  link: {
    color: '#1C67E3',
    fontSize: "11px",
    fontFamily: 'Inter',
    fontWeight: '700',
    textDecoration: 'underline',
    textTransform: 'uppercase',
    lineHeight: "19px",
    letterSpacing: "0.25px",
    wordWrap: 'break-word'
  }
}

function stringCleanup(str:string):string {
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
    "SEE INSTRUMENT OVERVIEW BELOW"
  ].forEach( (entry) => {
    cleanedString = cleanedString.replace(entry, "")
  })
  
  if( cleanedString.length > 200 ) {
    cleanedString = cleanedString.substring(0,200) + "..."
  }

  console.log("cleanedString:", cleanedString)
  return cleanedString;
}

export const FeaturedInstrumentLinkListItem = ({
  bundles = [],
  description = '',
  primaryAction,
  title = '',
}: FeaturedInstrumentLinkListItemProps) => {

  const [showDetails, setShowDetails] = useState<boolean>(false);

  const toggleDetails = () => {
    setShowDetails( !showDetails );
  }
  
  return (
    <Stack sx={{
      marginTop: "15px"
    }}>
      <Box sx={{ width: "100%"}}>
        <Grid container spacing={2} sx={{
          minHeight: "64px",
          paddingY: "10px",
          alignItems: "center"
        }}>
          <Grid item xs={1}>
            <IconButton onClick={toggleDetails}>
              {
                showDetails ? 
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10.0004" r="9.5" stroke="black"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 11.0555L13.2328 7.80042L14 8.57286L10 12.6004L6 8.57286L6.76716 7.80042L10 11.0555Z" fill="black"/>
                  </svg>
                :
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="9.5" transform="rotate(-90 10 10)" stroke="black"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.0552 10L7.80005 6.76716L8.57249 6L12.6 10L8.57249 14L7.80005 13.2328L11.0552 10Z" fill="black"/>
                  </svg>
              }

            </IconButton>
          </Grid>
          <Grid item xs={4}>
            <AnchorLink component="button" onClick={() => primaryAction()}
              sx={{
                textAlign: "left",
                color: "#000000",
                textDecoration: "none",
                cursor: "pointer"
              }}>
              <Typography sx={{
                color: 'black',
                fontSize: "1.125rem",
                fontFamily: 'Inter',
                fontWeight: '600',
                lineHeight: '23px',
                wordWrap: 'break-word'
              }}>
                {title}
              </Typography>
            </AnchorLink>
          </Grid>
          <Grid item xs={5}>
            <Typography
              sx={{
                color: 'black',
                fontSize: '0.75rem',
                fontFamily: 'Inter',
                fontWeight: '400',
                lineHeight: '16px',
                letterSpacing: "0.25px",
                wordWrap: 'break-word'
              }}
              >
                {
                  stringCleanup(description)
                  /*[
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vulputate scelerisque ligula, sit amet molestie quam faucibus sed. Aenean mattis a sapien ut aliquet.",
                    "Etiam suscipit varius nulla, quis congue neque blandit quis. Donec convallis quam nulla, nec ultrices nunc congue eu. Quisque aliquam urna quis maximus ultrices. ",
                    "Sed rhoncus tortor posuere augue ultrices pretium. Phasellus blandit tortor leo, sed consequat lacus ultricies ut.",
                    "Praesent mauris nisl, rutrum at mattis quis, condimentum non nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
                    "Proin rutrum quis justo sit amet cursus. Duis lacinia blandit turpis, ac mattis nisl lacinia et. Mauris tempus feugiat auctor. Quisque quis orci scelerisque, placerat quam et, dapibus ante."
                  ][Math.floor(Math.random() * 5)]*/
                }
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Stack direction="row">
              <Typography sx={{
                color: 'black',
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '600',
                lineHeight: '20px',
                wordWrap: "break-word"
              }}
              >View Instrument and Data</Typography>
              <IconButton
                sx={{
                  "&:hover": {
                    backgroundColor: "#B60109"
                  },
                  backgroundColor: "#F64137",
                  height: "36px",
                  width: "36px",
                  padding: "18px"
                }}
                aria-label="arrow"
                onClick={() => {primaryAction()}}>
                  <ArrowForward sx={{
                    color: "#FFFFFF"
                  }}
                />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{
          marginTop: "15px",
        }}/>
      </Box>
      { showDetails ?
        <Box sx={{
          backgroundColor: "#F6F6F6",
          padding: "20px 20px 0px 80px"
        }}>
          <Box sx={{
            marginBottom: "20px"
          }}>
            {
              bundles.length > 0 ? (
                bundles.map( (bundle, index) => {
                  return (
                    <Box key={index} sx={{marginBottom: "20px"}}>
                      <Stack direction={{ xs: "column", "md": "column" }} spacing={0.5}>
                        <Typography sx={{
                          color: '#1C67E3',
                          fontSize: "11px",
                          fontFamily: 'Inter',
                          fontWeight: '700',
                          textDecoration: 'underline',
                          textTransform: 'uppercase',
                          lineHeight: "19px",
                          letterSpacing: "0.25px",
                          wordWrap: 'break-word',
                        }}>{bundle.title}</Typography>
                        <Typography sx={{
                          color: '#17171B',
                          fontSize: "11px",
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          
                          lineHeight: "19px",
                          letterSpacing: "0.25px",
                          paddingLeft: "24px",
                          wordWrap: 'break-word'
                        }}>{bundle.properties["pds:Bundle.pds:description"] !== undefined ? bundle.properties["pds:Bundle.pds:description"][0] : "No Description Available"}</Typography>
                      </Stack>
                    </Box>
                  )
                })
              )
              :
              <Typography sx={{
                color: '#17171B',
                fontSize: "11px",
                fontFamily: 'Inter',
                fontWeight: '400',
                lineHeight: "19px",
                letterSpacing: "0.25px",
                paddingLeft: "24px",
                wordWrap: 'break-word'
              }}>No Bundles Found.</Typography>
            }
          </Box>
          {/*
          <Box sx={{
            marginBottom: "20px"
          }}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              wordWrap: 'break-word'
            }}>
              Raw Data Products
            </Typography>
            {
              [
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
              ].map( item => {
                return <Box sx={{
                  marginBottom: "5px"
                }}>
                  <Link style={styles.link}>{item.title}</Link>
                  <Typography sx={{
                    marginLeft: "32px",
                    color: '#17171B',
                    fontSize: "11px",
                    fontFamily: 'Inter',
                    fontWeight: '400',
                    textTransform: 'uppercase',
                    lineHeight: "19px",
                    letterSpacing: "0.25px",
                    wordWrap: 'break-word'
                  }}>{item.description}</Typography>
                </Box>
              })
            }
          </Box>
          <Box sx={{
            marginBottom: "20px"
          }}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              wordWrap: 'break-word'
            }}>
              Derived Data Products
            </Typography>
            {
              [
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
              ].map( item => {
                return <Box sx={{
                  marginBottom: "5px"
                }}>
                  <Link style={styles.link}>{item.title}</Link>
                  <Typography sx={{
                    marginLeft: "32px",
                    color: '#17171B',
                    fontSize: "11px",
                    fontFamily: 'Inter',
                    fontWeight: '400',
                    textTransform: 'uppercase',
                    lineHeight: "19px",
                    letterSpacing: "0.25px",
                    wordWrap: 'break-word'
                  }}>{item.description}</Typography>
                </Box>
              })
            }
          </Box>
          <Box sx={{
            marginBottom: "20px"
          }}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              wordWrap: 'break-word'
            }}>
              Derived Data Products from Investigators
            </Typography>
            {
              [
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
              ].map( item => {
                return <Box sx={{
                  marginBottom: "5px"
                }}>
                  <Link style={styles.link}>{item.title}</Link>
                  <Typography sx={{
                    marginLeft: "32px",
                    color: '#17171B',
                    fontSize: "11px",
                    fontFamily: 'Inter',
                    fontWeight: '400',
                    textTransform: 'uppercase',
                    lineHeight: "19px",
                    letterSpacing: "0.25px",
                    wordWrap: 'break-word'
                  }}>{item.description}</Typography>
                </Box>
              })
            }
          </Box>*/}
        </Box>
        : <></>
      }
    </Stack>
  );
}

export default FeaturedInstrumentLinkListItem;