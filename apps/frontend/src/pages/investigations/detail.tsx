import { SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";

import { generatePath, Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/state/hooks";
import { convertLogicalIdentifier, LID_FORMAT } from "src/utils/strings";
import { getData } from "src/state/slices/dataManagerSlice";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { RootState } from "src/state/store";
import { selectLatestInvestigationVersion } from "src/state/selectors";
import { connect } from "react-redux";
import { Instrument, InstrumentHost, Investigation, Target } from "src/types";
import { selectLatestInstrumentHostsForInvestigation } from "src/state/selectors/instrumentHost";
import { selectLatestInstrumentsForInstrumentHost } from "src/state/selectors";
import { selectLatestTargetsForInstrumentHost } from "src/state/selectors/targets";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { Box, Breadcrumbs, Button, Container, Divider, Grid, Link as AnchorLink, Stack, Tab, Tabs, Typography, IconButton } from "@mui/material";
import InvestigationStatus from "src/components/InvestigationStatus/InvestigationStatus";
import StatsList from "src/components/StatsList/StatsList";

import FeaturedTargetLinkListItem from "src/components/FeaturedListItems/FeaturedTargetLinkListItem";
import FeaturedToolLinkListItem from "src/components/FeaturedListItems/FeaturedToolLinkListItem";
import FeaturedResourceLinkListItem from "src/components/FeaturedListItems/FeaturedResourcesLinkListItem";
import { FeaturedLink, FeaturedLinkDetails, FeaturedLinkDetailsVariant, Loader } from "@nasapds/wds-react";
import { Bundle } from "src/types/bundle";
import { ArrowForward } from "@mui/icons-material";

const InvestigationDetailPage = () => {

  const { investigationLid, tabLabel } = useParams();
  const dispatch = useAppDispatch();
  const convertedInvestigationLid = convertLogicalIdentifier(investigationLid !== undefined ? investigationLid : "", LID_FORMAT.DEFAULT);

  const dataManagerStatus = useAppSelector( (state) => { return state.dataManager.status } )

  useEffect( () => {

    if( dataManagerStatus === 'idle' ) {
      dispatch( getData() );
    }

  }, [dispatch, dataManagerStatus]);

  return (
    <>
      <ConnectedComponent investigationLid={convertedInvestigationLid} tabLabel={tabLabel ? tabLabel : "instruments"} />
    </>
  )
  
};

type InstrumentDetailPathParams = {
  lid:string;
}

interface InvestigationDetailBodyProps {
  instrumentHosts:InstrumentHost[];
  instruments:Array<Array<Instrument>>;
  investigation:Investigation;
  status:string;
  tabLabel:string
  targets:Array<Array<Target>>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Stats {
  label: string;
  value: string;
  enableCopy?: boolean;
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

const TABS = [
  'instruments',
  'overview',
  'targets',
  'tools',
  'resources'
];

const InvestigationDetailBody = (props:InvestigationDetailBodyProps) => {

  const {instrumentHosts, instruments, investigation, status, tabLabel, targets } = props;
  const bundles = useRef<Array<Array<Bundle>>>([]);
  const [instrumentTypes, setInstrumentTypes] = useState<string[]>([]);
  const [selectedInstrumentHost, setSelectedInstrumentHost] = useState<number>(0);
  const [value, setValue] = useState(TABS.findIndex( (tab) => tab == tabLabel?.toLowerCase()));

  const navigate = useNavigate();

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
      value: investigation.lid,
      enableCopy: true
    }
  ];

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

  const initInstrumentTypes = useCallback( () => {

    const instrumentTypesArr:string[] = [];

    if( instrumentHosts.length === 0 ) {
      setInstrumentTypes([]);
      return
    }

    instruments[selectedInstrumentHost].forEach( (instrument:Instrument) => {

      if( instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE] !== undefined && instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE].length !== 0 ) {

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
    
  }, [instrumentHosts.length, instruments, selectedInstrumentHost]);

  const getInvestigationSummary = () => {
    return instrumentHosts.length > 0 ? 
            instrumentHosts[selectedInstrumentHost][PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION]
            :
            investigation[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION]
  }

  const getRelatedInstrumentBundles = (lid:string) => {
    return bundles.current[selectedInstrumentHost].filter( (bundle) => {
      const foundInstrument = bundle[PDS4_INFO_MODEL.OBSERVING_SYSTEM_COMPONENTS].some( (component) => component.id === lid);
      return foundInstrument
    });
  };

  const handleTabChange = (event: SyntheticEvent) => {
    const newTabIndex = parseInt(event.currentTarget.getAttribute("data-tab-index") || "0");
    const urlFriendlyLid:string = convertLogicalIdentifier(investigation[PDS4_INFO_MODEL.LID], LID_FORMAT.URL_FRIENDLY);
    const params = {
      lid: urlFriendlyLid ? urlFriendlyLid : null,
      tabLabel: TABS[newTabIndex].toLowerCase()
    };
    navigate( generatePath("/investigations/:lid/:tabLabel", params) );
  };

  const handleInstrumentHostChange = (event:SyntheticEvent) => {
    const instrumentHostIndex = event.currentTarget.getAttribute("data-instrument-host-index");
    if( instrumentHostIndex !== null ) {
      setSelectedInstrumentHost(parseInt(instrumentHostIndex))
    }
  };

  const instrumentListItemPrimaryAction = (params:InstrumentDetailPathParams) => {
    params.lid = convertLogicalIdentifier(params.lid,LID_FORMAT.URL_FRIENDLY);
    navigate( generatePath("/instruments/:lid/data", params) );
  };

  const fetchBundles = useCallback( async (abortController:AbortController) => {

    bundles.current = new Array( instrumentHosts.length ).fill([]);

    return Promise.all(
      instrumentHosts.map( async (instrumentHost:InstrumentHost, index:number) => {
        const lid = instrumentHost[PDS4_INFO_MODEL.LID];
        let query = '/api/search/1/products?q=(pds:Internal_Reference.pds:lid_reference eq "' + lid + '" and product_class eq "Product_Bundle")';
        const config = {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          signal: abortController.signal
        };

        const fields = [
          PDS4_INFO_MODEL.LID,
          PDS4_INFO_MODEL.OBSERVING_SYSTEM_COMPONENTS,
          PDS4_INFO_MODEL.TITLE,
          PDS4_INFO_MODEL.BUNDLE.DESCRIPTION,
          PDS4_INFO_MODEL.BUNDLE.TYPE
        ];
    
        // Add the specific fields that should be returned
        query += "&fields=";
        fields.forEach( (field, index) => {
          query += field;
          query += index < fields.length - 1 ? "," : "";
        });

        if( import.meta.env.DEV ) {
          // Output query URL to help with debugging only in DEV mode
          console.info("Bundle Query: ", query)
        }

        const response = await fetch(query, config);
        const temp = (await response.json());

        bundles.current[index] = temp.data;

        return response;

      })
    );
  }, [bundles, instrumentHosts]);

  useEffect(() => {

    if (status === "succeeded") {
      const abortController = new AbortController();
      fetchBundles(abortController);
    }

  }, [status, fetchBundles]);

  useEffect( () => {
    initInstrumentTypes();
  }, [initInstrumentTypes]);

  useEffect( () => {
    setValue(TABS.findIndex( (tab) => tab == tabLabel?.toLowerCase()));
  }, [tabLabel]);

  return (
    <>
      <DocumentMeta
        title={ investigation.title + " Investigation Details" }
        description={ investigation.title + "Investigation Details." }
      />
      {
        (status === 'idle' || status === 'pending' )
        &&
        <Box sx={{ padding: "40px" }}>
          <Loader />
        </Box>
      }
      {
        status === 'succeeded'
        && 
        <Container maxWidth={false} disableGutters>
          {/* Page Intro */}
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              backgroundColor: "#000000",
              backgroundImage: "url(/assets/images/headers/investigations/".concat(investigation[PDS4_INFO_MODEL.LID]).concat(".jpg)"),
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              minHeight: "200px",
              height: "fit-content",
              textAlign: "left",
            }}
          >
            <Container
              maxWidth={"xl"}
              sx={{
                paddingY: "24px",
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
                  {investigation[PDS4_INFO_MODEL.TITLE]}
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
                    {investigation[PDS4_INFO_MODEL.TITLE]}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "white",
                      marginTop: "8px"
                    }}
                  >
                    {investigation[PDS4_INFO_MODEL.TITLE]}
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
                        {host[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME]
                          .toString()
                          .toLowerCase()}
                      </Button>
                    );
                  })}
                </Stack>
              </Box>
            </Container>
          </Container>
          {/* Main Content */}
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              textAlign: "left",
              padding: "24px"
            }}
          >
            {/* Tab Bar */}
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
                  <Tab label="Instruments" data-tab-index={0} {...a11yProps(0)} disableRipple disableTouchRipple />
                  <Tab label="Overview" data-tab-index={1} {...a11yProps(1)} disableRipple disableTouchRipple />
                  {/* Hidden for the time being as these aren't part of the Phase 1 MVP
                  <Tab label="Targets" {...a11yProps(2)} disableRipple disableTouchRipple />
                  <Tab label="Tools" {...a11yProps(3)} disableRipple disableTouchRipple />
                  <Tab label="Resources" {...a11yProps(4)} disableRipple disableTouchRipple />
                  */}
                </Tabs>
              </Box>
            </Container>
            {/* Tabs */}
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
                                <a id={"title_" + instrumentType.toLowerCase()}>{instrumentType}</a>
                              </Typography>
                              {
                                instruments[selectedInstrumentHost].map( (instrument:Instrument) => {
                                  if( instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE]?.includes(instrumentType) ) {
                                    return <FeaturedInstrumentLinkListItem
                                      key={instrument[PDS4_INFO_MODEL.LID]}
                                      description={instrument[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION].toString()}
                                      primaryAction={ () => instrumentListItemPrimaryAction({ lid: instrument[PDS4_INFO_MODEL.LID] }) }
                                      title={instrument[PDS4_INFO_MODEL.TITLE]}
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
                    <Typography sx={{
                      color: 'black',
                      fontSize: "22px",
                      fontFamily: 'Inter',
                      fontWeight: '700',
                      lineHeight: "26px",
                      wordWrap: 'break-word'
                    }}>
                      Looking for Data
                    </Typography>
                    <Stack direction="column" alignItems={"left"} gap={2} sx={{
                      paddingTop: "16px"
                    }}>
                      <Stack direction="row" alignItems={"center"} gap={1} onClick={ () => {} }>
                        <Typography sx={{
                          color: 'black',
                          fontSize: 16,
                          fontFamily: 'Inter',
                          fontWeight: '600',
                          lineHeight: '20px',
                          wordWrap: "break-word"
                        }}
                        >Instruments</Typography>
                        <IconButton
                          sx={{
                            "&:hover": {
                              backgroundColor: "#B60109"
                            },
                            backgroundColor: "#F64137",
                            height: "20px",
                            width: "20px",
                            padding: "10px"
                          }}
                          aria-label="arrow"
                          onClick={() => { }}>
                            <ArrowForward sx={{
                              color: "#FFFFFF",
                              width: "14px"
                            }}
                          />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
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
                          description={item.description}
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
      }
      { 
        status === 'failed'
          && <>ERROR!</>
      }
    </>
  )
};

