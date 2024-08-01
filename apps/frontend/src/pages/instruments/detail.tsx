import { Instrument } from "src/types";

import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { convertLogicalIdentifier, LID_FORMAT } from "src/utils/strings";
import { useEffect } from "react";
import { getData } from "src/state/slices/dataManagerSlice";
import { useAppDispatch, useAppSelector } from "src/state/hooks";
import { RootState } from "src/state/store";
import { selectLatestInstrumentVersion } from "src/state/selectors/instruments";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";


interface InstrumentDetailBodyProps {
  instrument:Instrument;
  status:string;
  tabLabel:string
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

  const {instrument, status, tabLabel } = props;

  return (
    <>
      <DocumentMeta
        title={ instrument.title + " Instrument details" }
        description={ instrument.title + "Instrument details" }
      />
      Instrument Detail Page
    </>
  );
};

const mapStateToProps = (state:RootState, ownProps:{instrumentLid:string, tabLabel:string}):InstrumentDetailBodyProps => {

  let instrument:Instrument = Object();

  if( state.investigations.status === 'succeeded' ) {
  
    instrument = selectLatestInstrumentVersion(state, ownProps.instrumentLid);

  }

  return {
    instrument: instrument,
    status: state.dataManager.status,
    tabLabel: ownProps.tabLabel
  }
}
const ConnectedComponent = connect(mapStateToProps)(InstrumentDetailBody);
export default InstrumentDetailPage;
