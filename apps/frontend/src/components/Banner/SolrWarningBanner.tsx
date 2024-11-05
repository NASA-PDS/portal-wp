import { useEffect, useState } from "react";
import { Banner } from "@nasapds/wds-react";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router";
import { formatSearchResults } from "../../pages/search/searchUtils";

const solrEndpoint =
  "https://pds.nasa.gov/services/search/search?wt=json&qt=keyword&q=*&rows=0&start=0";

export type SolrWarningBannerProps = {
  title: string;
  message: string;
  pages: string[];
};

export const SolrWarningBanner = (props: SolrWarningBannerProps) => {
  const { title, message, pages } = props;
  const location = useLocation();

  const [isErrorDetected, setIsErrorDetected] = useState(false);

  const checkPageService = async () => {
    let routeMatch = false;
    pages.forEach((path) => {
      if (matchPath(path, location.pathname)) {
        routeMatch = true;
      }
    });

    if (routeMatch) {
      fetch(solrEndpoint)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          } else {
            return response.json();
          }
        })
        .then((data) => {
          const formattedResults = formatSearchResults(data);

          if (formattedResults.response.numFound <= 0) {
            setIsErrorDetected(true);
          }
        })
        .catch((error) => {
          setIsErrorDetected(true);
        });
    }
  };

  useEffect(() => {
    checkPageService();
  }, [location]);

  return (
    <>
      {isErrorDetected ? (
        <Banner title={title} message={message} variant="alert" />
      ) : (
        <></>
      )}
    </>
  );
};
