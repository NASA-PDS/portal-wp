import React, { useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import {
  InstrumentDirectorySearchFilterState,
  setFreeTextSearchFilter,
  setInstrumentTypeSearchFilter
} from "src/state/slices/instrumentsSlice";
import { selectFilteredInstruments } from "src/state/selectors";
import { getData, dataRequiresFetchOrUpdate, dataReady } from "src/state/slices/dataManagerSlice";
import { useAppDispatch, useAppSelector } from "src/state/hooks";
import { connect } from "react-redux";
import { RootState } from "src/state/store";
import { Loader, Typography } from "@nasapds/wds-react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
//import CloseIcon from "@mui/icons-material/Close";
import { Instrument, INSTRUMENT_TYPE } from "src/types/instrument";
import InstrumentsIndexedListComponent from "src/components/IndexedListComponent/InstrumentsIndexedListComponent";
import { ExpandMore } from "@mui/icons-material";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { useDebouncedCallback } from "use-debounce";
import { Link } from "react-router-dom";

type InstrumentsDirectoryPageComponentProps = {
  dataFetched: boolean;
  error: string | null | undefined,
  latestInstruments: Instrument[];
  searchFilters: InstrumentDirectorySearchFilterState | undefined;
  status: string;
};

export const InstrumentsDirectoryPageComponent = (props:InstrumentsDirectoryPageComponentProps) => {

  const dispatch = useAppDispatch();

  const {dataFetched, error, latestInstruments, searchFilters, status} = props;
  const dataManagerState = useAppSelector( (state) => { return state.dataManager } );

  useEffect(() => {

    // Check if data manager status is 'idle', then fetch the instruments data from the API
    if( dataRequiresFetchOrUpdate(dataManagerState) ) {
      dispatch(getData());
    }

    if (status === "pending") {
      // Do something to inform user that instrument data is being fetched
    } else if (status === "succeeded") {
      // Do something to handle the successful fetching of data
    } else if ( error != null || error != undefined ) {
      // Do something to handle the error
      console.log(error);
    }

    // Cleanup function
    return () => {};

  }, []);

  const linkStyles = {
    color: "white",
    fontFamily: "Inter",
    fontSize: "14px",
    fontWeight: "300",
    lineHeight: "19px",
    paddingY: "4px",
  };

  const debouncedFreeTextFilter = useDebouncedCallback(
    // function
    (value:string) => {
      dispatch(setFreeTextSearchFilter(value))
    },
    // delay in ms
    250
  );

  const handleFreeTextSearchFilterChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    debouncedFreeTextFilter(event.target.value);
  };

  /* const handleFreeTextSearchFilterReset = () => {
    dispatch(setFreeTextSearchFilter(""));
  } */

  const handleInstrumentTypeFilterChange = (event:SelectChangeEvent) => {
    console.log("handleInstrumentTypeFilterChange event:", event);
    dispatch(setInstrumentTypeSearchFilter(event.target.value as INSTRUMENT_TYPE));
  }
 
  return (
    <>
      <DocumentMeta
        title={ "Instruments Directory" }
        description={ "Planetary Data Systems Instruments Directory." }
      />
      <Container maxWidth={false} disableGutters>
        {/* Page Intro */}
        <Container
          maxWidth={false}
          sx={{
            backgroundImage: "url(/assets/images/headers/instruments.png)",
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
              <Link to="/" style={linkStyles}>
                Home
              </Link>
              <Typography variant="h6" weight="regular" component={"span"} style={{ color: "white" }}>Instruments</Typography>
            </Breadcrumbs>
            <Box style={{ color: "white", padding: "50px 0px 0px 0px" }}>
              <Typography variant="display4" weight="bold" component={"h1"}>Instruments</Typography>
            </Box>
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
              <Grid container spacing={4} sx={{ height: "100%" }} alignItems="flex-start" direction="row">
                <Grid item md={1} />
                <Grid item xs={12} md={7}>
                  <Stack direction={"column"} spacing={"4px"}>
                    <Typography variant="h6" weight="semibold" sx={{ color: "#17171B" }} component="span">
                      Search for Instruments
                    </Typography>
                    <TextField
                      id="freeTextSearchFilterTextField"
                      placeholder="Search based on Name, Investigation, or Targets"
                      variant="outlined"
                      type="search"
                      InputProps={{
                        sx: {
                          borderRadius: "2px",
                        },
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                        /* endAdornment: searchFilters?.freeText && (
                          <InputAdornment
                            position="end"
                            onClick={handleFreeTextSearchFilterReset}
                            sx={{
                              cursor: "pointer"
                            }}
                          >
                            <CloseIcon />
                          </InputAdornment>
                        ), */
                      }}
                      fullWidth
                      onChange={handleFreeTextSearchFilterChange}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Stack direction={"column"} spacing={"4px"}>
                    <Typography variant="h6" weight="semibold" sx={{ color: "#17171B" }} component={"span"}>
                      Instrument Type
                    </Typography>
                    <Select
                      value={searchFilters?.type || INSTRUMENT_TYPE.ALL}
                      onChange={handleInstrumentTypeFilterChange}
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
                      {
                        Object.entries(INSTRUMENT_TYPE).map( (entry, index) => {
                          return <MenuItem value={entry[1]} key={index}>{entry[1]}</MenuItem>
                        })
                      }
                    </Select>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            {
              latestInstruments.length > 0 ? (
                <InstrumentsIndexedListComponent instruments={latestInstruments} />
              ) : (
                <>
                  {searchFilters === undefined ? (
                    <Box sx={{ paddingBottom: "25px", textAlign: "center" }}>
                      <Typography variant="body2" weight="regular">
                        No instruments found.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ paddingBottom: "25px", textAlign: "center" }}>
                      <Typography variant="body2" weight="regular">
                        No instruments found based on the provided search filters.
                      </Typography>
                    </Box>
                  )}
                </>
              )
            }
          </Container>
        ) : (
          <Stack direction={"column"} spacing={"40px"} alignContent={"center"} alignItems={"center"} sx={{margin: "50px"}}>
            <Loader />
            <Typography variant="h4" weight="semibold" component="span">Fetching Instrument Information</Typography>
          </Stack>
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
    error: state.instruments.error,
    latestInstruments: selectFilteredInstruments(state),
    searchFilters: state.instruments.searchFilters,
    status: state.dataManager.status,
  }
};

const InstrumentsDirectoryPage = connect(mapStateToProps)(InstrumentsDirectoryPageComponent);
export default InstrumentsDirectoryPage