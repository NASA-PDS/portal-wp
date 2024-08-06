import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useRouteError } from 'react-router-dom';

const RootErrorBoundary = () => {

  const error = useRouteError() as Error;

  return (
    <>
      <Header />
      <div style={{ backgroundColor: 'white', padding: '0px', color: 'black', }}>
        <h1>Uh Oh!</h1>
        {
          error.status === 404 ? <>😱 Not Found (404)</> : <>😱 Something went wrong</>
        }
      </div>
      <Footer />
    </>
  );
};

export default RootErrorBoundary;