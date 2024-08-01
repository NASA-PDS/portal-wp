import { Instrument, InstrumentHost, Investigation } from "src/types";

import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { convertLogicalIdentifier, LID_FORMAT } from "src/utils/strings";
import { useEffect } from "react";
import { getData } from "src/state/slices/dataManagerSlice";
import { useAppDispatch, useAppSelector } from "src/state/hooks";
import { RootState } from "src/state/store";
import { selectLatestInstrumentVersion } from "src/state/selectors/instruments";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { Box, Breadcrumbs, Container, Grid, Typography } from "@mui/material";
import { Loader } from "@nasapds/wds-react";
import InvestigationStatus from "src/components/InvestigationStatus/InvestigationStatus";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import StatsList from "src/components/StatsList/StatsList";
import { selectLatestInstrumentHostVersion } from "src/state/selectors/instrumentHost";
import { selectLatestInvestigationVersion } from "src/state/selectors/investigations";


interface InstrumentDetailBodyProps {
  instrument:Instrument;
  instrumentHost:InstrumentHost,
  investigation:Investigation,
  status:string;
  tabLabel:string
}

interface Stats {
  label: string;
  value: string;
  enableCopy?: boolean;
}


const InstrumentDetailPage = () => {

  const { instrumentLid, tabLabel } = useParams();
  const dispatch = useAppDispatch();
  const convertedInstrumentLid = convertLogicalIdentifier(instrumentLid !== undefined ? instrumentLid : "", LID_FORMAT.DEFAULT);

  const dataManagerStatus = useAppSelector( (state) => { return state.dataManager.status } )

  useEffect( () => {

    if( dataManagerStatus === 'idle' ) {
      dispatch( getData() );
    }

  }, [dispatch, dataManagerStatus]);

  return (
    <>
      <ConnectedComponent instrumentLid={convertedInstrumentLid} tabLabel={tabLabel} />
    </>
  );

};

const InstrumentDetailBody = (props:InstrumentDetailBodyProps) => {

  const {instrument, instrumentHost, investigation, status, tabLabel } = props;

  const stats:Stats[] = [
    {
      label: "Investigation",
      value: investigation[PDS4_INFO_MODEL.TITLE]
    },
    {
      label: "Temporal Coverage",
      value: investigation[PDS4_INFO_MODEL.INVESTIGATION.START_DATE].concat(" - ", investigation[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE] !== "3000-01-01T00:00:00.000Z" ? investigation[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE] : "(ongoing)")
    },
  ];

  const styles = {
    breadcrumbs:{
      links: {
        color: "#FFFFFF",
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: "300",
        lineHeight: "19px",
        paddingY: "4px",
        textDecoration: "none",
      }
    },
  }

  //const instrumentHost = useAppSelector( (state) => selectLatestInstrumentHostVersion(state, instrument[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST][0]) );

  return (
    <>
      <DocumentMeta
        title={ instrument.title + " Instrument details" }
        description={ instrument.title + "Instrument details" }
      />
      {
        (status === 'idle' || status === 'pending' )
        &&
        <Box sx={{ padding: "40px" }}>
          <Loader variant="indeterminate"/>
        </Box>
      }
      {
        status === 'succeeded'
        && 
        <Container maxWidth={false} disableGutters>
          {/* Page Intro */}
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              backgroundColor: "#000000",
              backgroundImage: "url(/assets/images/headers/instruments/".concat(instrument[PDS4_INFO_MODEL.LID]).concat(".jpg)"),
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              minHeight: "200px",
              height: "fit-content",
              textAlign: "left",
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
                separator={<Typography sx={{
                  color: 'white',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter',
                  fontWeight: '400',
                  lineHeight: '19px',
                  wordWrap: 'break-word'
                }}>/</Typography>}
              >
                <Link color="inherit" to="/" style={styles.breadcrumbs.links}>
                  Home
                </Link>
                <Link color="inherit" to="/instruments/" style={styles.breadcrumbs.links}>
                  Instruments
                </Link>
                <Typography style={{ color: "white" }}>
                  {instrument[PDS4_INFO_MODEL.TITLE]}
                </Typography>
              </Breadcrumbs>
              <Grid container alignItems={"flex-end"}>
                <Grid item md={7} >
                  <Box
                    component="img"
                    sx={{
                      width: 60,
                      paddingTop: "24px",
                    }}
                    alt=""
                    src={"/assets/images/logos/".concat(instrument[PDS4_INFO_MODEL.LID]).concat(".png")}
                  />
                  <Typography
                    variant="h1"
                    style={{
                      color: "white",
                      padding: "0px",
                      paddingTop: "0px",
                      fontSize: "72px",
                      fontWeight: "700",
                    }}
                  >
                    {instrument[PDS4_INFO_MODEL.TITLE]}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "white",
                      marginTop: "8px"
                    }}
                  >
                    {instrument[PDS4_INFO_MODEL.TITLE]}
                  </Typography>
                  <InvestigationStatus stopDate={investigation[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE]} />
                </Grid>
                <Grid item md={1}></Grid>
                <Grid item xs={12} md={4}>
                  <StatsList stats={stats} />
                </Grid>
              </Grid>
            </Container>
          </Container>
        </Container>
      }
    </>
  );
};

const mapStateToProps = (state:RootState, ownProps:{instrumentLid:string, tabLabel:string}):InstrumentDetailBodyProps => {

  let instrument:Instrument = Object();
  let investigation:Investigation = Object();
  let instrumentHost:InstrumentHost = Object();

  if( state.investigations.status === 'succeeded' ) {
  
    instrument = selectLatestInstrumentVersion(state, ownProps.instrumentLid);
    instrumentHost = selectLatestInstrumentHostVersion(state, instrument[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST][0]);
    investigation = selectLatestInvestigationVersion(state, instrumentHost[PDS4_INFO_MODEL.REF_LID_INVESTIGATION][0]);

  }

  return {
    instrument: instrument,
    instrumentHost: instrumentHost,
    investigation: investigation,
    status: state.dataManager.status,
    tabLabel: ownProps.tabLabel
  }
}
const ConnectedComponent = connect(mapStateToProps)(InstrumentDetailBody);
export default InstrumentDetailPage;
