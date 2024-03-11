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
  Typography,
} from "@mui/material";
import { getInvestigations, selectFilteredInvestigations, setFreeTextSearchFilter, setInvestigationTypeSearchFilter } from "src/features/investigations/investigationsSlice";
import { useAppDispatch } from "src/hooks";
import { connect } from "react-redux";
import { RootState } from "src/store";
import { Loader } from "@nasapds/wds-react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Investigation, INVESTIGATION_TYPE } from "src/types/investigation.d";
import InvestigationsIndexedListComponent from "src/components/IndexedListComponent/InvestigationsIndexedListComponent";
import { ExpandMore } from "@mui/icons-material";

type InvestigationsDirectoryPageProps = {
  error: string | null | undefined,
  latestInvestigations: Investigation[];
  searchFilters: {
    freeText:string,
    type:INVESTIGATION_TYPE,
  };
  status: string;
};

export const InvestigationsDirectoryPage = (props:InvestigationsDirectoryPageProps) => {

  const dispatch = useAppDispatch();

  const {error, latestInvestigations, searchFilters, status} = props;
  
  useEffect(() => {
    let isMounted = true;

    // If status is 'idle', then fetch the investigations data from the API
    if (status === "idle") {
      dispatch(getInvestigations());
    }

    if (status === "pending") {
      // Do something to inform user that investigation data is being fetched
    } else if (status === "succeeded") {
      
      // Do something to handle the successful fetching of data
      //console.log("investigations.investigationItems", investigations.investigationItems)
      
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

  const handleFreeTextSearchFilterChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFreeTextSearchFilter(event.currentTarget.value))
  };

  const handleFreeTextSearchFilterReset = () => {
    dispatch(setFreeTextSearchFilter(""));
  }

  const handleInvestigationTypeFilterChange = (event:SelectChangeEvent) => {
    dispatch(setInvestigationTypeSearchFilter(event.target.value as INVESTIGATION_TYPE));
  }

  return (
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
            paddingLeft: "140px",
            paddingRight: "140px",
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
      {status == "succeeded" ? (
        <Container
          maxWidth={"xl"}
          sx={{
            paddingTop: "80px",
            paddingBottom: "25px",
            paddingLeft: "140px",
            paddingRight: "140px",
            textAlign: "left",
          }}
        >
          <Box sx={{ paddingBottom: "25px" }}>
            <Grid container spacing={4} sx={{ height: "100%" }} alignItems="center">
              <Grid item xs={2}>
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
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  placeholder="Search based on Name, Instruments, or Targets"
                  variant="outlined"
                  type="search"
                  value={searchFilters.freeText}
                  InputProps={{
                    sx: {
                      borderRadius: "2px",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchFilters.freeText && (
                      <InputAdornment position="end" onClick={handleFreeTextSearchFilterReset}
                        sx={{
                          cursor: "pointer"
                        }}
                      >
                        <CloseIcon />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                  onChange={handleFreeTextSearchFilterChange}
                />
              </Grid>
              <Grid item xs={2}>
              
                <Typography
                  sx={{
                    color: 'black',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    lineHeight: '19px',
                    wordWrap: 'break-word',
                    mb: '4px'
                  }}>Investigation Type</Typography>
                <Select
                  value={searchFilters.type}
                  onChange={handleInvestigationTypeFilterChange}
                  fullWidth
                  IconComponent={ExpandMore}
                  sx={{
                    borderRadius: '5px',
                    borderWidth: '2px',
                    borderColor: '#D1D1D1',
                    '.MuiSelect-select': {
                      py: '10px',
                      px: '16px',
                    },
                    '.MuiSelect-nativeInput': {
                      color: '#2E2E32',
                      fontSize: '14px',
                      fontFamily: 'Public Sans',
                      fontWeight: '400',
                      lineHeight: '20px',
                      wordWrap: 'break-word'
                    }
                  }}
                >
                  <MenuItem value={"ALL"}>All</MenuItem>
                  <MenuItem value={INVESTIGATION_TYPE.FIELD_CAMPAIGN}>{INVESTIGATION_TYPE.FIELD_CAMPAIGN}</MenuItem>
                  <MenuItem value={INVESTIGATION_TYPE.INDIVIDUAL_INVESTIGATION}>{INVESTIGATION_TYPE.INDIVIDUAL_INVESTIGATION}</MenuItem>
                  <MenuItem value={INVESTIGATION_TYPE.MISSION}>{INVESTIGATION_TYPE.MISSION}</MenuItem>
                  <MenuItem value={INVESTIGATION_TYPE.OBSERVING_CAMPAIGN}>{INVESTIGATION_TYPE.OBSERVING_CAMPAIGN}</MenuItem>
                  <MenuItem value={INVESTIGATION_TYPE.OTHER_INVESTIGATION}>{INVESTIGATION_TYPE.OTHER_INVESTIGATION}</MenuItem>
                </Select>
              
              </Grid>
            </Grid>
          </Box>
          <InvestigationsIndexedListComponent investigations={latestInvestigations} />
        </Container>
      ) : (
        <Box sx={{ padding: "40px" }}>
          <Loader />
        </Box>
      )}
    </Container>
  );
};

/**
 * Use mapStateToProps so that changes to our state trigger a rerender of the UI.
 */ 
const mapStateToProps = (state:RootState) => {
  return { 
    error: state.investigations.error,
    latestInvestigations: selectFilteredInvestigations(state.investigations),
    searchFilters: state.investigations.searchFilters,
    status: state.investigations.status,
  }
};

export default connect(mapStateToProps)(InvestigationsDirectoryPage);