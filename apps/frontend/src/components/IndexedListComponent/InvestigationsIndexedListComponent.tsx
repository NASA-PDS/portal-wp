import React, { useEffect, useState } from "react";
import {Box, Container, Divider, Link, MenuItem, Select } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { useLocation, useNavigate } from "react-router-dom";
import { Investigation } from "src/types/investigation";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { selectLatestInstrumentHostsForInvestigation } from "src/state/selectors";
import { RootState, store } from "src/state/store";
import { ExpandMore } from "@mui/icons-material";
import { FeaturedLink, FeaturedLinkDetails, FeaturedLinkDetailsVariant, Typography } from "@nasapds/wds-react";
import { sortInstrumentHostsByTitle } from "src/utils/arrays";
import { getLinkToInvestigationDetailPage } from "src/utils/links";

type InvestigationsIndexedListComponentProps = {
  investigations: Investigation[];
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const OTHER_CHARS = "0123456789".split("");

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
  const instrumentHostTitles = selectLatestInstrumentHostsForInvestigation(state, investigation[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST])?.sort(sortInstrumentHostsByTitle)?.map(
    (instrumentHost) => instrumentHost[PDS4_INFO_MODEL.TITLE]
  )
  return instrumentHostTitles;
}

function InvestigationsIndexedListComponent(props:InvestigationsIndexedListComponentProps) {

  const investigations = props.investigations;
  const navigate = useNavigate();
  const location = useLocation();
  const state = store.getState();

  const [indexValue, setIndexValue] = useState(location.hash.replace("#",""));

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
          investigations.length > 0 && ALPHABET.map((letter) => {

            const indexedInvestigations = getItemsByIndex(investigations, letter);
            const indexedInvestigationsCount = Object.keys(indexedInvestigations).length;
            const anchorName = indexedInvestigationsCount > 0 ? "#" + letter : undefined;
            const anchorColor = indexedInvestigationsCount > 0 ? "#1976d2" : "#959599";

            return indexedInvestigationsCount >= 0 ? (
              <Link
                sx={{
                  color: anchorColor,
                }}
                href={anchorName}
                key={"letter_" + letter}
                underline="none"
              >
                <Typography variant="h2" weight="bold" component={"span"}
                  style={{
                    paddingRight: "10px",
                  }}
                >
                {letter}
                </Typography>
              </Link>
            ) : (
              <Typography variant="h2" weight="bold" component={"span"}
                style={{
                  paddingRight: "10px",
                }}
                key={"letter_" + letter}
              >
                {letter}
              </Typography>
            );
          })
        }
      </Box>
      <Box display={{ xs:"block", md:"none"}}>
        <Divider sx={{marginBottom:"16px"}}/>
        <Typography variant="h6" weight="semibold" sx={{ color: "#17171B" }} component="span">
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
            investigations.length > 0 && ALPHABET.map((letter) => {
  
              const indexedInvestigations = getItemsByIndex(investigations, letter);
              const indexedInvestigationsCount = Object.keys(indexedInvestigations).length;

              return (
                <MenuItem value={letter} disabled={indexedInvestigationsCount === 0} key={"menu_letter_" + letter}>
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
        <Grid container spacing={2} display={{xs: "none", md:"flex"}}>
          <Grid xs>
            <Typography variant="h5" weight="semibold">Name</Typography>
          </Grid>
          <Grid lgOffset={1} />
          <Grid xs={1} display={"flex"} justifyContent={"center"}>
            <Typography variant="h5" weight="semibold">Type</Typography>
          </Grid>
          <Grid lgOffset={1} />
          <Grid xs={2} display={"flex"} justifyContent={"center"}>
            <Typography variant="h5" weight="semibold">Spacecraft</Typography>
          </Grid>
          <Grid xs={2} />
        </Grid>
        <Box>
          {
            investigations.length > 0 && OTHER_CHARS.map((character, index) => {

              const indexedInvestigations = getItemsByIndex(investigations, character);

              return (
                <React.Fragment key={"investigations_hash" + index}>
                  {indexedInvestigations.map(
                    (investigation: Investigation, investigationIndex) => {
                      return (
                         <FeaturedLink
                          description={investigation[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION]}
                          title={ investigation[PDS4_INFO_MODEL.TITLE] }
                          primaryLink={ getLinkToInvestigationDetailPage({ lid: investigation.lid }) }
                          columns={[
                            {
                              horizontalAlign: "center",
                              data: investigation[PDS4_INFO_MODEL.INVESTIGATION.TYPE],
                              verticalAlign: "center",
                              width: 1
                            },
                            {
                              horizontalAlign: "center",
                              data: getAffiliatedSpacecraft(state, investigation).join(", "),
                              verticalAlign: "center",
                              width: 2
                            }
                          ]}
                          key={"investigation_" + investigationIndex}
                        >
                          <FeaturedLinkDetails 
                            instrumentHostTitles={getAffiliatedSpacecraft(state, investigation)}
                            lid={{value: investigation[PDS4_INFO_MODEL.LID], link: getLinkToInvestigationDetailPage({ lid: investigation.lid })}}
                            startDate={{value:investigation[PDS4_INFO_MODEL.INVESTIGATION.START_DATE]}}
                            stopDate={{value:investigation[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE]}}
                            variant={FeaturedLinkDetailsVariant.INVESTIGATION}
                            investigationType={[investigation[PDS4_INFO_MODEL.INVESTIGATION.TYPE]]}
                          />
                        </FeaturedLink>
                      );
                    }
                  )}
                </React.Fragment>
              );
            })
          }
          {
            investigations.length > 0 && ALPHABET.map((letter) => {

              const indexedInvestigations = getItemsByIndex(investigations, letter);
              const indexedInvestigationsCount = Object.keys(indexedInvestigations).length;

              return (
                <React.Fragment key={"investigations_" + letter}>
                  { <Typography variant="h2" weight="bold"
                        sx={{
                          paddingRight: "10px",
                          paddingTop: "15px",
                          color: indexedInvestigationsCount
                            ? "#000000"
                            : "#959599",
                        }}
                      >
                        <a id={letter}>{letter}</a>
                      </Typography>
                  }
                  { indexedInvestigations.map(
                    (investigation: Investigation, investigationIndex) => {
                      return (
                        <FeaturedLink
                          description={investigation[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION]}
                          title={ investigation[PDS4_INFO_MODEL.TITLE] }
                          primaryLink={ getLinkToInvestigationDetailPage({ lid: investigation.lid }) }
                          columns={[
                            {
                              horizontalAlign: "center",
                              data: investigation[PDS4_INFO_MODEL.INVESTIGATION.TYPE],
                              verticalAlign: "center",
                              width: 1
                            },
                            {
                              horizontalAlign: "center",
                              data: getAffiliatedSpacecraft(state, investigation).join(", "),
                              verticalAlign: "center",
                              width: 2
                            }
                          ]}
                          key={"investigation_" + investigationIndex}
                        >
                          <FeaturedLinkDetails 
                            instrumentHostTitles={getAffiliatedSpacecraft(state,investigation)}
                            lid={{value: investigation[PDS4_INFO_MODEL.LID], link: getLinkToInvestigationDetailPage({ lid: investigation.lid })}}
                            startDate={{value: investigation[PDS4_INFO_MODEL.INVESTIGATION.START_DATE]}}
                            stopDate={{value:investigation[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE]}}
                            variant={FeaturedLinkDetailsVariant.INVESTIGATION}
                            investigationType={[investigation[PDS4_INFO_MODEL.INVESTIGATION.TYPE]]}
                          />
                        </FeaturedLink>
                      );
                    }
                  )}
                </React.Fragment>
              );
            })
          }
        </Box>
      </Container>
    </>
  );
}

export default InvestigationsIndexedListComponent;