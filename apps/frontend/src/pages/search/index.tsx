import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { SolrSearchResponse } from "src/types/solrSearchResponse";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import {
  Button as MuiButton,
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
  IconArrowCircleDown,
  IconSearch,
  Pagination,
  TextField,
  Typography,
} from "@nasapds/wds-react";

import "./search.css";

const feedbackEmail = "mailto:example@example.com";

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
  const [resultSort, setResultSort] = useState("relevance");

  const formatSearchResults = (data: SolrSearchResponse) => {
    return data;
  };

  const doNavigate = (
    searchText: string,
    rows: string,
    sort: string,
    page: string
  ) => {
    const pathParams = {
      searchText,
    };
    const queryParams = {
      rows,
      sort,
      page,
    };

    navigate({
      pathname: generatePath("/search/:searchText/", pathParams),
      search: createSearchParams(queryParams).toString(),
    });
  };

  const doSearch = async (
    searchText: string,
    start: number,
    rows: number,
    sort: string
  ) => {
    let url =
      "https://pds.nasa.gov/services/search/search?wt=json&q=" +
      searchText +
      "&rows=" +
      rows +
      "&start=" +
      start;

    if (sort !== "relevance") {
      url = url + "&sort=title " + sort;
    }

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
      doNavigate(searchInputValue, resultRows.toString(), resultSort, "1");
    }
  };

  const handleSearchClick = () => {
    doNavigate(searchInputValue, resultRows.toString(), resultSort, "1");
  };

  const handlePaginationChange = (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    doNavigate(
      searchInputValue,
      resultRows.toString(),
      resultSort,
      value.toString()
    );
  };

  const handleResultRowsChange = (event: SelectChangeEvent) => {
    doNavigate(searchInputValue, event.target.value, resultSort, "1");
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    doNavigate(
      searchInputValue,
      resultRows.toString(),
      event.target.value,
      "1"
    );
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

      let page = 1;
      let start = 0;
      let rows = 20;
      let sort = "relevance";

      const rowsParam = Number(searchParams.get("rows"));
      if (rowsParam) {
        rows = rowsParam;
        setResultRows(rows);
      }

      const paginationPageParam = Number(searchParams.get("page"));
      if (paginationPageParam) {
        setPaginationPage(paginationPageParam);
        page = paginationPageParam;
        start = calculateStartValue(page, rows);
      } else {
        setPaginationPage(1);
      }

      const sortParam = searchParams.get("sort");
      if (sortParam) {
        sort = sortParam;
        setResultSort(sort);
      }

      doSearch(params.searchText, start, rows, sort);
    } else {
      setSearchResults(null);
    }
  }, [
    params.searchText,
    searchParams.get("page"),
    searchParams.get("rows"),
    searchParams.get("sort"),
  ]);

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
                searchResults.response.numFound > 0 ? (
                  <Box>
                    <Typography variant="h3" weight="bold">
                      Showing results for{" "}
                      <Box
                        component="span"
                        className="resultsCounterInputValue"
                      >
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
                  <Box>
                    <Typography variant="h3" weight="bold">
                      No results to show
                    </Typography>
                    <Typography variant="body5" weight="regular">
                      0 of 0 results
                    </Typography>
                  </Box>
                )
              ) : (
                <Box>
                  <Typography variant="h3" weight="bold">
                    No results to show
                  </Typography>
                  <Typography variant="body5" weight="regular">
                    0 of 0 results
                  </Typography>
                </Box>
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

        {searchResults ? (
          searchResults.response.numFound > 0 ? (
            <Container
              className="pds-search-options-container"
              maxWidth={"xl"}
              sx={{
                paddingY: "24px",
              }}
            >
              <Box className="pds-search-option-box">
                <MuiButton variant="text" className="pds-search-option-button">
                  Expand All
                </MuiButton>
                <Typography variant="h8" weight="semibold">
                  {" "}
                  |{" "}
                </Typography>
                <MuiButton variant="text" className="pds-search-option-button">
                  Collapse All
                </MuiButton>
              </Box>
              <Box className="pds-search-option-box">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    className="pds-select-search-options"
                    value={resultRows.toString()}
                    renderValue={(selected) => {
                      return "NUMBER OF RESULTS: " + selected;
                    }}
                    onChange={handleResultRowsChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    IconComponent={IconArrowCircleDown}
                    variant="standard"
                  >
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={60}>60</MenuItem>
                    <MenuItem value={80}>80</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box className="pds-search-option-box">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    className="pds-select-search-options"
                    value={resultSort}
                    renderValue={(selected) => {
                      return "SORT: " + selected.toUpperCase();
                    }}
                    onChange={handleSortChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    IconComponent={IconArrowCircleDown}
                    variant="standard"
                  >
                    <MenuItem value={"relevance"}>Relevance</MenuItem>
                    <MenuItem value={"asc"}>Ascending</MenuItem>
                    <MenuItem value={"desc"}>Descending</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Container>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
        {/* Search Results Content */}

        {searchResults ? (
          searchResults.response.numFound > 0 ? (
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
          ) : (
            <Container
              maxWidth={"xl"}
              sx={{
                paddingY: "24px",
              }}
            >
              <Box className="pds-search-empty-container">
                <br />
                <Typography variant="h3" weight="bold">
                  No Results Found
                </Typography>
                <Typography variant="h4" weight="regular">
                  You may want to try using different keywords, checking for
                  typos, or adjusting your filters
                </Typography>
                <br />
                <Typography variant="h4" weight="regular">
                  Not the results you expected?{" "}
                  <a href={feedbackEmail} target="_top">
                    Give feedback
                  </a>
                </Typography>
              </Box>
            </Container>
          )
        ) : (
          <Container
            maxWidth={"xl"}
            sx={{
              paddingY: "24px",
            }}
          >
            <Box className="pds-search-empty-container">
              <br />
              <Typography
                variant="h3"
                weight="bold"
                className="pds-search-empty-icon-div"
              >
                <IconSearch />
                &nbsp;Enter a search query to show results
              </Typography>
              <Typography variant="h4" weight="regular">
                You may want to try using different keywords, checking for
                typos, or adjusting your filters
              </Typography>
              <br />
              <Typography variant="h4" weight="regular">
                Not the results you expected?{" "}
                <a href={feedbackEmail} target="_top">
                  Give feedback
                </a>
              </Typography>
            </Box>
          </Container>
        )}

        {searchResults ? (
          searchResults.response.numFound > 0 ? (
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
          )
        ) : (
          <></>
        )}
      </Container>
    </>
  );
};

export default SearchPage;
