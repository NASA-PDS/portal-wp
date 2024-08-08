import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { SolrSearchResponse } from "src/types/solrSearchResponse";

import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  InputAdornment,
  Link,
} from "@mui/material";

import {
  createSearchParams,
  generatePath,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  Button,
  IconSearch,
  Pagination,
  TextField,
  Typography,
} from "@nasapds/wds-react";

import "./search.css";

const linkStyles = {
  color: "white",
  fontFamily: "Inter",
  fontSize: "14px",
  fontWeight: "300",
  lineHeight: "19px",
  paddingY: "4px",
};

const SearchPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<SolrSearchResponse | null>(
    null
  );

  const [paginationPage, setPaginationPage] = useState(1);
  const [paginationCount, setPaginationCount] = useState(1);
  const [resultRows, setResultRows] = useState(20);

  const formatSearchResults = (data: SolrSearchResponse) => {
    return data;
  };

  const doSearch = async (searchText: string, start: number, rows: number) => {
    const url =
      "https://pds.nasa.gov/services/search/search?wt=json&q=" +
      searchText +
      "&rows=" +
      rows +
      "&start=" +
      start;

    console.log("fetchurl", url);

    const response = await fetch(url);
    const data = await response.json();
    const formattedResults = formatSearchResults(data);

    setSearchResults(formattedResults);
    calculatePaginationCount(formattedResults);
  };

  const handleSearchInputValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInputValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      const params = {
        searchText: searchInputValue,
      };
      navigate(generatePath("/search/:searchText/", params));
    }
  };

  const handleSearchClick = () => {
    const params = {
      searchText: searchInputValue,
    };
    navigate(generatePath("/search/:searchText/", params));
  };

  const handlePaginationChange = (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    const params = {
      searchText: searchInputValue,
    };
    const page = value.toString();

    navigate({
      pathname: generatePath("/search/:searchText/", params),
      search: createSearchParams({ page }).toString(),
    });
  };

  const calculateStartValue = (page: number, rows: number) => {
    return (page - 1) * rows;
  };

  const calculatePaginationCount = (data: SolrSearchResponse) => {
    const rows = Number(data.responseHeader.params.rows);
    const hits = data.response.numFound;
    const count = Math.ceil(hits / rows);

    setPaginationCount(count);
  };

  useEffect(() => {
    if (params.searchText) {
      setSearchInputValue(params.searchText);

      let defaultPage = 1;
      let defaultStart = 0;
      let defaultRows = 20;

      const rowsParam = Number(searchParams.get("rows"));
      if (rowsParam) {
        setResultRows(rowsParam);
        defaultRows = rowsParam;
      }

      const paginationPageParam = Number(searchParams.get("page"));
      if (paginationPageParam) {
        setPaginationPage(paginationPageParam);
        defaultPage = paginationPageParam;
        defaultStart = calculateStartValue(defaultPage, defaultRows);
      } else {
        setPaginationPage(1);
      }

      doSearch(params.searchText, defaultStart, defaultRows);
    }
  }, [params.searchText, searchParams.get("page")]);

  return (
    <>
      <Container maxWidth={false} disableGutters sx={{ textAlign: "left" }}>
        {/* Page Intro */}
        <Container
          maxWidth={"xl"}
          sx={{
            paddingY: "24px",
          }}
        >
          <Grid
            container
            spacing={4}
            sx={{ height: "100%" }}
            alignItems="center"
            direction="row"
          >
            <Grid item xs={12} md={12}>
              <Breadcrumbs
                aria-label="breadcrumb"
                maxItems={3}
                sx={{
                  backgroundColor: "rgba(23,23,27,0.17)",
                  paddingY: "3px",
                  paddingX: "5px",
                  borderRadius: "3px",
                  width: "fit-content",
                }}
              >
                <Link
                  underline="hover"
                  color="inherit"
                  href="/"
                  style={linkStyles}
                >
                  Home
                </Link>
                <Typography variant="h6" weight="regular">
                  Search
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={4}
            sx={{ height: "100%" }}
            alignItems="center"
            direction="row"
            columns={{ xs: 3, sm: 8, md: 12 }}
          >
            <Grid item xs={3} sm={3} md={3}>
              {searchResults ? (
                <Box>
                  <Typography variant="h3" weight="bold">
                    Showing results for &nbsp;
                    <Box component="span" className="resultsCounterInputValue">
                      {searchResults.responseHeader.params.q}
                    </Box>
                  </Typography>
                  <Typography variant="body5" weight="regular">
                    {searchResults.response.start + 1} -{" "}
                    {Number(searchResults.response.start) +
                      Number(searchResults.response.docs.length)}{" "}
                    of {searchResults.response.numFound} results (
                    {searchResults.responseHeader.QTime}) seconds
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
            </Grid>

            <Grid item xs={9} sm={9} md={9}>
              <Box className="searchBarContainer">
                <TextField
                  variant="search"
                  className="pds-search-bar"
                  id="pds-search-bar"
                  placeholder="Search PDS"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleSearchInputValueChange}
                  onKeyDown={handleKeyDown}
                  value={searchInputValue}
                />
                <Button
                  variant={"cta"}
                  className="pds-search-searchButton"
                  onClick={handleSearchClick}
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
        {/* Search Results Content */}
        <Container
          maxWidth={"xl"}
          sx={{
            paddingY: "24px",
          }}
        >
          <Grid container spacing={4} columns={{ xs: 3, sm: 8, md: 12 }}>
            <Grid item xs={3} sm={3} md={3}>
              <Typography variant="h6" weight="regular">
                Filters go here
              </Typography>
            </Grid>
            <Grid item xs={9} sm={9} md={9}>
              <Typography
                variant="h6"
                weight="regular"
                sx={{ wordBreak: "break-all" }}
              >
                Results go here: {JSON.stringify(searchResults)}
              </Typography>
            </Grid>
          </Grid>
        </Container>

        {searchResults ? (
          <Container
            maxWidth={"xl"}
            sx={{
              paddingY: "24px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pagination
                count={paginationCount}
                page={paginationPage}
                siblingCount={1}
                onChange={handlePaginationChange}
              />
            </Box>
          </Container>
        ) : (
          <></>
        )}
      </Container>
    </>
  );
};

export default SearchPage;
