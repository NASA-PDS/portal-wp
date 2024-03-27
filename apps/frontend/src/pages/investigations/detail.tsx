import React, { useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { useAppDispatch, useAppSelector } from "src/state/hooks";

import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { selectInvestigationVersion } from "src/state/selectors/investigations";
import { selectLatestInstrumentHostsForInvestigation } from "src/state/selectors/instrumentHost";
import {
  dataRequiresFetchOrUpdate,
  getData,
} from "src/state/slices/dataManagerSlice";
import { RootState, store } from "src/state/store";

import "./detail.scss";
import { Investigation } from "src/types/investigation.d";
import { InstrumentHost } from "src/types/instrumentHost.d";
import { selectLatestTargetsForInstrumentHost } from "src/state/selectors/targets";
import { selectLatestInstrumentsForInstrumentHost } from "src/state/selectors/instruments";
import { Target } from "src/types/target.d";
import { Instrument } from "src/types/instrument.d";
import FeaturedInstrumentLinkListItem from "src/components/FeaturedListItems/FeaturedInstrumentLinkListItem";
import FeaturedTargetLinkListItem from "src/components/FeaturedListItems/FeaturedTargetLinkListItem";

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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type InvestigationDetailPageProps = {
  error: string | null | undefined;
  instruments: [];
  instrumentHosts: InstrumentHost[];
  investigation: Investigation;
  status: string;
  targets: [];
};

export const InvestigationDetailPage = (
  props: InvestigationDetailPageProps
) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  //const { error, instruments, instrumentHosts, investigation, status, targets } = props;
  const { error, instruments, instrumentHosts, investigation, status, targets } = props;
  const dataManagerState = useAppSelector((state) => {
    return state.dataManager;
  });
  const [value, setValue] = React.useState(0);
  const [selectedInstrumentHost, setSelectedInstrumentHost] = React.useState<number>(0);
  const [instrumentTypes, setInstrumentTypes] = React.useState<string[]>([]);
  
  const toolTags = [
    {label:'Tag Label 1'},
    {label:'Tag Label 2'},
    {label:'Tag Label With a Really Long Title'}
  ];

  const initInstrumentTypes = () => {

    let instrumentTypesArr:string[] = [];
    instruments[selectedInstrumentHost].forEach( (instrument) => {

      if( instrument[PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE] !== undefined ) {

        instrument[PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE].forEach( (instrumentType) => {
          if( !instrumentTypesArr.includes(instrumentType) ) {
            instrumentTypesArr.push(instrumentType);
          }
        });

      } else if( instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE] !== undefined ) {

        instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE].forEach( (instrumentType) => {
          if( !instrumentTypesArr.includes(instrumentType) ) {
            instrumentTypesArr.push(instrumentType);
          }
        });

      } else {
        instrumentTypesArr.push("other");
      }
        
      instrumentTypesArr.sort( (a:string, b:string) => {
        if( a.toLowerCase() < b.toLowerCase() ) {
          return -1
        } else if( a.toLowerCase() > b.toLowerCase() ) {
          return 1
        }
        return 0;
      });
    
      
    });
    
    setInstrumentTypes(instrumentTypesArr);
    
  };

  useEffect(() => {
    let isMounted = true;

    // Check if data manager status is 'idle', then fetch the investigations data from the API
    if (dataRequiresFetchOrUpdate(dataManagerState)) {
      dispatch(getData());
    }

    if (status === "pending") {
      // Do something to inform user that investigation data is being fetched
    } else if (status === "succeeded") {
      // Do something to handle the successful fetching of data
      initInstrumentTypes();
    } else if (error != null || error != undefined) {
      // Do something to handle the error
      console.log(error);
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [status, dispatch]);

  useEffect( () => {
    initInstrumentTypes();
  }, [selectedInstrumentHost])

  const styles = {
    breadcrumbs:{
      links: {
        color: "#FFFFFF",
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: "300",
        lineHeight: "19px",
        paddingY: "4px",
      }
    },
    button: {
      color: "#288BFF",
      backgroundColor: "#FFFFFF",
      border: "1px solid #FFFFFF",
      borderRadius: "10px",
      fontFamily: "Inter",
      fontWeight: 600,
      fontSize: "1.125em",
      lineHeight: "143%",
      paddingX: "20px",
      paddingY: "8px",
      textTransform: "capitalize",
      wordWrap: "break-word",
      "&:hover": {
        backgroundColor: "#FFFFFF",
        border: "1px solid #288BFF",
      },
      "&:disabled": {
        color: "#FFFFFF",
        backgroundColor: "#288BFF",
        border: "1px solid #288BFF"
      },
    },
    tabs: {
      ".MuiTab-root": {
        color: "#000000",
        "&.Mui-selected": {
          color: "#000000"
        },
        "&:hover": {
          borderBottom: "2px solid #58585B",
          boxSizing: "border-box",
          top: "1px"
        },
        "&:focus": {
          border: '1px #58585B dotted',
          top: "1px"
        },
      },
      ".MuiTabs-indicator": {
        backgroundColor: "#000000",
        height: "4px",
      },
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleInstrumentHostChange = (event) => {
    event.preventDefault();
    const instrumentHostIndex = event.target.getAttribute("data-instrument-host-index");

    setSelectedInstrumentHost(instrumentHostIndex);
  };

  const investigationListItemPrimaryAction = (path: string) => {
    navigate(path);
  };

  return (
    <Container maxWidth={false} disableGutters>
      {/* Page Intro */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundColor: "#000000",
          backgroundImage: "url(/assets/images/headers/investigations/".concat(investigation[PDS4_INFO_MODEL.LID]).concat(".png)"),
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minHeight: "200px",
          height: "fit-content",
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
            aria-label="breadcrumb"
            maxItems={3}
            sx={{
              backgroundColor: "rgba(23,23,27,0.17)",
              paddingY: "3px",
              paddingX: "5px",
              borderRadius: "3px",
              width: "fit-content",
              alignItems: "center"
            }}
          >
            <Link underline="hover" color="inherit" href="/" style={styles.breadcrumbs.links}>
              Home
            </Link>
            <Link underline="hover" color="inherit" href="/investigations/" style={styles.breadcrumbs.links}>
              Investigations
            </Link>
            <Typography style={{ color: "white" }}>
              {investigation[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE]}
            </Typography>
          </Breadcrumbs>
          <Box
            component="img"
            sx={{
              width: 60,
              paddingTop: "24px",
            }}
            alt=""
            src={"/assets/images/logos/".concat(investigation[PDS4_INFO_MODEL.LID]).concat(".png")}
          />
          <Typography
            variant="h1"
            style={{
              color: "white",
              padding: "0px",
              paddingTop: "0px",
              fontSize: "72px",
              fontWeight: "700",
            }}
          >
            {investigation[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE]}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "white",
            }}
          >
            {investigation[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE]}
          </Typography>
        </Container>
      </Container>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          textAlign: "left",
          backgroundColor: "#F6F6F6",
          paddingX: "24px"
        }}
      >
        <Container
          maxWidth={"xl"}
          disableGutters
          sx={{
            paddingY: "24px",
          }}
        >
          <Box>
            <Box sx={{paddingBottom: "8px"}}>
              <Typography variant="overline" style={{ 
                color: "#000000",
                fontSize: "0.875em",
                fontWeight: 500,
                lineHeight: "131%",
                letterSpacing: "0.265rem",
                textTransform: "uppercase",
                wordWrap: "break-word",
              }}>
                Spacecraft
              </Typography>
            </Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 1 }}
              sx={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #288BFF",
                borderRadius: "10px",
                padding: "5px",
                width: "fit-content"
              }}
            >
              {instrumentHosts.map((host: InstrumentHost, index) => {
                return (
                  <Button
                    key={"button_" + host[PDS4_INFO_MODEL.LID]}
                    sx={styles.button}
                    disabled={instrumentHosts.length === 1 || selectedInstrumentHost == index}
                    onClick={ handleInstrumentHostChange }
                    data-instrument-host-index={index}
                  >
                    {host[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE]
                      .toString()
                      .toLowerCase()}
                  </Button>
                );
              })}
            </Stack>
          </Box>
        </Container>
      </Container>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          textAlign: "left",
          padding: "24px"
        }}
      >
        <Container
          maxWidth={"xl"}
          disableGutters
          sx={{
            paddingY: "24px",
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={styles.tabs}
            >
              <Tab label="Instruments" {...a11yProps(0)} disableRipple disableTouchRipple />
              <Tab label="Overview" {...a11yProps(1)} disableRipple disableTouchRipple />
              <Tab label="Targets" {...a11yProps(2)} disableRipple disableTouchRipple />
              <Tab label="Tools" {...a11yProps(3)} disableRipple disableTouchRipple />
              <Tab label="Resources" {...a11yProps(4)} disableRipple disableTouchRipple />
            </Tabs>
          </Box>
        </Container>
        <Container
          maxWidth={"xl"}
          disableGutters
          sx={{
            paddingY: "24px",
            paddingLeft: "217px",
          }}
        >
          <CustomTabPanel value={value} index={0}>
            {
              instrumentTypes.map( (instrumentType, index) => {
                return (
                  <>
                    <Typography sx={{
                      textTransform: "capitalize",
                      fontFamily: "Inter",
                      fontSize: "1.375em",
                      fontWeight: 700,
                      lineHeight: "26px",
                      wordWrap: "break-word",
                      paddingBottom: "10px",
                      ":not(:first-of-type)": {
                        paddingTop: "50px"
                      }
                    }} key={"instrumentType_" + index}>
                      {instrumentType}
                    </Typography>
                    {
                      instruments[selectedInstrumentHost].map( (instrument:Instrument, index:number) => {

                        if( instrument[PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE]?.includes(instrumentType)
                              || instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE]?.includes(instrumentType) ) {
                          //return <div key={"instrument_" + index}>{instrument[PDS4_INFO_MODEL.TITLE]}</div>
                          return <FeaturedInstrumentLinkListItem
                            key={instrument[PDS4_INFO_MODEL.LID]}
                            description={instrument[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION].toString()}
                            primaryAction={ () => {} }
                            title={instrument[PDS4_INFO_MODEL.INSTRUMENT.NAME]}
                          />
                        }

                        {/*instrument[PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE]?.forEach( (type:string) => {
                          if( type.toLowerCase() === instrumentType.toLowerCase() ) {
                            return <div key={"instrument_" + index}>{instrument[PDS4_INFO_MODEL.TITLE]}</div>
                          }
                        })
                        
                        instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE]?.forEach( (type:string) => {
                          if( type.toLowerCase() === instrumentType.toLowerCase() ) {
                            return <div key={"instrument_" + index}>{instrument[PDS4_INFO_MODEL.TITLE]}</div>
                          }
                        })*/}

                      })
                    }
                  </>
                  )
                })
            }
            {/*<Typography variant='h4'>Cameras</Typography>
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
            }*/}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Typography variant="h4" sx={{
              color: 'black',
              fontSize: "22px",
              fontFamily: 'Inter',
              fontWeight: '700',
              lineHeight: "26px",
              wordWrap: 'break-word'
            }}>Summary</Typography>
            <Typography variant="body1" style={{ paddingBottom: "24px" }}>
              {investigation[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION]}
            </Typography>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {
              targets[selectedInstrumentHost].length > 0 ? (
                targets[selectedInstrumentHost].map( (target:Target, index:number) => {
                  //let keyProp = target[PDS4_INFO_MODEL.LID].replaceAll(/[:.]/g, '_');
                  //return <div key={keyProp}>{target[PDS4_INFO_MODEL.TITLE]}</div>
                  return <FeaturedTargetLinkListItem
                            key={"target_" + index}
                            description={target[PDS4_INFO_MODEL.TARGET.DESCRIPTION].toString()}
                            primaryAction={ () => {} }
                            title={target[PDS4_INFO_MODEL.TARGET.NAME]}
                          />
                })
              ) : (
                <Box sx={{ paddingBottom: "25px", textAlign: "center"}}>
                  <Typography>There are no targets related to this investigation.</Typography>
                </Box>
              )
              
              /*investigation["targets"].map((target) => {
                  return (
                      <FeaturedLinkListItem
                      description={target.description}
                      primaryButtonAction={() => instrumentListItemPrimaryAction("target/" + target.id)}
                      variant="target"
                      expansion={true}
                      title={target.name}
                  />
                  )
                })*/
            }
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Typography variant='body1'>The PDS maintains many tools enabling users to work with the data in our archive. Listed below are tools that can assist you when exploring the data holding for this investigation.</Typography>
            <FeaturedToolLinkListItem
                key={1}
                description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus porttitor lorem ac velit laoreet, eu dapibus ante pellentesque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla blandit elit vel libero porttitor, ut ultrices sem facilisis. Maecenas egestas dignissim lacus vitae blandit. Ut in nulla nec lorem tempus elementum sed a nisl. Nunc nisl lacus, faucibus at vulputate id, viverra vitae nibh. Nam quis tortor enim. Phasellus ultrices sit amet felis sit amet consequat. Etiam a cursus ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas id commodo turpis.".substring(0,275).concat("...")}
                primaryAction={ () => {} }
                tags={toolTags}
                title={"Tool Name"}
            />
            <FeaturedToolLinkListItem
                key={1}
                description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus porttitor lorem ac velit laoreet, eu dapibus ante pellentesque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla blandit elit vel libero porttitor, ut ultrices sem facilisis. Maecenas egestas dignissim lacus vitae blandit. Ut in nulla nec lorem tempus elementum sed a nisl. Nunc nisl lacus, faucibus at vulputate id, viverra vitae nibh. Nam quis tortor enim. Phasellus ultrices sit amet felis sit amet consequat. Etiam a cursus ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas id commodo turpis.".substring(0,275).concat("...")}
                primaryAction={ () => {} }
                tags={toolTags}
                title={"Tool Name"}
            />
            <FeaturedToolLinkListItem
                key={1}
                description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus porttitor lorem ac velit laoreet, eu dapibus ante pellentesque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla blandit elit vel libero porttitor, ut ultrices sem facilisis. Maecenas egestas dignissim lacus vitae blandit. Ut in nulla nec lorem tempus elementum sed a nisl. Nunc nisl lacus, faucibus at vulputate id, viverra vitae nibh. Nam quis tortor enim. Phasellus ultrices sit amet felis sit amet consequat. Etiam a cursus ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas id commodo turpis.".substring(0,275).concat("...")}
                primaryAction={ () => {} }
                tags={toolTags}
                title={"Tool Name"}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <Typography variant="h4">Resources</Typography>
          </CustomTabPanel>
        </Container>
      </Container>
    </Container>
  );
};

