import React from "react";
import {Box, Container, Grid, Link, Typography } from "@mui/material";
import { generatePath, useNavigate } from "react-router-dom";
import { Investigation } from "src/types/investigation.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import FeaturedInvestigationLinkListItem from "src/components/FeaturedListItems/FeaturedInvestigationLinkListItem";

type InvestigationsIndexedListComponentProps = {
  /** Style to use when rendering */
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

function InvestigationsIndexedListComponent(props:InvestigationsIndexedListComponentProps) {

  const investigations = props.investigations;
  const navigate = useNavigate();

  const investigationListItemPrimaryAction = (params:InvestigationDetailPathParams) => {
    navigate( generatePath("/investigations/:lid/:version", params) );
  };

  return (
    <>
      <Box>
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
          {investigations.length > 0 &&
            ALPHABET.map((letter) => {

              const indexedInvestigations = getItemsByIndex(investigations, letter);
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
                          affiliated_spacecraft={ investigation[PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE]?.join(",") }
                          description={ investigation[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION] }
                          investigation_type={ investigation[PDS4_INFO_MODEL.INVESTIGATION.TYPE] }
                          primaryAction={ () => investigationListItemPrimaryAction({ lid: investigation.lid, version: investigation.vid }) }
                          key={investigation[PDS4_INFO_MODEL.LID]}
                          lid={investigation[PDS4_INFO_MODEL.LID]}
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