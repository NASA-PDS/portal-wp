import { Instrument, InstrumentHost, Investigation } from "src/types";

import { connect } from "react-redux";
import { generatePath, Link, useNavigate, useParams } from "react-router-dom";
import { convertLogicalIdentifier, LID_FORMAT } from "src/utils/strings";
import { useCallback, useEffect, useState } from "react";
import { getData } from "src/state/slices/dataManagerSlice";
import { useAppDispatch, useAppSelector } from "src/state/hooks";
import { RootState } from "src/state/store";
import { selectLatestInstrumentVersion } from "src/state/selectors";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { Box, Breadcrumbs, Container, Divider, Grid, Link as AnchorLink, Tab, Tabs, Typography, Stack, Button, IconButton } from "@mui/material";
import { IconArrowFilledDown, Loader } from "@nasapds/wds-react";
import InvestigationStatus from "src/components/InvestigationStatus/InvestigationStatus";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { Stats, StatsList } from "src/components/StatsList/StatsList";
import { selectLatestInstrumentHostVersion } from "src/state/selectors/instrumentHost";
import { selectLatestInvestigationVersion } from "src/state/selectors";
import FeaturedDataBundleLinkListItem from "src/components/FeaturedListItems/FeaturedDataBundleLinkListItem";
import { ArrowOutward } from "@mui/icons-material";


interface InstrumentDetailBodyProps {
  instrument:Instrument;
  instrumentHost:InstrumentHost,
  investigation:Investigation,
  status:string;
  tabLabel:string
}

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

const TABS = [
  'data',
  'overview'
];

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const InstrumentDetailPage = () => {

  const { instrumentLid, tabLabel } = useParams();
  const dispatch = useAppDispatch();
  const convertedInstrumentLid = convertLogicalIdentifier(instrumentLid !== undefined ? instrumentLid : "", LID_FORMAT.DEFAULT);

  const dataManagerStatus = useAppSelector( (state) => { return state.dataManager.status } )

  useEffect( () => {

    if( dataManagerStatus === 'idle' ) {
      dispatch( getData() );
    }

  }, [dispatch, dataManagerStatus]);

  return (
    <>
      <ConnectedComponent instrumentLid={convertedInstrumentLid} tabLabel={tabLabel ? tabLabel : "instruments"} />
    </>
  );

};