const mapStateToProps = (state:RootState, ownProps:{investigationLid:string, tabLabel:string}):InvestigationDetailBodyProps => {

  //let bundles:Array<Array<Bundle>> = [];
  let instruments:Array<Array<Instrument>> = [];
  let instrumentHosts:InstrumentHost[] = []
  let investigation:Investigation = Object();
  let targets:Array<Array<Target>> = [];
  
  if( state.investigations.status === 'succeeded' ) {

    investigation = selectLatestInvestigationVersion(state, ownProps.investigationLid);

    if( state.instrumentHosts.status === 'succeeded' ) {

      instrumentHosts = selectLatestInstrumentHostsForInvestigation(state, investigation[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST]);
      instruments = new Array( instrumentHosts.length );
      targets = new Array( instrumentHosts.length );

      // Get data for each instrument host
      instrumentHosts.map( (instrumentHost:InstrumentHost, index:number) => {

        // Get related instruments
        instruments[index] = selectLatestInstrumentsForInstrumentHost(state, instrumentHost[PDS4_INFO_MODEL.REF_LID_INSTRUMENT])

        // Get related targets
        targets[index] = selectLatestTargetsForInstrumentHost(state, instrumentHost[PDS4_INFO_MODEL.REF_LID_TARGET])
                          .sort( (a:Target, b:Target) => {
                            if( a[PDS4_INFO_MODEL.TARGET.NAME].toLowerCase() < b[PDS4_INFO_MODEL.TARGET.NAME].toLowerCase() ) {
                              return -1
                            } else if( a[PDS4_INFO_MODEL.TARGET.NAME].toLowerCase() > b[PDS4_INFO_MODEL.TARGET.NAME].toLowerCase() ) {
                              return 1
                            }
                            return 0;
                          });

      });

    }

  }

  return {
    instrumentHosts: instrumentHosts,
    instruments: instruments,
    investigation: investigation,
    status: state.dataManager.status,
    tabLabel: ownProps.tabLabel,
    targets: targets
  }

}

const ConnectedComponent = connect(mapStateToProps)(InvestigationDetailBody);
export default InvestigationDetailPage;
