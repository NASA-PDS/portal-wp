import { Collection, Instrument, InstrumentHost, Investigation } from "src/types";

import { connect } from "react-redux";
import { generatePath, Link, useNavigate, useParams } from "react-router-dom";
import { convertLogicalIdentifier, LID_FORMAT } from "src/utils/strings";
import { useEffect, useState } from "react";
import { getData } from "src/state/slices/dataManagerSlice";
import { useAppDispatch, useAppSelector } from "src/state/hooks";
import { RootState } from "src/state/store";
import { selectLatestInstrumentVersion } from "src/state/selectors";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { Box, Breadcrumbs, Container, Divider, Grid, Link as AnchorLink, Stack, Tab, Tabs, Typography as OldTypography } from "@mui/material";
import { DATA_COLLECTION_GROUP_TITLE, FeaturedLink, FeaturedLinkDetails, FeaturedLinkDetailsVariant, Loader, Typography } from "@nasapds/wds-react";
import InvestigationStatus from "src/components/InvestigationStatus/InvestigationStatus";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { Stats, StatsList } from "src/components/StatsList/StatsList";
import { selectLatestInstrumentHostVersion, selectLatestInvestigationVersion } from "src/state/selectors";
import { distinct } from "src/utils/arrays";
import React from "react";


