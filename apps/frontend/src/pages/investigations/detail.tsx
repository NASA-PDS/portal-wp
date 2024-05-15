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

  useEffect( () => {
    setValue(tabs.findIndex( (tab) => tab == tabLabel?.toLowerCase()));
  })

  const initInstrumentTypes = () => {

    const instrumentTypesArr:string[] = [];
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

  const getInvestigationSummary = () => {
    return instrumentHosts[selectedInstrumentHost][PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION]
            .replace("Instrument Host Overview ========================", "<h3>Instrument Host Overview</h3>")
            .replace("Instrument Host Overview - Spacecraft =====================================", "<h4>Instrument Host Overview - Spacecraft</h4>")
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
            .replace("Data Storage Subsystem ----------------------", "<h4>Data Storage Subsystem</h4>")
            .replace(/(b|c|d|e|f)\)/g, "<br />$1)")
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
              {investigation[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE]}
            </Typography>
          </Breadcrumbs>
          <Grid container>
            <Grid item md={7}>
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
            </Grid>
            <Grid item md={1}></Grid>
            <Grid item md={4}>
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
                                  primaryAction={ () => {} }
                                  title={instrument[PDS4_INFO_MODEL.INSTRUMENT.NAME]}
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
                    ["Heading", "Heading", "Heading"].map(heading => {
                      return (
                        <AnchorLink href={"#title_" + heading.toLowerCase()} sx={{
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
                            }}>{heading}</Typography>
                          </Box>
                        </AnchorLink>
                      )
                    })
                  }
                </Box>
              </Grid>
              <Grid item md={10}>
                <Typography variant="h4" sx={{
                  color: 'black',
                  fontSize: "22px",
                  fontFamily: 'Inter',
                  fontWeight: '700',
                  lineHeight: "26px",
                  wordWrap: 'break-word'
                }}>Summary</Typography>
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
                    instrumentHosts.length > 0 ? 
                      targets[selectedInstrumentHost].map( target => {
                        return (
                          <AnchorLink href={"#title_" + target[PDS4_INFO_MODEL.TARGET.NAME].toString().replace(" ","_").toLowerCase()} sx={{
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
                                }}>{target[PDS4_INFO_MODEL.TARGET.NAME]}</Typography>
                            </Box>
                          </AnchorLink>
                        )
                      })
                      : []
                    }
                </Box>
              </Grid>
              <Grid item md={10}>
                {
                  instrumentHosts.length > 0 && targets[selectedInstrumentHost].length > 0 ? (
                    targets[selectedInstrumentHost].map( (target:Target, index:number) => {
                      return <FeaturedTargetLinkListItem
                                key={"target_" + index}
                                description={target[PDS4_INFO_MODEL.TARGET.DESCRIPTION].toString()}
                                lid={target[PDS4_INFO_MODEL.LID]}
                                primaryAction={ () => {} }
                                tags={['Tag 1', 'Tag 2', 'Tag 3']}
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
                    
                    ["Tool Name", "Tool Name", "Tool Name"].map(tool => {
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
                <FeaturedToolLinkListItem
                    key={1}
                    description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus porttitor lorem ac velit laoreet, eu dapibus ante pellentesque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla blandit elit vel libero porttitor, ut ultrices sem facilisis. Maecenas egestas dignissim lacus vitae blandit. Ut in nulla nec lorem tempus elementum sed a nisl. Nunc nisl lacus, faucibus at vulputate id, viverra vitae nibh. Nam quis tortor enim. Phasellus ultrices sit amet felis sit amet consequat. Etiam a cursus ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas id commodo turpis.".substring(0,275).concat("...")}
                    primaryAction={ () => {} }
                    tags={toolTags}
                    title={"Tool Name"}
                />
                <FeaturedToolLinkListItem
                    key={2}
                    description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus porttitor lorem ac velit laoreet, eu dapibus ante pellentesque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla blandit elit vel libero porttitor, ut ultrices sem facilisis. Maecenas egestas dignissim lacus vitae blandit. Ut in nulla nec lorem tempus elementum sed a nisl. Nunc nisl lacus, faucibus at vulputate id, viverra vitae nibh. Nam quis tortor enim. Phasellus ultrices sit amet felis sit amet consequat. Etiam a cursus ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas id commodo turpis.".substring(0,275).concat("...")}
                    primaryAction={ () => {} }
                    tags={toolTags}
                    title={"Tool Name"}
                />
                <FeaturedToolLinkListItem
                    key={3}
                    description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus porttitor lorem ac velit laoreet, eu dapibus ante pellentesque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla blandit elit vel libero porttitor, ut ultrices sem facilisis. Maecenas egestas dignissim lacus vitae blandit. Ut in nulla nec lorem tempus elementum sed a nisl. Nunc nisl lacus, faucibus at vulputate id, viverra vitae nibh. Nam quis tortor enim. Phasellus ultrices sit amet felis sit amet consequat. Etiam a cursus ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas id commodo turpis.".substring(0,275).concat("...")}
                    primaryAction={ () => {} }
                    tags={toolTags}
                    title={"Tool Name"}
                />
              </Grid>
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <Typography variant="h4">Resources</Typography>
            <Container
              maxWidth={"xl"}
              sx={{
                paddingTop: "48px",
                textAlign: "left",
              }}
            >
              <Box>
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
