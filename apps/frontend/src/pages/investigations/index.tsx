import React, { useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import { useAppDispatch } from "src/hooks";
import { getInvestigations, selectFilteredInvestigations, setSearchFilter } from "src/features/investigations/investigationsSlice";
import { Loader } from "@nasapds/wds-react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import InvestigationsIndexedListComponent from "src/components/IndexedListComponent/InvestigationsIndexedListComponent";
import { connect } from "react-redux";
import { RootState } from "src/store";
import { Investigation } from "src/types/investigation.d";

type InvestigationsDirectoryPageProps = {
  error: string | null | undefined,
  latestInvestigations: Investigation[];
  searchFilter: string;
  status: string;
};

export const InvestigationsDirectoryPage = (props:InvestigationsDirectoryPageProps) => {

  const dispatch = useAppDispatch();

  const {error, latestInvestigations, searchFilter, status} = props;
  
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

  const handleFilterChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(event.currentTarget.value))
  };

  const handleFilterReset = () => {
    dispatch(setSearchFilter(""));
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
            textAlign: "center",
          }}
        >
          <Box sx={{ paddingBottom: "25px" }}>
            <Grid container sx={{ height: "100%" }} alignItems="center">
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
                  value={searchFilter}
                  InputProps={{
                    sx: {
                      borderRadius: "2px",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchFilter && (
                      <InputAdornment position="end" onClick={ () => { handleFilterReset()}}
                        sx={{
                          cursor: "pointer"
                        }}
                      >
                        <CloseIcon />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                  onChange={ (event) => { handleFilterChange(event) } }
                />
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

const mapStateToProps = (state:RootState) => {
  return { 
    error: state.investigations.error,
    latestInvestigations: selectFilteredInvestigations(state.investigations),
    searchFilter: state.investigations.searchFilter,
    status: state.investigations.status,
  }
};

export default connect(mapStateToProps)(InvestigationsDirectoryPage);