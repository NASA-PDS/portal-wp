import React, { useEffect } from "react";
import { Box, Breadcrumbs, Button, Container, Link, Tab, Tabs, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from "react-redux";
import { useAppDispatch, useAppSelector } from "src/state/hooks";

import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { selectInvestigationVersion } from "src/state/selectors/investigations";
import { dataRequiresFetchOrUpdate, getData } from "src/state/slices/dataManagerSlice";
import { RootState } from "src/state/store";

import "./detail.scss";
import { Investigation } from "src/types/investigation.d";

interface TabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
}

function CustomTabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;
 
   return (
     <div
       role="tabpanel"
       hidden={value !== index}
       id={`simple-tabpanel-${index}`}
       aria-labelledby={`simple-tab-${index}`}
       {...other}
     >
       {value === index && (
         <Box sx={{ p: 3 }}>
           <Typography>{children}</Typography>
         </Box>
       )}
     </div>
   );
}

function a11yProps(index: number) {
   return {
     id: `simple-tab-${index}`,
     'aria-controls': `simple-tabpanel-${index}`,
   };
}

type InvestigationDetailPageProps = {
  error: string | null | undefined,
  investigation:Investigation;
  status: string;
};

export const InvestigationDetailPage = (props:InvestigationDetailPageProps) => {

   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const {error, investigation, status} = props;
   const dataManagerState = useAppSelector( (state) => { return state.dataManager } );
   const [value, setValue] = React.useState(0);
   
   useEffect(() => {
    let isMounted = true;

    // Check if data manager status is 'idle', then fetch the investigations data from the API
    if( dataRequiresFetchOrUpdate(dataManagerState) ) {
      dispatch(getData());
    }

    if (status === "pending") {
      // Do something to inform user that investigation data is being fetched
    } else if (status === "succeeded") {
      
      // Do something to handle the successful fetching of data
      
      console.log("investigation:", investigation);
      
    } else if ( error != null || error != undefined ) {
      // Do something to handle the error
      console.log(error);
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [status, dispatch]);

   
   const linkStyles = {
      color: "white",
      fontFamily: "Inter",
      fontSize: "14px",
      fontWeight: "300",
      lineHeight: "19px",
      paddingY: "4px",
   };

   const styles = {
      button: {
          color: '#FFFFFF',
          backgroundColor: "#288BFF",
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: "1.125em",
          textTransform: "capitalize",
          "&:hover": {
              backgroundColor: "#B60109",
          },
          "&:disabled": {
            color: "#FFFFFF",
            backgroundColor: "#288BFF",
          }
      }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

   const investigationListItemPrimaryAction = (path:string) => {
      navigate(path);
   };

   return (
      <Container
         maxWidth={false}
         disableGutters
      >
         {/* Page Intro */}
         <Container
            maxWidth={false} 
            disableGutters
            sx={{
               backgroundImage: "url(/assets/images/headers/investigations/" + investigation[PDS4_INFO_MODEL.LID] + ".png)",
               backgroundSize: "cover",
               backgroundRepeat: "no-repeat",
               height: "280px",
               textAlign: "left",
            }}
         >
            <Container
               maxWidth={"xl"}
               sx={{
                  paddingY: "24px",
                  paddingLeft: "148px",
                  paddingRight: "148px",
               }}
            >
               <Breadcrumbs
                  aria-label='breadcrumb'
                  maxItems={3}
                  sx={{
                     backgroundColor: "rgba(23,23,27,0.17)",
                     paddingY: "3px",
                     paddingX: "5px",
                     borderRadius: "3px",
                  }}
               >
                  <Link underline="hover" color="inherit" href="/"
                     style={linkStyles}>
                     Home
                  </Link>
                  <Link
                     underline="hover"
                     color="inherit"
                     href="/investigations/"
                     style={linkStyles}
                  >
                     Investigations
                  </Link>
                  <Typography style={{color: "white"}}>{investigation[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE]}</Typography>
               </Breadcrumbs>
               <Box
                  component="img"
                  sx={{
                     width: 60,
                     paddingTop: "24px",
                  }}
                  alt=""
                  src={"/assets/images/logos/" + investigation[PDS4_INFO_MODEL.LID] + ".png"}
               />
               <Typography variant="h1" style={{
                     color: "white",
                     padding: "0px",
                     paddingTop: "0px",
                     fontSize: "72px",
                     fontWeight: "700",
                  }}>{investigation[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE]}</Typography>
               <Typography variant="subtitle1" sx={{
                  color: "white",
               }}>The Mars Science Laboratory</Typography>
            </Container>
         </Container>
         <Container
            maxWidth={false}
            disableGutters
            sx={{ 
               textAlign: "left",
               backgroundColor: "#F6F6F6"
            }}>
            <Container maxWidth={"xl"} disableGutters sx={{
               paddingY: "24px",
            }}>
               <Box>
                  <Box><Typography variant="overline" style={{fontSize: "0.875em"}}>Spacecraft</Typography></Box>
                  <Button sx={styles.button} disabled>Curiosity</Button>
               </Box>
            </Container>
         </Container>
         <Container
            maxWidth={false}
            disableGutters
            sx={{ 
               textAlign: "left",
            }}>
            <Container maxWidth={"xl"} disableGutters sx={{
               paddingY: "24px",
            }}>
               <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                     <Tab label="Instruments" {...a11yProps(0)} />
                     <Tab label="Overview" {...a11yProps(1)} />
                     <Tab label="Targets" {...a11yProps(2)} />
                     <Tab label="Tools" {...a11yProps(3)} />
                     <Tab label="Resources" {...a11yProps(4)} />
                  </Tabs>
               </Box>
            </Container>
            <Container maxWidth={"xl"} disableGutters sx={{
               paddingY: "24px",
               paddingLeft: "217px",
            }}>
               {/*<CustomTabPanel value={value} index={0}>
                  <Typography variant='h4'>Cameras</Typography>
                  {
                     investigation["instruments"]["cameras"].map((instrument) => {
                        return (
                           <FeaturedLinkListItem
                           key={instrument.id}
                           description={instrument.description}
                           primaryButtonAction={() => instrumentListItemPrimaryAction("instruments/" + instrument.id)}
                           variant="instrument"
                           title={instrument.name}
                        />
                        )
                     })
                  }
                  <Typography variant='h4'>Spectrometers</Typography>
                  {
                     investigation["instruments"]["spectrometers"].map((instrument) => {
                        return (
                           <FeaturedLinkListItem
                           key={instrument.id}
                           description={instrument.description}
                           primaryButtonAction={() => instrumentListItemPrimaryAction("instruments/" + instrument.id)}
                           variant="instrument"
                           title={instrument.name}
                        />
                        )
                     })
                  }
                  <Typography variant='h4'>Radiation Detectors</Typography>
                  {
                     investigation["instruments"]["radiation-detectors"].map((instrument) => {
                        return (
                           <FeaturedLinkListItem
                           key={instrument.id}
                           description={instrument.description}
                           primaryButtonAction={() => instrumentListItemPrimaryAction("instruments/" + instrument.id)}
                           variant="instrument"
                           title={instrument.name}
                        />
                        )
                     })
                  }
                  <Typography variant='h4'>Environmental Sensors</Typography>
                  {
                     investigation["instruments"]["environmental-sensors"].map((instrument) => {
                        return (
                           <FeaturedLinkListItem
                           key={instrument.id}
                           description={instrument.description}
                           primaryButtonAction={() => instrumentListItemPrimaryAction("instruments/" + instrument.id)}
                           variant="instrument"
                           affiliated_spacecraft="Affiliated Spacecraft"
                           title={instrument.name}
                        />
                        )
                     })
                  }
               </CustomTabPanel>*/}
               <CustomTabPanel value={value} index={1}>
                  <Typography variant='h4'>Summary</Typography>
                  <Typography variant='body1' style={{paddingBottom: "24px"}}>{investigation[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION]}</Typography>
                  
               </CustomTabPanel>
               {/*<CustomTabPanel value={value} index={2}>
                  <Typography variant='h4'>Targets</Typography>
                  {
                     investigation["targets"].map((target) => {
                        return (
                           <FeaturedLinkListItem
                           key={target.id}
                           description={target.description}
                           primaryButtonAction={() => instrumentListItemPrimaryAction("target/" + target.id)}
                           variant="target"
                           expansion={true}
                           title={target.name}
                        />
                        )
                     })
                  }
                </CustomTabPanel>*/}
               {/*<CustomTabPanel value={value} index={3}>
                  <Typography variant='h4'>Tools</Typography>
                  {
                     investigation["tools"].map((tool) => {
                        return (
                           <FeaturedLinkListItem
                           key={tool.id}
                           description={tool.description}
                           primaryButtonAction={() => instrumentListItemPrimaryAction("tools/" + tool.id)}
                           variant="tool"
                           title={tool.name}
                        />
                        )
                     })
                  }
               </CustomTabPanel>*/}
               <CustomTabPanel value={value} index={4}>
                  <Typography variant='h4'>Resources</Typography>
               </CustomTabPanel>
            </Container>
         </Container>
      </Container>
   );
};

/**
 * Use mapStateToProps so that changes to our state trigger a rerender of the UI.
 */ 
const mapStateToProps = (state:RootState) => {

  const { investigationLid, investigationVersion } = useParams();

  return { 
    error: state.dataManager.error,
    investigation: selectInvestigationVersion(state, investigationLid, investigationVersion ),
    status: state.dataManager.status,
  }
};

export default connect(mapStateToProps)(InvestigationDetailPage);