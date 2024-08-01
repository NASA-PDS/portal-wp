import React, { useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  InputAdornment,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import {
  InvestigationDirectorySearchFilterState,
  setFreeTextSearchFilter,
  setInvestigationTypeSearchFilter
} from "src/state/slices/investigationsSlice";
import { selectFilteredInvestigations } from "src/state/selectors/investigations";
import { getData, dataRequiresFetchOrUpdate, dataReady } from "src/state/slices/dataManagerSlice";
import { useAppDispatch, useAppSelector } from "src/state/hooks";
import { connect } from "react-redux";
import { RootState } from "src/state/store";
import { Loader } from "@nasapds/wds-react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Investigation, INVESTIGATION_TYPE } from "src/types/investigation.d";
import InvestigationsIndexedListComponent from "src/components/IndexedListComponent/InvestigationsIndexedListComponent";
import { ExpandMore } from "@mui/icons-material";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";

type InvestigationsDirectoryPageComponentProps = {
  dataFetched: boolean;
  error: string | null | undefined,
  latestInvestigations: Investigation[];
  searchFilters: InvestigationDirectorySearchFilterState | undefined;
  status: string;
};

export const InvestigationsDirectoryPageComponent = (props:InvestigationsDirectoryPageComponentProps) => {

  const dispatch = useAppDispatch();

  const {dataFetched, error, latestInvestigations, searchFilters, status} = props;
  const dataManagerState = useAppSelector( (state) => { return state.dataManager } );

  useEffect(() => {

    // Check if data manager status is 'idle', then fetch the investigations data from the API
    if( dataRequiresFetchOrUpdate(dataManagerState) ) {
      dispatch(getData());
    }

    if (status === "pending") {
      // Do something to inform user that investigation data is being fetched
    } else if (status === "succeeded") {
      // Do something to handle the successful fetching of data
    } else if ( error != null || error != undefined ) {
      // Do something to handle the error
      console.log(error);
    }

    // Cleanup function
    return () => {};

  }, [status, dispatch, dataManagerState, error]);

  const linkStyles = {
    color: "white",
    fontFamily: "Inter",
    fontSize: "14px",
    fontWeight: "300",
    lineHeight: "19px",
    paddingY: "4px",
  };

  const handleFreeTextSearchFilterChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFreeTextSearchFilter(event.target.value))
  };

  const handleFreeTextSearchFilterReset = () => {
    dispatch(setFreeTextSearchFilter(""));
  }

  const handleInvestigationTypeFilterChange = (event:SelectChangeEvent) => {
    dispatch(setInvestigationTypeSearchFilter(event.target.value as INVESTIGATION_TYPE));
  }

  return (
    <>
      <DocumentMeta
        title={ "Investigations Directory" }
        description={ "Planetary Data Systems Investigations directory page." }
      />
      <Container maxWidth={false} disableGutters>
        {/* Page Intro */}
        <Container
          maxWidth={false}
          sx={{
            backgroundImage: "url(/assets/images/headers/investigations.png)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundColor: "white",
            height: "201px",
            textAlign: "left",
            padding: 0,
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
            >
              <Link underline="hover" color="inherit" href="/" style={linkStyles}>
                Home
              </Link>
              <Typography style={{ color: "white" }}>Investigations</Typography>
            </Breadcrumbs>
            <Typography
              variant="h1"
              style={{
                color: "white",
                padding: "0px",
                paddingTop: "30px",
                fontSize: "72px",
                fontWeight: "700",
              }}
            >
              Investigations
            </Typography>
          </Container>
        </Container>
        {/* Main Content */}
        { dataFetched ? (
          <Container
            maxWidth={"xl"}
            sx={{
              paddingTop: { xs: "0px", md: "80px" },
              paddingBottom: "25px",
              textAlign: "left",
            }}
          >
            <Box sx={{ paddingBottom: "25px" }}>
              <Grid container spacing={4} sx={{ height: "100%" }} alignItems="center" direction="row">
                <Grid item md={1} />
                <Grid item xs={12} md={7}>
                  <Stack direction={"column"} spacing={0.5}>
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#17171B",
                      }}
                    >
                      Search for Investigations
                    </Typography>
                    <TextField
                      id="outlined-basic"
                      placeholder="Search based on Name, Instruments, or Targets"
                      variant="outlined"
                      type="search"
                      value={searchFilters?.freeText || ""}
                      InputProps={{
                        sx: {
                          borderRadius: "2px",
                        },
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                        endAdornment: searchFilters?.freeText && (
                          <InputAdornment
                            position="end"
                            onClick={handleFreeTextSearchFilterReset}
                            sx={{
                              cursor: "pointer"
                            }}
                          >
                            <CloseIcon />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      onChange={handleFreeTextSearchFilterChange}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography
                    sx={{
                      color: "black",
                      fontSize: "14px",
                      fontFamily: "Inter",
                      fontWeight: "600",
                      lineHeight: "19px",
                      wordWrap: "break-word",
                      mb: "4px"
                    }}
                  >
                    Investigation Type
                  </Typography>
                  <Select
                    value={searchFilters?.type || INVESTIGATION_TYPE.ALL}
                    onChange={handleInvestigationTypeFilterChange}
                    fullWidth
                    IconComponent={ExpandMore}
                    sx={{
                      borderRadius: "5px",
                      borderWidth: "2px",
                      borderColor: "#D1D1D1",
                      ".MuiSelect-select": {
                        py: "10px",
                        px: "16px",
                      },
                      ".MuiSelect-nativeInput": {
                        color: "#2E2E32",
                        fontSize: "14px",
                        fontFamily: "Public Sans",
                        fontWeight: "400",
                        lineHeight: "20px",
                        wordWrap: "break-word",
                      },
                    }}
                  >
                    <MenuItem value={"ALL"}>All</MenuItem>
                    <MenuItem value={INVESTIGATION_TYPE.FIELD_CAMPAIGN}>
                      {INVESTIGATION_TYPE.FIELD_CAMPAIGN}
                    </MenuItem>
                    <MenuItem value={INVESTIGATION_TYPE.INDIVIDUAL_INVESTIGATION}>
                      {INVESTIGATION_TYPE.INDIVIDUAL_INVESTIGATION}
                    </MenuItem>
                    <MenuItem value={INVESTIGATION_TYPE.MISSION}>
                      {INVESTIGATION_TYPE.MISSION}
                    </MenuItem>
                    <MenuItem value={INVESTIGATION_TYPE.OBSERVING_CAMPAIGN}>
                      {INVESTIGATION_TYPE.OBSERVING_CAMPAIGN}
                    </MenuItem>
                    <MenuItem value={INVESTIGATION_TYPE.OTHER_INVESTIGATION}>
                      {INVESTIGATION_TYPE.OTHER_INVESTIGATION}
                    </MenuItem>
                  </Select>
                </Grid>
                {/*<Grid item xs={2} md={1}>
                  <Typography
                    sx={{
                      color: 'black',
                      fontSize: '14px',
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      lineHeight: '19px',
                      wordWrap: 'break-word',
                      mb: '4px'
                    }}>View</Typography>
                  </Grid>*/}
              </Grid>
            </Box>
            {latestInvestigations.length > 0 ? (
              <InvestigationsIndexedListComponent
                investigations={latestInvestigations}
              />
            ) : (
              <>
                {searchFilters === undefined ? (
                  <Box sx={{ paddingBottom: "25px", textAlign: "center" }}>
                    <Typography>No investigations found.</Typography>
                  </Box>
                ) : (
                  <Box sx={{ paddingBottom: "25px", textAlign: "center" }}>
                    <Typography>
                      No investigations found based on the provided search filters.
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Container>
        ) : (
          <Box sx={{ padding: "40px" }}>
            <Loader />
          </Box>
        )}
      </Container>
    </>
  );
};

/**
 * Use mapStateToProps so that changes to our state trigger a rerender of the UI.
 */ 
const mapStateToProps = (state:RootState) => {
  return { 
    dataFetched: dataReady(state),
    error: state.investigations.error,
    latestInvestigations: selectFilteredInvestigations(state),
    searchFilters: state.investigations.searchFilters,
    status: state.dataManager.status,
  }
};

const InvestigationsDirectoryPage = connect(mapStateToProps)(InvestigationsDirectoryPageComponent);
export default InvestigationsDirectoryPage