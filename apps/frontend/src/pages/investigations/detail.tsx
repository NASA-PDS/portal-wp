import { Box, Breadcrumbs, Button, Container, Link as AnchorLink, Grid, Stack, Tab, Tabs, Typography, Divider } from "@mui/material";
import { dataRequiresFetchOrUpdate, getData } from "src/state/slices/dataManagerSlice";
import { generatePath, Link, useNavigate, useParams } from "react-router-dom";
import { Instrument, InstrumentHost, Investigation, Target } from "src/types";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/state/hooks";
import { connect } from "react-redux";
import FeaturedInstrumentLinkListItem from "src/components/FeaturedListItems/FeaturedInstrumentLinkListItem";
import FeaturedTargetLinkListItem from "src/components/FeaturedListItems/FeaturedTargetLinkListItem";
import FeaturedToolLinkListItem from "src/components/FeaturedListItems/FeaturedToolLinkListItem";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { RootState } from "src/state/store";
import { selectInvestigationVersion } from "src/state/selectors/investigations";
import { selectLatestInstrumentHostsForInvestigation } from "src/state/selectors/instrumentHost";
import { selectLatestInstrumentsForInstrumentHost } from "src/state/selectors/instruments";
import { selectLatestTargetsForInstrumentHost } from "src/state/selectors/targets";