interface InstrumentDetailBodyProps {
  collections:Collection[];
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


const fetchBundles = async (instrumentLid:string, abortController:AbortController) => {

  let query = '/api/search/1/products?q=(product_class EQ "Product_Collection" AND pds:Collection.pds:collection_type EQ "Data" AND pds:Internal_Reference.pds:lid_reference EQ "' + instrumentLid + '")';
  const config = {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    signal: abortController.signal
  };

  const fields = [
    PDS4_INFO_MODEL.COLLECTION.DESCRIPTION,
    PDS4_INFO_MODEL.COLLECTION.TYPE,
    PDS4_INFO_MODEL.LID,
    PDS4_INFO_MODEL.REF_LID_INSTRUMENT,
    PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST,
    PDS4_INFO_MODEL.REF_LID_INVESTIGATION,
    PDS4_INFO_MODEL.REF_LID_TARGET,
    PDS4_INFO_MODEL.PRIMARY_RESULT_SUMMARY.PROCESSING_LEVEL,
    PDS4_INFO_MODEL.SCIENCE_FACETS.DISCIPLINE_NAME,
    PDS4_INFO_MODEL.SOURCE_PRODUCT_EXTERNAL.DOI,
    PDS4_INFO_MODEL.TIME_COORDINATES.START_DATE_TIME,
    PDS4_INFO_MODEL.TIME_COORDINATES.STOP_DATE_TIME,
    PDS4_INFO_MODEL.TITLE,
  ];

  // Add the specific fields that should be returned
  query += "&fields=";
  fields.forEach( (field, index) => {
    query += field;
    query += index < fields.length - 1 ? "," : "";
  });

  if( import.meta.env.DEV ) {
    // Output query URL to help with debugging only in DEV mode
    console.info("Collection Query: ", query)
  }

  const response = await fetch(query, config);
  const temp = (await response.json());

  console.log(`Data Rows fetched for ${instrumentLid}`, temp.data.length);
  console.log(`Raw data fetched for ${instrumentLid}`, temp.data);

  let collectionData = [];
  collectionData = temp.data.map( (sourceData:{"summary":object, "properties":Collection}) => {
    const source = sourceData["properties"];
    const collection:Collection = {
      [PDS4_INFO_MODEL.COLLECTION.DESCRIPTION]: source[PDS4_INFO_MODEL.COLLECTION.DESCRIPTION][0],
      [PDS4_INFO_MODEL.COLLECTION.TYPE]: source[PDS4_INFO_MODEL.COLLECTION.TYPE][0],
      [PDS4_INFO_MODEL.LID]: source[PDS4_INFO_MODEL.LID][0],
      [PDS4_INFO_MODEL.REF_LID_INSTRUMENT]: source[PDS4_INFO_MODEL.REF_LID_INSTRUMENT],
      [PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST]: source[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST],
      [PDS4_INFO_MODEL.REF_LID_INVESTIGATION]: source[PDS4_INFO_MODEL.REF_LID_INVESTIGATION],
      [PDS4_INFO_MODEL.REF_LID_TARGET]: source[PDS4_INFO_MODEL.REF_LID_TARGET],
      [PDS4_INFO_MODEL.PRIMARY_RESULT_SUMMARY.PROCESSING_LEVEL]: source[PDS4_INFO_MODEL.PRIMARY_RESULT_SUMMARY.PROCESSING_LEVEL],
      [PDS4_INFO_MODEL.SCIENCE_FACETS.DISCIPLINE_NAME]: source[PDS4_INFO_MODEL.SCIENCE_FACETS.DISCIPLINE_NAME],
      [PDS4_INFO_MODEL.SOURCE_PRODUCT_EXTERNAL.DOI]: source[PDS4_INFO_MODEL.SOURCE_PRODUCT_EXTERNAL.DOI][0],
      [PDS4_INFO_MODEL.TIME_COORDINATES.START_DATE_TIME]: source[PDS4_INFO_MODEL.TIME_COORDINATES.START_DATE_TIME][0],
      [PDS4_INFO_MODEL.TIME_COORDINATES.STOP_DATE_TIME]: source[PDS4_INFO_MODEL.TIME_COORDINATES.STOP_DATE_TIME][0],
      [PDS4_INFO_MODEL.TITLE]: source[PDS4_INFO_MODEL.TITLE][0],
    }
    return collection;
  })

  return collectionData;
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
          {children}
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
  const [collections, setCollections] = useState<Collection[]>([]);
  const dispatch = useAppDispatch();
  const convertedInstrumentLid = convertLogicalIdentifier(instrumentLid !== undefined ? instrumentLid : "", LID_FORMAT.DEFAULT);

  const status = useAppSelector( (state) => { return state.dataManager.status } )

  useEffect( () => {

    if( status === 'idle' ) {
      dispatch( getData() );
    }

  });

  useEffect( () => {

    if( status === "succeeded" ) {
      const abortController = new AbortController();
      fetchBundles(convertedInstrumentLid, abortController).then( (response) => {
        setCollections(response);
      });

    }

  }, [status]);

  return (
    <>
     <ConnectedComponent instrumentLid={convertedInstrumentLid} tabLabel={tabLabel ? tabLabel : "instruments"} collections={collections} />
    </>
  );

};

const InstrumentDetailBody = (props:InstrumentDetailBodyProps) => {

  const {collections, instrument, investigation, status, tabLabel } = props;
  const [processingLevels, setProcessingLevels] = useState<string[]>([]);
  const [collectionsReady, setCollectionsReady] = useState(false);
  const [value, setValue] = useState(TABS.findIndex( (tab) => tab == tabLabel?.toLowerCase()));

  console.log("Collections", collections)

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

  useEffect( () => {
    setValue(TABS.findIndex( (tab) => tab == tabLabel?.toLowerCase()));
  }, [tabLabel]);

  useEffect( () => {

    let processingLevels:string[] = [];
    if( collections.length > 0 ) {

      processingLevels = distinct( collections.flatMap( (collection) => collection[PDS4_INFO_MODEL.PRIMARY_RESULT_SUMMARY.PROCESSING_LEVEL]) );

    }

    setProcessingLevels(processingLevels);
    setCollectionsReady(true);

  }, [collections]);

  const getFriendlyProcessingLevelTitle = (processingLevel:string) => {
    return DATA_COLLECTION_GROUP_TITLE[processingLevel.toUpperCase().replace(" ", "_") as keyof typeof DATA_COLLECTION_GROUP_TITLE];
  }

  const getInvestigationPath = (investigationLid:string) => {
    return '/investigations/' + convertLogicalIdentifier(investigationLid, LID_FORMAT.URL_FRIENDLY) + '/overview';
  }

  return (
    <>
      <DocumentMeta
        title={ instrument.title + " Instrument details" }
        description={ instrument.title + "Instrument details" }
      />
      {
        (status === 'idle' || status === 'pending' || !collectionsReady)
        &&
        <Stack direction={"column"} spacing={"40px"} alignContent={"center"} alignItems={"center"} sx={{margin: "50px"}}>
          <Loader />
          <Typography variant="h4" weight="semibold" component="span">Fetching Instrument Information</Typography>
        </Stack>
      }
      {
        status === 'succeeded' && collectionsReady
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
                      color: "#FFFFFF",
                      paddingY: "3px",
                      paddingX: "5px",
                      borderRadius: "3px",
                      width: "fit-content"
                    }}
                    separator={<Typography variant="h6" weight="regular" component="span">/</Typography>}
                  >
                    <Link color="inherit" to="/">
                      <Typography variant="h6" weight="regular" component="span" style={{ color: "white" }}>Home</Typography>
                    </Link>
                    <Link color="inherit" to="/instruments/">
                      <Typography variant="h6" weight="regular" component="span" style={{ color: "white" }}>Instruments</Typography>
                    </Link>
                    <Typography variant="h6" weight="regular" component="span">{instrument[PDS4_INFO_MODEL.TITLE]}</Typography>
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
                      <Box style={{ color: "white", marginTop: "50px" }}>
                        <Typography variant="display4" weight="bold" component={"h1"}>{instrument[PDS4_INFO_MODEL.TITLE]}</Typography>
                      </Box>
                      <Box style={{ color: "white", marginTop: "8px" }}>
                        <Typography variant="h5" weight="regular" component="span">{instrument[PDS4_INFO_MODEL.TITLE]}</Typography>
                      </Box>
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
          {/* Quick Action Bar */}
          {/* <Container
            maxWidth={false}
            disableGutters
            sx={{
              textAlign: "left",
              padding: "24px",
              backgroundColor: "#F6F6F6"
            }}
          >
            <Container
              maxWidth={"xl"}
              disableGutters
              sx={{
                paddingY: "24px",
              }}
            >
              <Grid container>
                <Grid item lg={1} display={{ xs: "none", sm: "none", lg: "block"}}>
                  &nbsp;
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
                  &nbsp;
                </Grid>
              </Grid>
            </Container>
          </Container> */}
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
                      <OldTypography sx={{
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
                      }}>Data</OldTypography>
                      {
                        processingLevels.map(processingLevel => {
                          return (
                            <AnchorLink href={"#title_" + processingLevel.toLowerCase()} sx={{
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
                                <OldTypography sx={{
                                  marginLeft: "10px",
                                  color: '#17171B',
                                  fontSize: "12px",
                                  fontFamily: 'Inter',
                                  fontWeight: '400',
                                  lineHeight: "12px",
                                  letterSpacing: "0.25px",
                                  wordWrap: 'break-word',
                                }}>{getFriendlyProcessingLevelTitle(processingLevel)}</OldTypography>
                              </Box>
                            </AnchorLink>
                          )
                        })
                      }
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={8}>
                    <Typography variant="body3" weight="regular">Raw Data is original data from an instrument. If compression, reformatting, packetization, or other translation has been applied to facilitate data transmission or storage, those processes will be reversed so that the archived data are in a PDS approved archive format. Derived Data are results that have been distilled from one or more calibrated data products (for example, maps, gravity or magnetic fields, or ring particle size distributions). Supplementary data, such as calibration tables or tables of viewing geometry, used to interpret observational data should also be classified as ‘derived’ data if not easily matched to one of the other categories.</Typography>
                    <Box style={{marginTop: "50px", display: collections.length === 0 ? "block" : "none"}} >
                      <Typography variant="h4" weight="semibold" component={"span"}>No data collections available at this time. Please check back later or contact the <Link href="mailto:pds-operator@jpl.nasa.gov" style={{color: "#1C67E3"}}>PDS Help Desk</Link> for assistance.</Typography>
                    </Box>
                    
                    <Stack sx={{marginTop: "32px"}}>
                      {
                        processingLevels.map( (processingLevel, index) => {
                          return (
                            <>
                              <OldTypography sx={{
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
                                <a id={"title_" + processingLevel.toLowerCase()}>{getFriendlyProcessingLevelTitle(processingLevel)}</a>
                              </OldTypography>
                              {
                                collections.map( (collection, index) => {
                                  return <React.Fragment key={"collection_" + index}>
                                      <FeaturedLink
                                        description={collection[PDS4_INFO_MODEL.COLLECTION.DESCRIPTION] !== "null" ? collection[PDS4_INFO_MODEL.COLLECTION.DESCRIPTION] : "No Description Provided."}
                                        title={collection[PDS4_INFO_MODEL.TITLE]}
                                        primaryLink={"https://pds.nasa.gov/ds-view/pds/viewCollection.jsp?identifier=" + encodeURIComponent(collection[PDS4_INFO_MODEL.LID])}
                                      >
                                        <FeaturedLinkDetails 
                                          doi={{value: collection[PDS4_INFO_MODEL.SOURCE_PRODUCT_EXTERNAL.DOI] !== "null" ? collection[PDS4_INFO_MODEL.SOURCE_PRODUCT_EXTERNAL.DOI] : "-", link: collection[PDS4_INFO_MODEL.SOURCE_PRODUCT_EXTERNAL.DOI] !== "null" ? `https://doi.org/${collection[PDS4_INFO_MODEL.SOURCE_PRODUCT_EXTERNAL.DOI]}` : undefined}}
                                          investigation={{value: investigation[PDS4_INFO_MODEL.TITLE], link: getInvestigationPath(investigation[PDS4_INFO_MODEL.LID])}}
                                          disciplineName={collection[PDS4_INFO_MODEL.SCIENCE_FACETS.DISCIPLINE_NAME][0] !== "null" ? collection[PDS4_INFO_MODEL.SCIENCE_FACETS.DISCIPLINE_NAME] : []}
                                          processingLevel={collection[PDS4_INFO_MODEL.PRIMARY_RESULT_SUMMARY.PROCESSING_LEVEL]}
                                          lid={{
                                              value: collection[PDS4_INFO_MODEL.LID],
                                              link: "https://pds.nasa.gov/ds-view/pds/viewCollection.jsp?identifier=" + encodeURIComponent(collection[PDS4_INFO_MODEL.LID])
                                          }}
                                          startDate={{value: collection[PDS4_INFO_MODEL.TIME_COORDINATES.START_DATE_TIME]}}
                                          stopDate={{value: collection[PDS4_INFO_MODEL.TIME_COORDINATES.STOP_DATE_TIME]}}
                                          variant={FeaturedLinkDetailsVariant.DATA_COLLECTION}
                                        />
                                      </FeaturedLink>  
                                    </React.Fragment>
                                  
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
                      <OldTypography sx={{
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
                      }}>Overview</OldTypography>
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
                                <OldTypography sx={{
                                  marginLeft: "10px",
                                  color: '#17171B',
                                  fontSize: "12px",
                                  fontFamily: 'Inter',
                                  fontWeight: '400',
                                  lineHeight: "12px",
                                  letterSpacing: "0.25px",
                                  wordWrap: 'break-word',
                                }}>{anchor.label}</OldTypography>
                              </Box>
                            </AnchorLink>
                          )
                        })
                      }
                    </Box>
                  </Grid>
                  <Grid item md={6}>
                    <a id="overview-summary">
                      <OldTypography variant="h4" sx={{
                        color: 'black',
                        fontSize: "22px",
                        fontFamily: 'Inter',
                        fontWeight: '700',
                        lineHeight: "26px",
                        wordWrap: 'break-word'
                      }}>Summary</OldTypography>
                    </a>
                    <OldTypography sx={{
                      color: 'black',
                      fontSize: "18px",
                      fontFamily: 'Public Sans',
                      fontWeight: '400',
                      lineHeight: "27px",
                      wordWrap: 'break-word'
                      }}
                      style={{ paddingBottom: "24px" }}
                    >
                      {instrument[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION]}
                    </OldTypography>
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

const mapStateToProps = (state:RootState, ownProps:{collections:Collection[], instrumentLid:string, tabLabel:string}):InstrumentDetailBodyProps => {

  let instrument:Instrument = Object();
  let investigation:Investigation = Object();
  let instrumentHost:InstrumentHost = Object();

  if( state.investigations.status === 'succeeded' ) {
    instrument = selectLatestInstrumentVersion(state, ownProps.instrumentLid);
    instrumentHost = selectLatestInstrumentHostVersion(state, instrument[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST][0]);
    investigation = selectLatestInvestigationVersion(state, instrumentHost[PDS4_INFO_MODEL.REF_LID_INVESTIGATION][0]);
  }

  return {
    collections: ownProps.collections,
    instrument: instrument,
    instrumentHost: instrumentHost,
    investigation: investigation,
    status: state.dataManager.status,
    tabLabel: ownProps.tabLabel
  }

}

const ConnectedComponent = connect(mapStateToProps)(InstrumentDetailBody);
export default InstrumentDetailPage;
