import React from "react";
import {Box, Container, Grid, Link, Typography } from "@mui/material";
import { generatePath, useNavigate } from "react-router-dom";
import { Investigation } from "src/types/investigation.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import FeaturedInvestigationLinkListItem from "src/components/FeaturedListItems/FeaturedInvestigationLinkListItem";
import { selectLatestInstrumentHostsForInvestigation } from "src/state/selectors/instrumentHost";
import { RootState, store } from "src/state/store";
import { InstrumentHost } from "src/types/instrumentHost.d";

type InvestigationsIndexedListComponentProps = {
  investigations: Investigation[];
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type InvestigationDetailPathParams = {
  lid:string;
  version:string;
}

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

function getAffiliatedSpacecraft(state:RootState, investigation:Investigation) {
  return selectLatestInstrumentHostsForInvestigation(state, investigation[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST])?.reduce(
    (accumulator, item:InstrumentHost) => { return accumulator === "" ? accumulator += item[PDS4_INFO_MODEL.TITLE] : accumulator += ", ".concat(item[PDS4_INFO_MODEL.TITLE]) }, ''
  )
}

function InvestigationsIndexedListComponent(props:InvestigationsIndexedListComponentProps) {

  const investigations = props.investigations;
  const navigate = useNavigate();
  const state = store.getState();

  const investigationListItemPrimaryAction = (params:InvestigationDetailPathParams) => {
    navigate( generatePath("/investigations/:lid/:version/instruments", params) );
  };

  return (
    <>
      <Box sx={{textAlign:"center"}}>
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
                          /*affiliated_spacecraft={ investigation[PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE]?.join(",") }*/
                          affiliated_spacecraft={ getAffiliatedSpacecraft(state, investigation)}
                          description={ investigation[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION] }
                          investigation_type={ investigation[PDS4_INFO_MODEL.INVESTIGATION.TYPE] }
                          primaryAction={ () => investigationListItemPrimaryAction({ lid: investigation.lid, version: investigation.vid }) }
                          key={investigation[PDS4_INFO_MODEL.LID]}
                          title={ investigation[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE] }
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