const InstrumentDetailBody = (props:InstrumentDetailBodyProps) => {

  const {instrument, investigation, status, tabLabel } = props;
  const [dataTypes, setDataTypes] = useState<string[]>([]);
  const [value, setValue] = useState(TABS.findIndex( (tab) => tab == tabLabel?.toLowerCase()));

  const navigate = useNavigate();

  const stats:Stats[] = [
    {
      label: "Investigation",
      value: investigation[PDS4_INFO_MODEL.TITLE]
    },
    {
      label: "Temporal Coverage",
      value: investigation[PDS4_INFO_MODEL.INVESTIGATION.START_DATE]?.concat(" - ", investigation[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE] !== "3000-01-01T00:00:00.000Z" ? investigation[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE] : "(ongoing)")
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
  }

  const handleTabChange = (event: React.SyntheticEvent) => {
    const newTabIndex = parseInt(event.currentTarget.getAttribute("data-tab-index") || "0");
    const urlFriendlyLid:string = convertLogicalIdentifier(instrument[PDS4_INFO_MODEL.LID], LID_FORMAT.URL_FRIENDLY);
    const params = {
      lid: urlFriendlyLid ? urlFriendlyLid : null,
      tabLabel: TABS[newTabIndex].toLowerCase()
    };
    navigate( generatePath("/instruments/:lid/:tabLabel", params) );
  };

  const initDataTypes = useCallback( () => {

    const dataTypesArr:string[] = [
      'Derived Data Products from Investigators ',
      'Derived Data Products',
      'Raw Data Products'
    ];

    setDataTypes(dataTypesArr);
    
  }, []);

  useEffect( () => {
    setValue(TABS.findIndex( (tab) => tab == tabLabel?.toLowerCase()));
  }, [tabLabel]);

  useEffect( () => {

    if (status === "succeeded") {
      initDataTypes();
    }

  }, [status, initDataTypes]);

  return (
    <>
      <DocumentMeta
        title={ instrument.title + " Instrument details" }
        description={ instrument.title + "Instrument details" }
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
              backgroundImage: "url(/assets/images/headers/instruments/".concat(instrument[PDS4_INFO_MODEL.LID]).concat(".jpg)"),
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
              <Grid container>
                <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                  { /* Column Gutter */ } 
                </Grid>
                <Grid item lg={10}>
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
                    <Link color="inherit" to="/instruments/" style={styles.breadcrumbs.links}>
                      Instruments
                    </Link>
                    <Typography style={{ color: "white" }}>
                      {instrument[PDS4_INFO_MODEL.TITLE]}
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
                        src={"/assets/images/logos/".concat(instrument[PDS4_INFO_MODEL.LID]).concat(".png")}
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
                        {instrument[PDS4_INFO_MODEL.TITLE]}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "white",
                          marginTop: "8px"
                        }}
                      >
                        {instrument[PDS4_INFO_MODEL.TITLE]}
                      </Typography>
                      <InvestigationStatus stopDate={investigation[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE]} />
                    </Grid>
                    <Grid item md={1}></Grid>
                    <Grid item xs={12} md={4}>
                      <StatsList stats={stats} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                  { /* Column Gutter */ } 
                </Grid>
              </Grid>
            </Container>
          </Container>
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              textAlign: "left",
              padding: "24px",
              backgroundColor: "#F6F6F6"
            }}
          >
            {/* Quick Action Bar */}
            <Container
              maxWidth={"xl"}
              disableGutters
              sx={{
                paddingY: "24px",
              }}
            >
              <Grid container>
                <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                  { /* Column Gutter */ } 
                </Grid>
                <Grid item lg={10}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} gap={"16px"}>
                    <Stack direction={"row"}>
                      <Button sx={{
                        backgroundColor: "#F64137",
                        paddingY: "12px",
                        paddingX: "20px",
                        borderRadius: "0px",
                        color: 'white',
                        fontSize: "16px",
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        lineHeight: "20px",
                        wordWrap: 'break-word'
                      }}>Browse Data
                      <IconArrowFilledDown />
                      </Button>
                    </Stack>
                    <Stack direction="row" alignItems={"center"} gap={"4px"}>
                      <Typography sx={{
                        color: 'black',
                        fontSize: 16,
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        lineHeight: '20px',
                        wordWrap: "break-word"
                      }}
                      >Mission Home Page</Typography>
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
                        onClick={() => {}}>
                          <ArrowOutward sx={{
                            color: "#FFFFFF",
                            width: "14px"
                          }}
                        />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" alignItems={"center"} gap={"4px"}>
                      <Typography sx={{
                        color: 'black',
                        fontSize: 16,
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        lineHeight: '20px',
                        wordWrap: "break-word"
                      }}
                      >Instrument Team Page</Typography>
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
                        onClick={() => {}}>
                          <ArrowOutward sx={{
                            color: "#FFFFFF",
                            width: "14px"
                          }}
                        />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                  { /* Column Gutter */ } 
                </Grid>
              </Grid>
            </Container>

          </Container>
          {/* Main Content Body */}
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
              <Grid container>
                <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                  { /* Column Gutter */ } 
                </Grid>
                <Grid item xs={10}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleTabChange}
                      aria-label="Investigation Host Tabs"
                      sx={styles.tabs}
                    >
                      <Tab label="Data" data-tab-index={0} {...a11yProps(0)} disableRipple disableTouchRipple />
                      <Tab label="Overview" data-tab-index={1} {...a11yProps(1)} disableRipple disableTouchRipple />
                    </Tabs>
                  </Box>
                </Grid>
                <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                  { /* Column Gutter */ } 
                </Grid>
              </Grid>
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
                  <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                    { /* Column Gutter */ } 
                  </Grid>
                  <Grid item lg={2} display={{ xs: "none", sm: "none", lg: "block"}}>
                    <Box sx={{
                      borderLeft: "1px solid #D1D1D1",
                      marginRight: "48px",
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
                        dataTypes.map(dataType => {
                          return (
                            <AnchorLink href={"#title_" + dataType.toLowerCase()} sx={{
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
                                }}>{dataType}</Typography>
                              </Box>
                            </AnchorLink>
                          )
                        })
                      }
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={8}>
                    <Typography>Raw Data is original data from an instrument. If compression, reformatting, packetization, or other translation has been applied to facilitate data transmission or storage, those processes will be reversed so that the archived data are in a PDS approved archive format. Derived Data are results that have been distilled from one or more calibrated data products (for example, maps, gravity or magnetic fields, or ring particle size distributions). Supplementary data, such as calibration tables or tables of viewing geometry, used to interpret observational data should also be classified as ‘derived’ data if not easily matched to one of the other categories.</Typography>
                    <Stack sx={{marginTop: "32px"}}>
                      {
                        dataTypes.map( (dataType, index) => {
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
                                <a id={"title_" + dataType.toLowerCase()}>{dataType}</a>
                              </Typography>
                              {
                                [{
                                  [PDS4_INFO_MODEL.LID]: "urn:nasa:pds:.....",
                                  [PDS4_INFO_MODEL.TITLE]: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                  [PDS4_INFO_MODEL.BUNDLE.DESCRIPTION]: "Nulla lobortis mi nunc, ut facilisis ipsum tincidunt vitae. Praesent a ipsum non enim facilisis consectetur sodales malesuada metus. Suspendisse potenti. Aenean iaculis orci at ultrices interdum.",
                                  [PDS4_INFO_MODEL.BUNDLE.TYPE]: "Archive",
                                },
                                {
                                  [PDS4_INFO_MODEL.LID]: "urn:nasa:pds:.....",
                                  [PDS4_INFO_MODEL.TITLE]: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                  [PDS4_INFO_MODEL.BUNDLE.DESCRIPTION]: "Nulla lobortis mi nunc, ut facilisis ipsum tincidunt vitae. Praesent a ipsum non enim facilisis consectetur sodales malesuada metus. Suspendisse potenti. Aenean iaculis orci at ultrices interdum.",
                                  [PDS4_INFO_MODEL.BUNDLE.TYPE]: "Archive",
                                },
                                {
                                  [PDS4_INFO_MODEL.LID]: "urn:nasa:pds:.....",
                                  [PDS4_INFO_MODEL.TITLE]: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                  [PDS4_INFO_MODEL.BUNDLE.DESCRIPTION]: "Nulla lobortis mi nunc, ut facilisis ipsum tincidunt vitae. Praesent a ipsum non enim facilisis consectetur sodales malesuada metus. Suspendisse potenti. Aenean iaculis orci at ultrices interdum.",
                                  [PDS4_INFO_MODEL.BUNDLE.TYPE]: "Archive",
                                }].map( (dataBundle) => {
                                  return <FeaturedDataBundleLinkListItem 
                                    lid={dataBundle[PDS4_INFO_MODEL.LID]}
                                    title={dataBundle[PDS4_INFO_MODEL.TITLE]}
                                    description={dataBundle[PDS4_INFO_MODEL.BUNDLE.DESCRIPTION]}
                                    primaryAction={ () =>{} }
                                    tags={[]}
                                    type={dataBundle[PDS4_INFO_MODEL.BUNDLE.TYPE]}
                                  />
                                })
                              }
                            </>
                            )
                          })
                      }
                    </Stack>
                  </Grid>
                  <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                    { /* Column Gutter */ } 
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Grid container>
                  <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                    { /* Column Gutter */ } 
                  </Grid>
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
                        __html: instrument[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION]
                      }}>
                    </Typography>
                  </Grid>
                  <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                    { /* Column Gutter */ } 
                  </Grid>
                </Grid>
              </CustomTabPanel>
            </Container>
          </Container>
        </Container>
      }
    </>
  );
};

const mapStateToProps = (state:RootState, ownProps:{instrumentLid:string, tabLabel:string}):InstrumentDetailBodyProps => {

  let instrument:Instrument = Object();
  let investigation:Investigation = Object();
  let instrumentHost:InstrumentHost = Object();

  if( state.investigations.status === 'succeeded' ) {
  
    instrument = selectLatestInstrumentVersion(state, ownProps.instrumentLid);
    instrumentHost = selectLatestInstrumentHostVersion(state, instrument[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST][0]);
    investigation = selectLatestInvestigationVersion(state, instrumentHost[PDS4_INFO_MODEL.REF_LID_INVESTIGATION][0]);

  }

  return {
    instrument: instrument,
    instrumentHost: instrumentHost,
    investigation: investigation,
    status: state.dataManager.status,
    tabLabel: ownProps.tabLabel
  }
}
const ConnectedComponent = connect(mapStateToProps)(InstrumentDetailBody);
export default InstrumentDetailPage;
