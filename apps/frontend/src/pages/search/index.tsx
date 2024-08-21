import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import {
  SolrSearchResponse,
  SolrIdentifierNameResponse,
  IdentifierNameDoc,
} from "src/types/solrSearchResponse";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { StyledEngineProvider } from "@mui/material/styles";
import Filters from "../../components/Filters/Filters";
import {
  FilterOptionProps,
  FilterProps,
} from "../../components/Filters/Filter";

import {
  Button as MuiButton,
  Box,
  Breadcrumbs,
  Container,
  Grid,
  InputAdornment,
  Link,
  Select,
  SelectChangeEvent,
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
const solrEndpoint = "https://pds.nasa.gov/services/search/search";

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

  const [resultFilters, setResultFilters] = useState("");

  const [parsedFilters, setParsedFilters] = useState<FilterProps[]>([]);

  const formatSearchResults = (data: SolrSearchResponse) => {
    return data;
  };

  const formatIdentifierNameResults = (data: SolrIdentifierNameResponse) => {
    return data;
  };

  const doNavigate = (
    searchText: string,
    rows: string,
    sort: string,
    page: string,
    filters: string
  ) => {
    const pathParams = {
      searchText,
    };

    let queryParams;
    if (filters.length > 0) {
      queryParams = {
        rows,
        sort,
        page,
        filters,
      };
    } else {
      queryParams = {
        rows,
        sort,
        page,
      };
    }

    navigate({
      pathname: generatePath("/search/:searchText/", pathParams),
      search: createSearchParams(queryParams).toString(),
    });
  };

  const formatFilterQueries = (filters: string) => {
    const filterArray = filters.split("+");
    let formattedFilterQueryString = "";

    filterArray.forEach((filterName, index) => {
      if (index % 2 == 0) {
        const filterValue = filterArray[index + 1];
        formattedFilterQueryString =
          formattedFilterQueryString +
          "&fq=" +
          filterName +
          ':"' +
          filterValue +
          '"';
      }
    });

    return formattedFilterQueryString;
  };

  const doFilterMap = async (
    urnUrl: string,
    namesUrl: string,
    type: string
  ) => {
    const filtersMap: { name: string; identifier: string }[] = [];
    const notFoundfiltersMap: string[] = [];

    const urnResponse = await fetch(urnUrl);
    const urnData = await urnResponse.json();

    const namesResponse = await fetch(namesUrl);
    const namesData = await namesResponse.json();

    const formattedUrnData = formatIdentifierNameResults(urnData);
    const formattedInvestigationData = formatIdentifierNameResults(namesData);

    let urns: string[] = [];
    if (
      formattedUrnData.facet_counts.facet_fields.investigation_ref &&
      formattedUrnData.facet_counts.facet_fields.investigation_ref.length > 0
    ) {
      urns = formattedUrnData.facet_counts.facet_fields.investigation_ref;
    }
    if (
      formattedUrnData.facet_counts.facet_fields.instrument_ref &&
      formattedUrnData.facet_counts.facet_fields.instrument_ref.length > 0
    ) {
      urns = formattedUrnData.facet_counts.facet_fields.instrument_ref;
    }
    if (
      formattedUrnData.facet_counts.facet_fields.target_ref &&
      formattedUrnData.facet_counts.facet_fields.target_ref.length > 0
    ) {
      urns = formattedUrnData.facet_counts.facet_fields.target_ref;
    }

    const names: IdentifierNameDoc[] = formattedInvestigationData.response.docs;

    urns.forEach((urn, index) => {
      if (index % 2 == 0) {
        const urnSplit = urn.split("::")[0];
        const nameDoc = names.find((name) => name.identifier === urnSplit);

        if (nameDoc) {
          let name: string = "";

          if (nameDoc.investigation_name) {
            name = nameDoc.investigation_name[0];
          }
          if (nameDoc.instrument_name) {
            name = nameDoc.instrument_name[0];
          }
          if (nameDoc.target_name) {
            name = nameDoc.target_name[0];
          }

          filtersMap.push({
            name,
            identifier: urn,
          });
        } else {
          notFoundfiltersMap.push(urnSplit);
        }
      }
    });

    return filtersMap;
  };

  const doSearch = async (
    searchText: string,
    start: number,
    rows: number,
    sort: string,
    filters: string
  ) => {
    let url =
      solrEndpoint +
      "?wt=json&q=" +
      searchText +
      "&rows=" +
      rows +
      "&start=" +
      start;

    if (sort !== "relevance") {
      url = url + "&sort=title " + sort;
    }

    if (filters.length > 0) {
      const formattedFilters = formatFilterQueries(filters);

      url = url + formattedFilters;
    }

    const response = await fetch(url);
    const data = await response.json();
    const formattedResults = formatSearchResults(data);

    setSearchResults(formattedResults);
    calculatePaginationCount(formattedResults);

    parseFilters(searchText, filters);
  };

  const handleSearchInputValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInputValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      doNavigate(searchInputValue, resultRows.toString(), resultSort, "1", "");
    }
  };

  const handleSearchClick = () => {
    doNavigate(searchInputValue, resultRows.toString(), resultSort, "1", "");
  };

  const handlePaginationChange = (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    doNavigate(
      searchInputValue,
      resultRows.toString(),
      resultSort,
      value.toString(),
      resultFilters
    );
  };

  const handleResultRowsChange = (event: SelectChangeEvent) => {
    doNavigate(
      searchInputValue,
      event.target.value,
      resultSort,
      "1",
      resultFilters
    );
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    doNavigate(
      searchInputValue,
      resultRows.toString(),
      event.target.value,
      "1",
      resultFilters
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
      let filters = "";

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

      const filtersParam = searchParams.get("filters");
      if (filtersParam) {
        filters = filtersParam;
        setResultFilters(filters);
      } else {
        setResultFilters(filters);
      }

      doSearch(params.searchText, start, rows, sort, filters);
    } else {
      setSearchResults(null);
    }
  }, [
    params.searchText,
    searchParams.get("page"),
    searchParams.get("rows"),
    searchParams.get("sort"),
    searchParams.get("filters"),
  ]);

  const formatOptionTitle = (text: string) => {
    return text.replace("1,", "");
  };

  const removeFilter = (
    value: string,
    name: string,
    existingFilters: string
  ) => {
    let filters = existingFilters;
    const replaceFilterInside = "+" + value + "+" + name;
    const replaceFilterFirst = value + "+" + name + "+";
    const replaceFilterOnly = value + "+" + name;

    filters = filters.replace(replaceFilterInside, "");
    filters = filters.replace(replaceFilterFirst, "");
    filters = filters.replace(replaceFilterOnly, "");

    return filters;
  };

  const removeAllFilters = (
    filtersToRemove: { value: string; name: string }[],
    existingFilters: string
  ) => {
    let filters = existingFilters;

    filtersToRemove.forEach((filter) => {
      filters = removeFilter(filter.value, filter.name, filters);
    });

    return filters;
  };

  const handleFilterChecked = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value } = e.target;
    let filters = "";

    if (name === "all") {
      if (checked) {
        const filtersToDelete: { value: string; name: string }[] = [];

        const fqs = resultFilters.split("+");
        fqs.forEach((fq, index) => {
          if (index % 2 === 0) {
            if (fq === value) {
              filtersToDelete.push({
                value: fq,
                name: fqs[index + 1],
              });
            }
          }
        });

        filters = removeAllFilters(filtersToDelete, resultFilters);
      }
    } else {
      if (checked) {
        const newFilter = value + "+" + name;

        if (resultFilters.length > 0) {
          if (!filters.includes(newFilter))
            filters = resultFilters + "+" + newFilter;
        } else {
          filters = newFilter;
        }
      } else {
        filters = removeFilter(value, name, resultFilters);
      }
    }

    doNavigate(
      searchInputValue,
      resultRows.toString(),
      resultSort,
      "1",
      filters
    );
  };

  const isOptionChecked = (
    identifier: string,
    parentValue: string,
    filters: string
  ) => {
    let isOptionChecked = false;

    if (filters && filters.length > 0) {
      const fqs = filters.split("+");

      fqs.forEach((fq, index) => {
        if (index % 2 === 0) {
          if (fq === parentValue && fqs[index + 1] === identifier) {
            isOptionChecked = true;
          }
        }
      });
    }

    return isOptionChecked;
  };

  const isAllOptionsChecked = (value: string, filters: string) => {
    let isChecked = true;

    if (filters && filters.length > 0) {
      const fqs = filters.split("+");

      fqs.forEach((fq, index) => {
        if (index % 2 === 0) {
          if (fq === value) {
            isChecked = false;
          }
        }
      });
    }

    return isChecked;
  };

  const parseFilterOptions = (
    options: { name: string; identifier: string }[],
    filters: string,
    parentValue: string
  ) => {
    const parsedOptions: FilterOptionProps[] = [];

    parsedOptions.push({
      title: "all",
      value: "all",
      resultsFound: 0,
      isChecked: isAllOptionsChecked(parentValue, filters),
    });

    options.forEach((option) => {
      parsedOptions.push({
        title: option.name,
        value: option.identifier,
        isChecked: isOptionChecked(option.identifier, parentValue, filters),
        resultsFound: 0,
      });
    });

    return parsedOptions;
  };

  const parseFilters = (originalSearchText: string, filters: string) => {
    const investigationUrnsUrl =
      solrEndpoint +
      "?q=" +
      originalSearchText +
      "&rows=0&facet=on&facet.field=investigation_ref&wt=json&facet.limit=-1";

    const investigationsUrl =
      "https://pds.nasa.gov/services/search/search?wt=json&q=data_class:Investigation&fl=investigation_name,identifier&rows=10000";

    const instrumentUrnsUrl =
      solrEndpoint +
      "?q=" +
      originalSearchText +
      "&rows=0&facet=on&facet.field=instrument_ref&wt=json&facet.limit=-1";

    const instrumentsUrl =
      "https://pds.nasa.gov/services/search/search?wt=json&q=data_class:Instrument&fl=instrument_name,identifier&rows=10000";

    const targetUrnsUrl =
      solrEndpoint +
      "?q=" +
      originalSearchText +
      "&rows=0&facet=on&facet.field=target_ref&wt=json&facet.limit=-1";

    const targetsUrl =
      "https://pds.nasa.gov/services/search/search?wt=json&q=data_class:Target&fl=target_name,identifier&rows=10000";

    doFilterMap(investigationUrnsUrl, investigationsUrl, "investigations").then(
      (investigationFilterOptions) => {
        doFilterMap(instrumentUrnsUrl, instrumentsUrl, "instruments").then(
          (instrumentFilterOptions) => {
            doFilterMap(targetUrnsUrl, targetsUrl, "targets").then(
              (targetFilterOptions) => {
                setPropsForFilter(
                  investigationFilterOptions,
                  instrumentFilterOptions,
                  targetFilterOptions,
                  filters
                );
              }
            );
          }
        );
      }
    );
  };

  const setPropsForFilter = (
    investigationFilterOptions: { name: string; identifier: string }[],
    instrumentFilterOptions: { name: string; identifier: string }[],
    targetFilterOptions: { name: string; identifier: string }[],
    originalFilters: string
  ) => {
    const filters: FilterProps[] = [];

    const investigationFilter = {
      displayTitle: "Investigations",
      title: "facet_investigation",
      value: "investigation_ref",
      options: parseFilterOptions(
        investigationFilterOptions,
        originalFilters,
        "investigation_ref"
      ),
      onChecked: handleFilterChecked,
    };
    filters.push(investigationFilter);

    const instrumentsFilter = {
      displayTitle: "Instruments",
      title: "facet_instrument",
      value: "instrument_ref",
      options: parseFilterOptions(
        instrumentFilterOptions,
        originalFilters,
        "instrument_ref"
      ),
      onChecked: handleFilterChecked,
    };
    filters.push(instrumentsFilter);

    const targetsFilter = {
      displayTitle: "Targets",
      title: "facet_target",
      value: "target_ref",
      options: parseFilterOptions(
        targetFilterOptions,
        originalFilters,
        "target_ref"
      ),
      onChecked: handleFilterChecked,
    };
    filters.push(targetsFilter);

    setParsedFilters(filters);
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
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
                  <MuiButton
                    variant="text"
                    className="pds-search-option-button"
                  >
                    Expand All
                  </MuiButton>
                  <Typography variant="h8" weight="semibold">
                    {" "}
                    |{" "}
                  </Typography>
                  <MuiButton
                    variant="text"
                    className="pds-search-option-button"
                  >
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
                      <Filters
                        //filters={parseFilters(searchResults.facet_counts)}
                        filters={parsedFilters}
                        onChecked={handleFilterChecked}
                      ></Filters>
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
      </StyledEngineProvider>
    </>
  );
};

export default SearchPage;