import "./detail.scss";
import { StatsList } from "src/components/StatsList/StatsList";
import InvestigationStatus from "src/components/InvestigationStatus/InvestigationStatus";
import FeaturedResourceLinkListItem from "src/components/FeaturedListItems/FeaturedResourcesLinkListItem";

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
  const [selectedInstrumentHost, setSelectedInstrumentHost] = useState<number>(0);
  const [instrumentTypes, setInstrumentTypes] = useState<string[]>([]);
  const { investigationLid, investigationVersion, tabLabel } = useParams();
  const [bundles, setBundles] = useState<Array<unknown>>(new Array(instrumentHosts.length).fill([]));

  const stats:Stats[] = [
    {
      label: "Investigation Type",
      value: investigation[PDS4_INFO_MODEL.INVESTIGATION.TYPE]
    },
    {
      label: "Mission Phase",
      value: "Lorem Ipsum"
    },
    {
      label: "Version",
      value: investigation.vid
    },
    {
      label: "Logical Identifier",
      value: investigation.lid
    }
  ]
  
  const tabs = [
    'instruments',
    'overview',
    'targets',
    'tools',
    'resources'
  ];
  
  const [value, setValue] = useState(tabs.findIndex( (tab) => tab == tabLabel?.toLowerCase()));
  const toolTags = [
    {label:'Tag Label 1'},
    {label:'Tag Label 2'},
    {label:'Tag Label With a Really Long Title'}
  ];

  const getRelatedInstrumentBundles = (lid:string) => {
    return bundles[selectedInstrumentHost].filter( (bundleList) => {
      const foundInstrument = bundleList.observing_system_components.some( component => component.id === lid );
      return foundInstrument
    })
  };

  const fetchBundles = async (abortController:AbortController) => {

    return Promise.all(
      instrumentHosts.map( async (instrumentHost:InstrumentHost, index:number) => {

        const query = '/api/search/1/products?q=(pds:Internal_Reference.pds:lid_reference eq "' + instrumentHost[PDS4_INFO_MODEL.LID] + '" and product_class eq "Product_Bundle")';

        const response = await fetch(query, {
          signal: abortController.signal,
        });

        bundles[index] = (await response.json()).data;
        const data = bundles[index];
        const tempArray = bundles.map( (list, i) => {
          if( i === index) {
            return data
          } else {
            return list
          }
        });
        setBundles(tempArray);

        return response;
      })
   )
    
    return () => abortController.abort();
    
  };

  useEffect( () => {
    setValue(tabs.findIndex( (tab) => tab == tabLabel?.toLowerCase()));
  })

  const initInstrumentTypes = () => {

    const instrumentTypesArr:string[] = [];

    if( instrumentHosts.length === 0 ) {
      setInstrumentTypes([]);
      return
    }

    instruments[selectedInstrumentHost].forEach( (instrument:Instrument) => {

      if( instrument[PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE] !== undefined && instrument[PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE].length !== 0) {

        instrument[PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE].forEach( (instrumentType:string) => {
          if( !instrumentTypesArr.includes(instrumentType) ) {
            instrumentTypesArr.push(instrumentType);
          }
        });

      } else if( instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE] !== undefined ) {

        instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE].forEach( (instrumentType:string) => {
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

  const getInvestigationSummary = () => {
    return instrumentHosts.length > 0 ? 
            instrumentHosts[selectedInstrumentHost][PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION]
              .replace(/(Instrument Host Overview) (=+)/g, "<h3>$1</h3>")
              .replace(/(Instrument Host Overview - Rover) (=+)/g, "<h3>$1</h3>")
              .replace(/(Instrument Host Overview - Spacecraft) (=+)/g, "<h3>$1</h3>")
              .replace(/(Orbiter Description) (=+)/g, "<h3>$1</h3>")
              .replace(/(Instrument Host Overview - DSN) (=+)/g, "<h3>$1</h3>")
              .replace(/(Spacecraft Structural Overview) (=+)/g, "<h3>$1</h3>")
              .replace(/(Thermal Control) (=+)/g, "<h3>$1</h3>")
              .replace(/(Propulsion) (=+)/g, "<h3>$1</h3>")
              .replace(/(Communications) (=+)/g, "<h3>$1</h3>")
              .replace(/(Attitude and Orbit Control) (=+)/g, "<h3>$1</h3>")
              .replace(/(Mechanisms) (=+)/g, "<h3>$1</h3>")
              .replace(/(Data Handling Overview) (=+)/g, "<h3>$1</h3>")
              .replace(/(Bus Management Unit) (=+)/g, "<h3>$1</h3>")
              .replace(/(Acronym List) (=+)/g, "<h3>$1</h3>")
              .replace(/(Mars Reconnaissance Orbiter Spacecraft) (-+)/g, "<h4>$1</h4>")
              .replace(/(Data Storage Subsystem) (-+)/g, "<h4>$1</h4>")
              .replace(/(Solar Array Drive Mechanism) (-+)/g, "<h4>$1</h4>")
              .replace(/(Equipment Quantity) (-+)/g, "<h4>$1</h4>")
              .replace(/(HMC) (-+)/g, "<h4>$1</h4>")
              .replace(/(NMS) (-+)/g, "<h4>$1</h4>")
              .replace(/(IMS\/HIS) (-+)/g, "<h4>$1</h4>")
              .replace(/(IMS\/HERS) (-+)/g, "<h4>$1</h4>")
              .replace(/(PIA) (-+)/g, "<h4>$1</h4>")
              .replace(/(DID\/MSM) (-+)/g, "<h4>$1</h4>")
              .replace(/(\.|\\|\/) ([^\\/.-=]*) (-){10,}/g, "$1<h4>$2</h4>")
              .replace("Spacecraft Configuration for Cruise and Approach ------------------------------------------------", "<h4>Spacecraft Configuration for Cruise and Approach</h4>")
              .replace("Spacecraft Configuration for Entry, Descent, and Landing --------------------------------------------------------", "<h3>Spacecraft Configuration for Entry, Descent, and Landing</h3>")
              .replace("Rover on the Surface of Mars ----------------------------", "<h4>Rover on the Surface of Mars</h4>")
              .replace("Instrument Host Overview - Mars Reconnaissance Orbiter ======================================================", "<h3>Instrument Host Overview - Mars Reconnaissance Orbiter</h3>")
              .replace("Instrument Host Overview - 2001 Mars Odyssey ============================================", "<h3>Instrument Host Overview - 2001 Mars Odyssey</h3>")
              .replace("Spacecraft Coordinate System ----------------------------", "<h4>Spacecraft Coordinate System</h4>")
              .replace("Telecommunications Subsystem ----------------------------", "<h4>Telecommunications Subsystem</h4>")
              .replace("Attitude and Articulation Control Subsystem -------------------------------------------", "<h4>Attitude and Articulation Control Subsystem</h4>")
              .replace("Propulsion Subsystem --------------------", "<h4>Propulsion Subsystem</h4>")
              .replace("Power Subsystem ---------------", "<h4>Power Subsystem</h4>")
              .replace("Mission Overview ================","<h3>Mission Overview</h3>")
              .replace("Mission Phases ==============","<h3>Mission Phases</h3>")
              .replace("VOYAGER 1 LAUNCH ----------------", "<h4>VOYAGER 1 LAUNCH</h4>")
              .replace("VOYAGER 1 EARTH-JUPITER CRUISE ------------------------------", "<h4>VOYAGER 1 EARTH-JUPITER CRUISE</h4>")
              .replace("VOYAGER 1 JUPITER ENCOUNTER ---------------------------", "<h4>VOYAGER 1 JUPITER ENCOUNTER</h4>")
              .replace("VOYAGER 1 JUPITER-SATURN CRUISE -------------------------------", "<h4>VOYAGER 1 JUPITER-SATURN CRUISE</h4>")
              .replace("VOYAGER 1 SATURN ENCOUNTER --------------------------", "<h4>VOYAGER 1 SATURN ENCOUNTER</h4>")
              .replace("VOYAGER 1 INTERSTELLAR MISSION ------------------------------", "<h4>VOYAGER 1 INTERSTELLAR MISSION</h4>")
              .replace("VOYAGER 2 LAUNCH ----------------", "<h4>VOYAGER 2 LAUNCH</h4>")
              .replace("VOYAGER 2 EARTH-JUPITER CRUISE ------------------------------", "<h4>VOYAGER 2 EARTH-JUPITER CRUISE</h4>")
              .replace("VOYAGER 2 JUPITER ENCOUNTER ---------------------------", "<h4>VOYAGER 2 JUPITER ENCOUNTER</h4>")
              .replace("VOYAGER 2 JUPITER-SATURN CRUISE -------------------------------", "<h4>VOYAGER 2 JUPITER-SATURN CRUISE</h4>")
              .replace("VOYAGER 2 SATURN ENCOUNTER --------------------------", "<h4>VOYAGER 2 SATURN ENCOUNTER</h4>")
              .replace("VOYAGER 2 SATURN-URANUS CRUISE ------------------------------", "<h4>VOYAGER 2 SATURN-URANUS CRUISE</h4>")
              .replace("VOYAGER 2 URANUS ENCOUNTER --------------------------", "<h4>VOYAGER 2 URANUS ENCOUNTER</h4>")
              .replace("VOYAGER 2 URANUS-NEPTUNE CRUISE -------------------------------", "<h4>VOYAGER 2 URANUS-NEPTUNE CRUISE</h4>")
              .replace("VOYAGER 2 NEPTUNE ENCOUNTER ---------------------------", "<h4>VOYAGER 2 NEPTUNE ENCOUNTER</h4>")
              .replace("VOYAGER 2 INTERSTELLAR MISSION ------------------------------ ", "<h4>VOYAGER 2 INTERSTELLAR MISSION</h4>")
              .replace("PI ------------------------------------------------- --------------------", "<h4>PI</h4>")
              .replace("DEVELOPMENT -----------", "<h4>DEVELOPMENT</h4>")
              .replace("ROVER LAUNCH ------", "<h4>ROVER LAUNCH</h4>")
              .replace("ROVER CRUISE AND APPROACH -------------------", "<h4>ROVER CRUISE AND APPROACH</H4>")
              .replace("ENTRY, DESCENT, AND LANDING ---------------------------", "<h4>ENTRY, DESCENT, AND LANDING</h4>")
              .replace("PRIMARY SURFACE MISSION -----------------------", "<h4>PRIMARY SURFACE MISSION</h4>")
              .replace("EXTENDED SURFACE MISSION ------------------------", "<h4>EXTENDED SURFACE MISSION</h4>")
              .replace("LAUNCH ------", "<h4>LAUNCH</h4>")
              .replace("CRUISE ------ ", "<h4>CRUISE</h4>")
              .replace("APPROACH --------", "<h4>APPROACH</h4>")
              .replace("POST-LANDING THROUGH EGRESS --------------------------- ", "<h4>POST-LANDING THROUGH EGRESS</h4>")
              .replace("PRIMARY MISSION ---------------", "<h4>PRIMARY MISSION</h4>")
              .replace(/EXTENDED MISSION ([0-9]) ------------------/g,"<h4>EXTENDED MISSION $1</h4>")
              .replace("Cruise Objectives. -----------------", "<h4>Cruise Objectives.</h4>")
              .replace("Saturn (Planet) Objectives. --------------------------", "<h4>Saturn (Planet) Objectives</h4>")
              .replace(" Titan Objectives. ----------------", "<h4> Titan Objectives </h4>")
              .replace("Icy Satellite Objectives. ------------------------ ", "<h4>Icy Satellite Objectives</h4>")
              .replace("Ring Objectives. ---------------", "<h4>Ring Objectives</h4>")
              .replace("Magnetosphere Objectives ------------------------", "<h4>Magnetosphere Objectives</h4>")
              .replace("Acronyms and Abbreviations ==========================", "<h4>Acronyms and Abbreviations</h4>")
              .replace("Computer Command Subsystem --------------------------", "<h4>Computer Command Subsystem</h4>")
              .replace("Flight Data Subsystem ---------------------", "<h4>Flight Data Subsystem</h4>")
              .replace("Science Boom ------------", "<h4>Science Boom</h4>")
              .replace("Scan Platform -------------", "<h4>Scan Platform</h4>")
              .replace("Magnetometer Boom -----------------", "<h4>Magnetometer Boom</h4>")
              .replace("Science Sensors ---------------", "<h4>Science Sensors</h4>")
              .replace("Power and Pyrotechnics Subsystem --------------------------------", "<h4>Power and Pyrotechnics Subsystem</h4>")
              .replace("Command and Data Subsystem --------------------------", "<h4>Command and Data Subsystem</h4>")
              .replace(/ ([0-9]|a|b|c|d|e|f)\)/g, "<br />$1)")
            :
            investigation[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION]
  }

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

      const abortController = new AbortController();
      fetchBundles(abortController)

    } else if (error != null || error != undefined) {
      // Do something to handle the error
      console.log(error);
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [status, dispatch, dataManagerState, error]);

  /*useEffect( () => {

    const abortController = new AbortController();
    fetchBundles(abortController)
    return () => abortController.abort();

  }, [selectedInstrumentHost])*/

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
        textDecoration: "none",
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    navigate( generatePath("/investigations/:lid/:version/:tabLabel", {lid: investigationLid, version: investigationVersion, tabLabel: tabs[newValue].toLowerCase()}) );
  }

  const handleInstrumentHostChange = (event) => {
    event.preventDefault();
    const instrumentHostIndex = event.target.getAttribute("data-instrument-host-index");

    setSelectedInstrumentHost(instrumentHostIndex);
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
              width: "fit-content"
            }}
            separator={<Typography sx={{
              color: 'white',
              fontSize: '0.875rem',
              fontFamily: 'Inter',
              fontWeight: '400',
              lineHeight: '19px',
              wordWrap: 'break-word'
            }}>/</Typography>}
          >
            <Link color="inherit" to="/" style={styles.breadcrumbs.links}>
              Home
            </Link>
            <Link color="inherit" to="/investigations/" style={styles.breadcrumbs.links}>
              Investigations
            </Link>
            <Typography style={{ color: "white" }}>
              {investigation[PDS4_INFO_MODEL.INVESTIGATION.NAME]}
            </Typography>
          </Breadcrumbs>
          <Grid container alignItems={"flex-end"}>
            <Grid item md={7} >
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
                {investigation[PDS4_INFO_MODEL.INVESTIGATION.NAME]}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "white",
                  marginTop: "8px"
                }}
              >
                {investigation[PDS4_INFO_MODEL.INVESTIGATION.NAME]}
              </Typography>
              <InvestigationStatus stopDate={investigation[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE]} />
            </Grid>
            <Grid item md={1}></Grid>
            <Grid item xs={12} md={4}>
              <StatsList stats={stats} />
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          textAlign: "left",
          backgroundColor: "#F6F6F6",
          paddingX: "24px",
          display: instrumentHosts.length > 0 ? "block" : "none"
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
                borderRadius: "15px",
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
              onChange={handleTabChange}
              aria-label="Investigation Host Tabs"
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
          }}
        >
          <CustomTabPanel value={value} index={0}>
            <Grid container>
              <Grid item md={2} display={{ xs: "none", sm: "none", md: "block"}}>
                <Box sx={{
                  borderLeft: "1px solid #D1D1D1",
                  position: "sticky",
                  top: "24px"
                }}>
                  <Typography sx={{
                    marginLeft: "10px",
                    marginBottom: "12px",
                    color: '#17171B',
                    fontSize: "11px",
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    lineHeight: "19px",
                    letterSpacing: "0.25px",
                    wordWrap: 'break-word'
                  }}>Instruments</Typography>
                  {
                    instrumentTypes.map(instrumentType => {
                      return (
                        <AnchorLink href={"#title_" + instrumentType.toLowerCase()} sx={{
                          textDecoration: "none",
                          "&:hover .MuiDivider-root": {
                            backgroundColor: "#1C67E3",
                            opacity: 1
                          }
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: '24px',
                            marginBottom: "12px",
                          }}>
                            <Divider flexItem orientation="vertical" sx={{
                              opacity: 0,
                              borderRightWidth: "2px",
                            }} />
                            <Typography sx={{
                              marginLeft: "10px",
                              color: '#17171B',
                              fontSize: "12px",
                              fontFamily: 'Inter',
                              fontWeight: '400',
                              lineHeight: "12px",
                              letterSpacing: "0.25px",
                              wordWrap: 'break-word',
                            }}>{instrumentType}</Typography>
                          </Box>
                        </AnchorLink>
                      )
                    })
                  }
                </Box>
              </Grid>
              <Grid item xs={12} md={10}>
                <Stack>
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
                            <a name={"title_" + instrumentType.toLowerCase()}>{instrumentType}</a>
                          </Typography>
                          {
                            instruments[selectedInstrumentHost].map( (instrument:Instrument) => {
                              if( instrument[PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE]?.includes(instrumentType)
                                    || instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE]?.includes(instrumentType) ) {
                                //return <div key={"instrument_" + index}>{instrument[PDS4_INFO_MODEL.TITLE]}</div>
                                return <FeaturedInstrumentLinkListItem
                                  key={instrument[PDS4_INFO_MODEL.LID]}
                                  description={instrument[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION].toString()}
                                  lid={instrument[PDS4_INFO_MODEL.LID]}
                                  primaryAction={ () => {} }
                                  title={instrument[PDS4_INFO_MODEL.INSTRUMENT.NAME]}
                                  bundles={getRelatedInstrumentBundles(instrument[PDS4_INFO_MODEL.LID])}
                                />
                              }
                            })
                          }
                        </>
                        )
                      })
                  }
                </Stack>
              </Grid>
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Grid container>
              <Grid item md={2}>
                <Box sx={{
                  borderLeft: "1px solid #D1D1D1",
                  position: "sticky",
                  top: "20px"
                }}>
                  <Typography sx={{
                    marginLeft: "10px",
                    marginBottom: "12px",
                    color: '#17171B',
                    fontSize: "11px",
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    lineHeight: "19px",
                    letterSpacing: "0.25px",
                    wordWrap: 'break-word'
                  }}>Overview</Typography>
                  {
                    [{id:"overview-summary", label:"Summary"}].map(anchor => {
                      return (
                        <AnchorLink href={"#" + anchor.id.toLowerCase()} sx={{
                          textDecoration: "none",
                          "&:hover .MuiDivider-root": {
                            backgroundColor: "#1C67E3",
                            opacity: 1
                          }
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: '24px',
                            marginBottom: "12px",
                          }}>
                            <Divider flexItem orientation="vertical" sx={{
                              opacity: 0,
                              borderRightWidth: "2px",
                            }} />
                            <Typography sx={{
                              marginLeft: "10px",
                              color: '#17171B',
                              fontSize: "12px",
                              fontFamily: 'Inter',
                              fontWeight: '400',
                              lineHeight: "12px",
                              letterSpacing: "0.25px",
                              wordWrap: 'break-word',
                            }}>{anchor.label}</Typography>
                          </Box>
                        </AnchorLink>
                      )
                    })
                  }
                </Box>
              </Grid>
              <Grid item md={6}>
                <a id="overview-summary">
                  <Typography variant="h4" sx={{
                    color: 'black',
                    fontSize: "22px",
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    lineHeight: "26px",
                    wordWrap: 'break-word'
                  }}>Summary</Typography>
                </a>
                <Typography sx={{
                  color: 'black',
                  fontSize: "18px",
                  fontFamily: 'Public Sans',
                  fontWeight: '400',
                  lineHeight: "27px",
                  wordWrap: 'break-word'
                }} style={{ paddingBottom: "24px" }}
                  dangerouslySetInnerHTML={{
                    __html: getInvestigationSummary()
                  }}>
                </Typography>
              </Grid>
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Grid container>
              <Grid item md={2}>
                <Box sx={{
                    borderLeft: "1px solid #D1D1D1",
                    position: "sticky",
                    top: "20px"
                }}>
                  <Typography sx={{
                    marginLeft: "10px",
                    marginBottom: "12px",
                    color: '#17171B',
                    fontSize: "11px",
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    lineHeight: "19px",
                    letterSpacing: "0.25px",
                    wordWrap: 'break-word'
                  }}>Targets</Typography>
                  {
                    [{id:"all-targets", label:"All Targets"}].map(anchor => {
                      return (
                        <AnchorLink href={"#" + anchor.id.toLowerCase()} sx={{
                          textDecoration: "none",
                          "&:hover .MuiDivider-root": {
                            backgroundColor: "#1C67E3",
                            opacity: 1
                          }
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: '24px',
                            marginBottom: "12px",
                          }}>
                            <Divider flexItem orientation="vertical" sx={{
                              opacity: 0,
                              borderRightWidth: "2px",
                            }} />
                            <Typography sx={{
                              marginLeft: "10px",
                              color: '#17171B',
                              fontSize: "12px",
                              fontFamily: 'Inter',
                              fontWeight: '400',
                              lineHeight: "12px",
                              letterSpacing: "0.25px",
                              wordWrap: 'break-word',
                            }}>{anchor.label}</Typography>
                          </Box>
                        </AnchorLink>
                      )
                    })
                  }
                </Box>
              </Grid>
              <Grid item md={10}>
                <a id="all-targets">
                  <Typography variant="h4" sx={{
                    color: 'black',
                    fontSize: "22px",
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    lineHeight: "26px",
                    wordWrap: 'break-word'
                  }}>All Targets</Typography>
                </a>
                {
                  instrumentHosts.length > 0 && targets[selectedInstrumentHost].length > 0 ? (
                    targets[selectedInstrumentHost].map( (target:Target, index:number) => {
                      return <FeaturedTargetLinkListItem
                                key={"target_" + index}
                                description={target[PDS4_INFO_MODEL.TARGET.DESCRIPTION].toString()}
                                lid={target[PDS4_INFO_MODEL.LID]}
                                primaryAction={ () => {} }
                                tags={['Tag Label 1', 'Tag Label 2', 'Tag label with a very long title']}
                                title={target[PDS4_INFO_MODEL.TARGET.NAME]}
                                type={target[PDS4_INFO_MODEL.TARGET.TYPE]}
                              />
                    })
                  ) : (
                    <Box sx={{ paddingBottom: "25px", textAlign: "center"}}>
                      <Typography>There are no targets related to this investigation.</Typography>
                    </Box>
                  )
                }
              </Grid>
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Grid container>
              <Grid item md={2}>
                <Box sx={{
                  borderLeft: "1px solid #D1D1D1",
                  position: "sticky",
                  top: "20px"
                }}>
                  <Typography sx={{
                    marginLeft: "10px",
                    marginBottom: "12px",
                    color: '#17171B',
                    fontSize: "11px",
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    lineHeight: "19px",
                    letterSpacing: "0.25px",
                    wordWrap: 'break-word'
                  }}>Tools</Typography>
                  {
                    
                    ["Tool Title 1", "Tool Title 2", "Tool Title 3"].map(tool => {
                      return (
                        <AnchorLink href={"#title_" + tool.replace(" ","_").toLowerCase()} sx={{
                          textDecoration: "none",
                          "&:hover .MuiDivider-root": {
                            backgroundColor: "#1C67E3",
                            opacity: 1
                          }
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: '24px',
                            marginBottom: "12px",
                          }}>
                            <Divider flexItem orientation="vertical" sx={{
                              opacity: 0,
                              borderRightWidth: "2px",
                            }} />
                            <Typography sx={{
                              marginLeft: "10px",
                              color: '#17171B',
                              fontSize: "12px",
                              fontFamily: 'Inter',
                              fontWeight: '400',
                              lineHeight: "12px",
                              letterSpacing: "0.25px",
                              wordWrap: 'break-word',
                            }}>{tool}</Typography>
                          </Box>
                        </AnchorLink>
                      )
                    })
                  }
                </Box>
              </Grid>
              <Grid item md={10}>
                <Typography variant='body1' sx={{paddingBottom: "32px"}}>The PDS maintains many tools enabling users to work with the data in our archive. Listed below are tools that can assist you when exploring the data holding for this investigation.</Typography>
                {
                  [
                    {
                      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vulputate scelerisque ligula, sit amet molestie quam faucibus sed. Aenean mattis a sapien ut aliquet.",
                      tags: [
                        {label:'Tag Label 1'},
                        {label:'Tag Label 2'},
                        {label:'Tag Label With a Really Long Title'}
                      ],
                      title: "Tool Title 1",
                    },
                    {
                      description: "Etiam suscipit varius nulla, quis congue neque blandit quis. Donec convallis quam nulla, nec ultrices nunc congue eu. Quisque aliquam urna quis maximus ultrices. ",
                      tags: [
                        {label:'Tag Label 1'},
                        {label:'Tag Label 2'},
                        {label:'Tag Label With a Really Long Title'}
                      ],
                      title: "Tool Title 2",
                    },
                    {
                      description: "Sed rhoncus tortor posuere augue ultrices pretium. Phasellus blandit tortor leo, sed consequat lacus ultricies ut.",
                      tags: [
                        {label:'Tag Label 1'},
                        {label:'Tag Label 2'},
                        {label:'Tag Label With a Really Long Title'}
                      ],
                      title: "Tool Title 3",
                    }
                  ].map( (item, index) => {
                    return <FeaturedToolLinkListItem
                      key={index}
                      description={item.description.substring(0,200).concat("...")}
                      primaryAction={ () => {} }
                      tags={item.tags}
                      title={item.title}
                    />
                  })
                }
              </Grid>
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <Container
              maxWidth={"xl"}
              sx={{
                paddingTop: "0px",
                textAlign: "left",
              }}
            >
              <Box sx={{
                marginBottom: "10px"
              }}>
                <Grid
                  container
                  spacing={2}
                  alignItems="left"
                  sx={{
                    paddingY: "10px",
                    paddingLeft: "10px",
                    backgroundColor: "#F6F6F6",
                    '& .MuiGrid-item': {
                      paddingTop: "0px",
                    }
                  }}
                >
                  <Grid item xs={7}>
                    <Typography
                      variant="body1"
                      display="block"
                      color="#58585B"
                      style={{
                        fontSize: "11px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      Name
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography
                      variant="body1"
                      display="block"
                      color="#58585B"
                      style={{
                        fontSize: "11px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      Version
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography
                      variant="body1"
                      display="block"
                      color="#58585B"
                      style={{
                        fontSize: "11px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      Year
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography
                      variant="body1"
                      display="block"
                      color="#58585B"
                      style={{
                        fontSize: "11px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      Size
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography
                      variant="body1"
                      display="block"
                      color="#58585B"
                      style={{
                        fontSize: "11px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      Format
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Stack>
                {
                  [
                    {
                      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vulputate scelerisque ligula, sit amet molestie quam faucibus sed. Aenean mattis a sapien ut aliquet.",
                      format: "PDF",
                      size: "1.04MB",
                      tags: ['Tag Label 1', 'Tag Label 2', 'Tag Label with a really long title'],
                      title: "Resource Title 1",
                      version: "1.1",
                      year: "2022"
                    },
                    {
                      description: "Etiam suscipit varius nulla, quis congue neque blandit quis. Donec convallis quam nulla, nec ultrices nunc congue eu. Quisque aliquam urna quis maximus ultrices. ",
                      format: "PDF",
                      size: "1.83MB",
                      tags: ['Tag Label 1', 'Tag Label 2', 'Tag Label with a really long title'],
                      title: "Resource Title 2",
                      version: "1.0",
                      year: "2019"
                    },
                    {
                      description: "Sed rhoncus tortor posuere augue ultrices pretium. Phasellus blandit tortor leo, sed consequat lacus ultricies ut.",
                      format: "PDF",
                      size: "99KB",
                      tags: ['Tag Label 1', 'Tag Label 2', 'Tag Label with a really long title'],
                      title: "Resource Title 3",
                      version: "1.2",
                      year: "2018"
                    },
                    {
                      description: "Praesent mauris nisl, rutrum at mattis quis, condimentum non nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
                      format: "PDF",
                      size: "2.23MB",
                      tags: ['Tag Label 1', 'Tag Label 2', 'Tag Label with a really long title'],
                      title: "Resource Title 4",
                      version: "1.0",
                      year: "2017"
                    }
                  ].map( (item, index) => {
                    return <FeaturedResourceLinkListItem
                      key={index}
                      description={item.description}
                      format={item.format}
                      primaryAction={ () => {} }
                      size={item.size}
                      tags={item.tags}
                      title={item.title}
                      version={item.version}
                      year={item.year}
                    />
                  })
                }
              </Stack>
            </Container>
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
  const instruments = new Array( instrumentHosts.length );
  const targets = new Array( instrumentHosts.length );

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
