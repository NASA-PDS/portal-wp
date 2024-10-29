import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const RootErrorBoundary = () => {

  const error = useRouteError();
  let errorMessage:string;
  let errorStatus:number | undefined = undefined;

  if( isRouteErrorResponse(error) ) {
    // error is type `ErrorResponse`
    errorMessage = error.data || error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {

    if( import.meta.env.DEV ) {
      // Output query URL to help with debugging only in DEV mode
      console.error(error);
    }
    errorMessage = '😱 Something went wrong';
  }


  return (
    <>
      <Header />
      <div style={{ backgroundColor: 'white', padding: '0px', color: 'black', }}>
        <h1>Uh Oh!</h1>
        {
          errorStatus === 404 && (
            <>
              😱 Not Found (404)
              <br />{errorMessage}
            </>
          )
        }
        {
          errorStatus === undefined && (
            <>{errorMessage}</>
          )
        }
      </div>
      <Footer />
    </>
  );
};

export default RootErrorBoundary;