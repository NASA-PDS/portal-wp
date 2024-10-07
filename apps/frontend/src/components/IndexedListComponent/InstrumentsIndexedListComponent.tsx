import React, { useEffect, useState } from "react";
import {Box, Container, Divider, Link, MenuItem, Select } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { Instrument } from "src/types/instrument.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { selectLatestInstrumentHostsForInstrument } from "src/state/selectors";
import { RootState, store } from "src/state/store";
import { InstrumentHost } from "src/types/instrumentHost";
import { convertLogicalIdentifier, LID_FORMAT } from "src/utils/strings";
import { ExpandMore } from "@mui/icons-material";
import { FeaturedLink, FeaturedLinkDetails, FeaturedLinkDetailsVariant, Typography } from "@nasapds/wds-react";

type InstrumentsIndexedListComponentProps = {
  instruments: Instrument[];
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const OTHER_CHARS = "0123456789".split("");

type InstrumentDetailPathParams = {
  lid:string;
}

const getItemsByIndex = (
  arr: Instrument[],
  index: string
): Instrument[] => {
  return arr.filter((item) => {
    return item[PDS4_INFO_MODEL.TITLE]
      .toUpperCase()
      .startsWith(index.toUpperCase());
  });
};

function getAffiliatedSpacecraft(state:RootState, instrument:Instrument) {
  return selectLatestInstrumentHostsForInstrument(state, instrument[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST])?.reduce(
    (accumulator, item:InstrumentHost) => { return accumulator === "" ? accumulator += item[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME] : accumulator += ", ".concat(item[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME]) }, ''
  )
}

function getAffiliatedSpacecraft2(state:RootState, instrument:Instrument) {
  const instrumentHostTitles = selectLatestInstrumentHostsForInstrument(state, instrument[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST])?.map(
    (instrumentHost) => instrumentHost[PDS4_INFO_MODEL.TITLE]
  )
  return instrumentHostTitles;
}

function InstrumentsIndexedListComponent(props:InstrumentsIndexedListComponentProps) {

  const instruments = props.instruments;
  const navigate = useNavigate();
  const location = useLocation();
  const state = store.getState();

  const [indexValue, setIndexValue] = useState(location.hash.replace("#",""));

  const instrumentListItemPrimaryPath = (params:InstrumentDetailPathParams) => {
    params.lid = convertLogicalIdentifier(params.lid,LID_FORMAT.URL_FRIENDLY);
    return generateLinkPath("/instruments/:lid/data", params);
  };

  const scrollToIndex = (id:string) => {
    console.log("Set scroll to: ", id)
    setIndexValue(id);
  }

  const generateLinkPath = (template:string, params:{[key:string]:string}) => {
    return generatePath(template, params)
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
          instruments.length > 0 && ALPHABET.map((letter) => {

            const indexedInstruments = getItemsByIndex(instruments, letter);
            const indexedInstrumentsCount = Object.keys(indexedInstruments).length;
            const anchorName = indexedInstrumentsCount > 0 ? "#" + letter : undefined;
            const anchorColor = indexedInstrumentsCount > 0 ? "#1976d2" : "#959599";

            return indexedInstrumentsCount >= 0 ? (
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
            instruments.length > 0 && ALPHABET.map((letter) => {
  
              const indexedInstruments = getItemsByIndex(instruments, letter);
              const indexedInstrumentsCount = Object.keys(indexedInstruments).length;

              return (
                <MenuItem value={letter} disabled={indexedInstrumentsCount === 0} key={"menu_letter_" + letter}>
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
            instruments.length > 0 && OTHER_CHARS.map((character, index) => {

              const indexedInstruments = getItemsByIndex(instruments, character);
              const indexedInstrumentsCount = Object.keys(indexedInstruments).length;

              return (
                <React.Fragment key={"instruments_hash" + index}>
                  {indexedInstruments.map(
                    (instrument: Instrument, instrumentIndex) => {
                      return (
                         <FeaturedLink
                          description={instrument[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION]}
                          title={ instrument[PDS4_INFO_MODEL.TITLE] }
                          primaryLink={ instrumentListItemPrimaryPath({ lid: instrument.lid }) }
                          columns={[
                            {
                              horizontalAlign: "center",
                              data: instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE].join(", "),
                              verticalAlign: "center",
                              width: 1
                            },
                            {
                              horizontalAlign: "center",
                              data: getAffiliatedSpacecraft(state, instrument),
                              verticalAlign: "center",
                              width: 2
                            }
                          ]}
                          key={"instrument_" + instrumentIndex}
                        >
                          <FeaturedLinkDetails 
                            instrumentType={instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE]}
                            investigation={{value:""}}
                            lid={{value: instrument[PDS4_INFO_MODEL.LID], link: instrumentListItemPrimaryPath({ lid: instrument.lid })}}
                            startDate={{value:""}}
                            stopDate={{value:""}}
                            variant={FeaturedLinkDetailsVariant.INSTRUMENT}
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
            instruments.length > 0 && ALPHABET.map((letter) => {

              const indexedInstruments = getItemsByIndex(instruments, letter);
              const indexedInstrumentsCount = Object.keys(indexedInstruments).length;

              return (
                <React.Fragment key={"instruments_" + letter}>
                  { <Typography variant="h2" weight="bold"
                        sx={{
                          paddingRight: "10px",
                          paddingTop: "15px",
                          color: indexedInstrumentsCount
                            ? "#000000"
                            : "#959599",
                        }}
                      >
                        <a id={letter}>{letter}</a>
                      </Typography>
                  }
                  { indexedInstruments.map(
                    (instrument: Instrument, instrumentIndex) => {
                      return (
                        <FeaturedLink
                          description={instrument[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION]}
                          title={ instrument[PDS4_INFO_MODEL.TITLE] }
                          primaryLink={ instrumentListItemPrimaryPath({ lid: instrument.lid }) }
                          columns={[
                            {
                              horizontalAlign: "center",
                              data: instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE].join(", "),
                              verticalAlign: "center",
                              width: 1
                            },
                            {
                              horizontalAlign: "center",
                              data: getAffiliatedSpacecraft(state, instrument),
                              verticalAlign: "center",
                              width: 2
                            }
                          ]}
                          key={"instrument_" + instrumentIndex}
                        >
                          <FeaturedLinkDetails 
                            instrumentType={instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE]}
                            investigation={{value:""}}
                            lid={{value: instrument[PDS4_INFO_MODEL.LID], link: instrumentListItemPrimaryPath({ lid: instrument.lid })}}
                            startDate={{value:""}}
                            stopDate={{value:""}}
                            variant={FeaturedLinkDetailsVariant.INSTRUMENT}
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

export default InstrumentsIndexedListComponent;