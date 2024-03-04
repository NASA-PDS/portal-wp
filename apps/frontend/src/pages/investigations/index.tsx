import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
//import { FeaturedLinkListItem } from "@nasapds/wds-react";
import { FeaturedInvestigationLinkListItem } from "src/components/FeaturedListItems/FeaturedInvestigationLinkListItem";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { getInvestigations } from "src/features/investigations/investigationsSlice";
import { Investigation } from "src/types/investigation.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { Loader } from "@nasapds/wds-react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const InvestigationsDirectoryPage = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const investigations = useAppSelector((state) => state.investigations);

  const [filteredInvestigations, setFilteredInvestigations] = useState(investigations.investigationItems);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    let isMounted = true;

    // If status is 'idle', then fetch the investigations data from the API
    if (investigations.status === "idle") {
      dispatch(getInvestigations());
    }

    if (investigations.status === "pending") {
      // Do something to inform user that investigation data is being fetched
    } else if (investigations.status === "succeeded") {
      // Do something to handle the successful fetching of data
      setFilteredInvestigations(investigations.investigationItems)
    } else if (
      investigations.error != null ||
      investigations.error != undefined
    ) {
      // Do something to handle the error
      console.log(investigations.error);
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [investigations.status, dispatch]);

  const linkStyles = {
    color: "white",
    fontFamily: "Inter",
    fontSize: "14px",
    fontWeight: "300",
    lineHeight: "19px",
    paddingY: "4px",
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const getItemsByIndex = (
    arr: Investigation[],
    index: string
  ): Investigation[] => {
    return arr.filter((item) => {
      return item[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE]
        .toUpperCase()
        .startsWith(index.toUpperCase());
    });
  };

  const investigationListItemPrimaryAction = (lid:string) => {
    navigate("/investigations/" + encodeURIComponent(lid));
  };

  const onInvestigationsFilterChange = (event:React.ChangeEvent<HTMLInputElement>) => {

    setFilterText(event.currentTarget.value);

    if( event.currentTarget.value !== "" ) {
      setFilteredInvestigations(
        filteredInvestigations.filter(
          (item) => { 
            return item[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase().includes(event.currentTarget.value)
            /*|| item[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION].toLowerCase().includes(event.target.value)*/
          }
        )
      )
    } else {
      setFilteredInvestigations(investigations.investigationItems);
    }
  };

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
      {investigations.status == "succeeded" ? (
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
                  value={filterText}
                  InputProps={{
                    sx: {
                      borderRadius: "2px",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: filterText && (
                      <InputAdornment position="end" onClick={ () => { setFilteredInvestigations(investigations.investigationItems); setFilterText("")}}
                        sx={{
                          cursor: "pointer"
                        }}
                      >
                        <CloseIcon />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                  onChange={onInvestigationsFilterChange}
                />
              </Grid>
            </Grid>
          </Box>
          <Box>
            {investigations.investigationItems.length > 0 &&
              alphabet.map((letter) => {

                const indexedInvestigations = getItemsByIndex(filteredInvestigations, letter);
                const indexedInvestigationsCount = Object.keys(indexedInvestigations).length;
                const anchorName = indexedInvestigationsCount > 0 ? "#" + letter : undefined;
                const anchorColor = indexedInvestigationsCount > 0 ? "#1976d2" : "#959599";

                return indexedInvestigationsCount >= 0 ? (
                  <Link
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "29px",
                      fontWeight: "700",
                      lineHeight: "29px",
                      paddingRight: "10px",
                      color: anchorColor,
                    }}
                    href={anchorName}
                    key={"letter_" + letter}
                    underline="none"
                  >
                    {letter}
                  </Link>
                ) : (
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "29px",
                      fontWeight: "700",
                      lineHeight: "29px",
                      paddingRight: "10px",
                    }}
                  >
                    {letter}
                  </Typography>
                );
              })}
          </Box>
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
                    Investigation Name
                  </Typography>
                </Grid>
                <Grid item xs={2}>
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
                    Investigation Type
                  </Typography>
                </Grid>
                <Grid item xs={2}>
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
                    Affiliated Spacecraft
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box>
              {investigations.investigationItems.length > 0 &&
                alphabet.map((letter) => {

                  const indexedInvestigations = getItemsByIndex(filteredInvestigations, letter);
                  const indexedInvestigationsCount = Object.keys(indexedInvestigations).length;

                  return (
                    <React.Fragment key={"investigations_" + letter}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "Inter",
                          fontSize: "29px",
                          fontWeight: "700",
                          lineHeight: "29px",
                          paddingRight: "10px",
                          paddingTop: "15px",
                          color: indexedInvestigationsCount
                            ? "#000000"
                            : "#959599",
                        }}
                      >
                        <a id={letter}>{letter}</a>
                      </Typography>
                      <br />
                      {indexedInvestigations.map(
                        (investigation: Investigation) => {
                          return (
                            <FeaturedInvestigationLinkListItem
                              affiliated_spacecraft={
                                investigation[
                                  PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE
                                ]
                              }
                              description={
                                investigation[
                                  PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION
                                ]
                              }
                              investigation_type={
                                investigation[
                                  PDS4_INFO_MODEL.INVESTIGATION.TYPE
                                ]
                              }
                              primaryAction={() => investigationListItemPrimaryAction(investigation.lid) }
                              key={investigation[PDS4_INFO_MODEL.LID]}
                              lid={investigation[PDS4_INFO_MODEL.LID]}
                              title={
                                investigation[
                                  PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE
                                ]
                              }
                            />
                          );
                        }
                      )}
                    </React.Fragment>
                  );
                })}
            </Box>
          </Container>
        </Container>
      ) : (
        <Box sx={{ padding: "40px" }}>
          <Loader />
        </Box>
      )}
    </Container>
  );
};

export default InvestigationsDirectoryPage;