/**
 * Use mapStateToProps so that data from our state can be injected into the UI.
 */
const mapStateToProps = (state: RootState) => {

  const { investigationLid, investigationVersion } = useParams();
  const investigation:Investigation = selectInvestigationVersion(state, investigationLid, investigationVersion);
  const instrumentHosts:InstrumentHost[] = selectLatestInstrumentHostsForInvestigation(state, investigation[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST]);
  let instruments = new Array( instrumentHosts.length );
  let targets = new Array( instrumentHosts.length );

  // Get data for each instrument host
  instrumentHosts.map( (instrumentHost:InstrumentHost, index:number) => {

    // Get instruments
    instruments[index] = selectLatestInstrumentsForInstrumentHost(state, instrumentHost[PDS4_INFO_MODEL.REF_LID_INSTRUMENT])

    // get targets
    targets[index] = selectLatestTargetsForInstrumentHost(state, instrumentHost[PDS4_INFO_MODEL.REF_LID_TARGET])
                      .sort( (a:Target, b:Target) => {
                        if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
                          return -1
                        } else if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
                          return 1
                        }
                        return 0;
                      })

  });

  return {
    error: state.dataManager.error,
    instruments: instruments,
    instrumentHosts: instrumentHosts,
    investigation: investigation, 
    status: state.dataManager.status,
    targets: targets,
  };

};

export default connect(mapStateToProps)(InvestigationDetailPage);
