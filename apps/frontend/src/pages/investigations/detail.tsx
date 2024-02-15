import React from 'react';
import { Box, Breadcrumbs, Button, Container, Link, Tab, Tabs, Typography } from '@mui/material';
import { FeaturedLinkListItem } from "@nasapds/wds-react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';

import "./detail.scss";
import { getInvestigation } from '../../utils.tsx/investigations';

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

const InvestigationDetailPage = () => {

   const { investigationId } = useParams();
   const [value, setValue] = React.useState(0);
   const navigate = useNavigate();

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

   const investigation:Investigation = getInvestigation(investigationId);
   console.log(investigation["instruments"]);

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
               backgroundImage: "url(/assets/images/headers/" + investigationId + ".png)",
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
                  <Typography style={{color: "white"}}>{investigationId?.toUpperCase()}</Typography>
               </Breadcrumbs>
               <Box
                  component="img"
                  sx={{
                     width: 60,
                     paddingTop: "24px",
                  }}
                  alt=""
                  src={"/assets/images/logos/" + investigationId + ".png"}
               />
               <Typography variant="h1" style={{
                     color: "white",
                     padding: "0px",
                     paddingTop: "0px",
                     fontSize: "72px",
                     fontWeight: "700",
                  }}>{investigationId?.toUpperCase()}</Typography>
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
               <CustomTabPanel value={value} index={0}>
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
               </CustomTabPanel>
               <CustomTabPanel value={value} index={1}>
                  <Typography variant='h4'>Summary</Typography>
                  <Typography variant='body1' style={{paddingBottom: "24px"}}>Development of the Mars Science Laboratory project began in 2003. On November 26 2011, the Mars Science Laboratory mission launched a spacecraft on a trajectory to Mars, and on August 6, 2012 (UTC), it landed a mobile science vehicle named Curiosity at a landing site in Gale Crater. During the trip to Mars, instrument health checks were performed and the Radiation Assessment Detector (RAD) instrument collected science data. For the primary mission on the surface of Mars (ending September 28, 2014), the rover explored the landing site and gathered imaging, spectroscopy, composition data, and othermeasurements for selected Martian soils, rocks, and the atmosphere.</Typography>
                  <Typography variant='body1'>These data will allow the science team to quantitatively assess the habitability and environmental history. The prime mission's science objectives were to assess the biological potential of the landing site, characterize the geology of the landing region, investigate planetary processes that influence habitability, and characterize the broad spectrum of surface radiation. The first extended mission retains all of the prime mission's objectives and will also strive to: identify and quantitatively assess the subset of habitable environments that are also capable of preserving organic compounds, and explore and characterize major environmental transitions recorded in the geology ofthe foothills of Mt. Sharp and adjacent plains. For more detailed information regarding the MSL mission, visit the NASA mission page.</Typography>
               </CustomTabPanel>
               <CustomTabPanel value={value} index={2}>
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
               </CustomTabPanel>
               <CustomTabPanel value={value} index={3}>
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
               </CustomTabPanel>
               <CustomTabPanel value={value} index={4}>
                  <Typography variant='h4'>Resources</Typography>
               </CustomTabPanel>
            </Container>
         </Container>
      </Container>
   );
};

export default InvestigationDetailPage;