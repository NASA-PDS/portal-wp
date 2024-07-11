import React, { useEffect, useState } from "react";
import {Box, Container, Divider, Grid, Link, MenuItem, Select, Typography } from "@mui/material";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { Investigation } from "src/types/investigation.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import FeaturedInvestigationLinkListItem from "src/components/FeaturedListItems/FeaturedInvestigationLinkListItem";
import { selectLatestInstrumentHostsForInvestigation } from "src/state/selectors/instrumentHost";
import { RootState, store } from "src/state/store";
import { InstrumentHost } from "src/types/instrumentHost";
import { convertLogicalIdentifier, LID_FORMAT } from "src/utils/strings";
import { ExpandMore } from "@mui/icons-material";

type InvestigationsIndexedListComponentProps = {
  investigations: Investigation[];
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const OTHER_CHARS = "0123456789".split("");

type InvestigationDetailPathParams = {
  lid:string;
  version:string;
}

const getItemsByIndex = (
  arr: Investigation[],
  index: string
): Investigation[] => {
  return arr.filter((item) => {
    return item[PDS4_INFO_MODEL.TITLE]
      .toUpperCase()
      .startsWith(index.toUpperCase());
  });
};

function getAffiliatedSpacecraft(state:RootState, investigation:Investigation) {
  return selectLatestInstrumentHostsForInvestigation(state, investigation[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST])?.reduce(
    (accumulator, item:InstrumentHost) => { return accumulator === "" ? accumulator += item[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME] : accumulator += ", ".concat(item[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME]) }, ''
  )
}

function InvestigationsIndexedListComponent(props:InvestigationsIndexedListComponentProps) {

  const investigations = props.investigations;
  const navigate = useNavigate();
  const location = useLocation();
  const state = store.getState();

  const [indexValue, setIndexValue] = useState(location.hash.replace("#",""));

  const investigationListItemPrimaryAction = (params:InvestigationDetailPathParams) => {
    params.lid = convertLogicalIdentifier(params.lid,LID_FORMAT.URL_FRIENDLY);
    navigate( generatePath("/investigations/:lid/:version/instruments", params) );
  };

  const scrollToIndex = (id:string) => {
    console.log("Set scroll to: ", id)
    setIndexValue(id);
  }

  useEffect( () => {

    if( indexValue !== "" ) {
      // Using setTimeout due to a weird issue in the browser that doesn't scroll to the element without setTimeout
      // Reference: https://stackoverflow.com/questions/64508413/scrollintoview-works-only-once-when-followed-by-console-log
      setTimeout(() => {
        console.log("Scrolling to:", indexValue)
        navigate("#" + indexValue),
        5
      });
    }

  }, [indexValue, navigate]);

  return (
    <>
      <Box sx={{textAlign:"center"}} display={{ xs: "none", md: "block"}}>
        {
          (
            investigations.some((investigation) => {
              return "0123456789".includes(investigation[PDS4_INFO_MODEL.TITLE].substring(0,1))
            }) && (
              <Link
                sx={{
                  fontFamily: "Inter",
                  fontSize: "29px",
                  fontWeight: "700",
                  lineHeight: "29px",
                  paddingRight: "10px",
                  color: "#1976d2",
                }}
                href={"#hash"}
                key={"letter_hash"}
                underline="none"
              >
                #
              </Link>
            )
          ) || (
            investigations.some((investigation) => {
              return !"0123456789".includes(investigation[PDS4_INFO_MODEL.TITLE].substring(0,1))
            }) && (
              <Link
                sx={{
                  fontFamily: "Inter",
                  fontSize: "29px",
                  fontWeight: "700",
                  lineHeight: "29px",
                  paddingRight: "10px",
                  color: "#959599",
                }}
                href={"#hash"}
                key={"letter_hash"}
                underline="none"
              >
                #
              </Link>
            )
          )
        }
        {investigations.length > 0 &&
          ALPHABET.map((letter) => {

            const indexedInvestigations = getItemsByIndex(investigations, letter);
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
      <Box display={{ xs:"block", md:"none"}}>
        <Divider sx={{marginBottom:"16px"}}/>
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
          Scroll to
        </Typography>
        <Select
          value={indexValue}
          onChange={(event) => { event.preventDefault(); scrollToIndex(event.target.value); }}
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
          <MenuItem value={indexValue}>
            Select an index
          </MenuItem>
          {
            (
              investigations.some((investigation) => {
                return "0123456789".includes(investigation[PDS4_INFO_MODEL.TITLE].substring(0,1))
              }) && (
                <MenuItem value={"hash"}>
                  {"#"}
                </MenuItem>
              )
            ) || (
              investigations.some((investigation) => {
                return !"0123456789".includes(investigation[PDS4_INFO_MODEL.TITLE].substring(0,1))
              }) && (
                <MenuItem value={"hash"} disabled={true}>
                  {"#"}
                </MenuItem>
              )
            )
          }
          {
            investigations.length > 0 && ALPHABET.map((letter) => {
  
              const indexedInvestigations = getItemsByIndex(investigations, letter);
              const indexedInvestigationsCount = Object.keys(indexedInvestigations).length;
              const anchorName = indexedInvestigationsCount > 0 ? "#" + letter : undefined;
  
              return (
                <MenuItem value={letter} disabled={indexedInvestigationsCount === 0}>
                  {letter}
                </MenuItem>
              )
            }) 
          }
        </Select>
      </Box>
      <Container
        maxWidth={"xl"}
        sx={{
          paddingTop: "48px",
          textAlign: "left",
        }}
      >
        <Box display={{xs: "none", md: "flex"}}>
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
            <Grid item xs={2}>
              <Typography
                variant="body1"
                display="block"
                color="#58585B"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Type
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
                  textAlign: "center",
                }}
              >
                Spacecraft
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box>
          {investigations.length > 0 &&
            OTHER_CHARS.map((character, index) => {

              const indexedInvestigations = getItemsByIndex(investigations, character);
              const indexedInvestigationsCount = Object.keys(indexedInvestigations).length;

              return (
                <React.Fragment key={"investigations_hash" + index}>
                  { indexedInvestigationsCount > 0 ? 
                    <>
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
                        <a id={"hash"}>#</a>
                      </Typography>
                      <br />
                    </> : <></>
                  }
                  {indexedInvestigations.map(
                    (investigation: Investigation) => {
                      return (
                        <FeaturedInvestigationLinkListItem
                          affiliated_spacecraft={ getAffiliatedSpacecraft(state, investigation)}
                          description={ investigation[PDS4_INFO_MODEL.INVESTIGATION.TERSE_DESCRIPTION] ? investigation[PDS4_INFO_MODEL.INVESTIGATION.TERSE_DESCRIPTION] : investigation[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION] }
                          investigation_type={ investigation[PDS4_INFO_MODEL.INVESTIGATION.TYPE] }
                          primaryAction={ () => investigationListItemPrimaryAction({ lid: investigation.lid, version: investigation.vid }) }
                          key={investigation[PDS4_INFO_MODEL.LID]}
                          title={ investigation[PDS4_INFO_MODEL.TITLE] }
                        />
                      );
                    }
                  )}
                </React.Fragment>
              );
            })}
          {investigations.length > 0 &&
            ALPHABET.map((letter) => {

              const indexedInvestigations = getItemsByIndex(investigations, letter);
              const indexedInvestigationsCount = Object.keys(indexedInvestigations).length;

              return (
                <React.Fragment key={"investigations_" + letter}>
                  { indexedInvestigationsCount > 0 ? 
                    <>
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
                    </> : <></>
                  }
                  {indexedInvestigations.map(
                    (investigation: Investigation) => {
                      return (
                        <FeaturedInvestigationLinkListItem
                          affiliated_spacecraft={ getAffiliatedSpacecraft(state, investigation)}
                          description={ investigation[PDS4_INFO_MODEL.INVESTIGATION.TERSE_DESCRIPTION] ? investigation[PDS4_INFO_MODEL.INVESTIGATION.TERSE_DESCRIPTION].substring(0,256) : investigation[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION].substring(0,256) }
                          investigation_type={ investigation[PDS4_INFO_MODEL.INVESTIGATION.TYPE] }
                          primaryAction={ () => investigationListItemPrimaryAction({ lid: investigation.lid, version: investigation.vid }) }
                          key={investigation[PDS4_INFO_MODEL.LID]}
                          title={ investigation[PDS4_INFO_MODEL.TITLE] }
                        />
                      );
                    }
                  )}
                </React.Fragment>
              );
            })}
        </Box>
      </Container>
    </>
  );
}

export default InvestigationsIndexedListComponent;