import { ChangeEvent, KeyboardEvent, useEffect, useState, useRef } from "react";
import {
  IdentifierNameDoc,
  SolrSearchResponse,
  SolrIdentifierNameResponse,
} from "src/types/solrSearchResponse";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { StyledEngineProvider } from "@mui/material/styles";
import Filters from "../../components/Filters/Filters";
import {
  FilterOptionProps,
  FilterProps,
} from "../../components/Filters/Filter";
import { ellipsisText } from "../../utils/strings";
import {
  Button as MuiButton,
  Box,
  Breadcrumbs,
  Container,
  Grid,
  InputAdornment,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  createSearchParams,
  generatePath,
  Link as RouterLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Button,
  FeaturedLink,
  FeaturedLinkDetails,
  FeaturedLinkDetailsVariant,
  IconArrowCircleDown,
  IconSearch,
  Loader,
  Pagination,
  TextField,
  Typography,
} from "@nasapds/wds-react";
import {
  calculatePaginationCount,
  calculateStartValue,
  formatFilterQueries,
  formatIdentifierNameResults,
  formatSearchResults,
  getDocType,
  getUnmatchedFilters,
  isAllOptionsChecked,
  isOptionChecked,
  mapFilterIdsToName,
  mapPageType,
} from "./searchUtils";
import "./search.css";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { convertLogicalIdentifier, LID_FORMAT } from "src/utils/strings";

const pdsSite = "https://pds.nasa.gov";
const pdsIdViewer =
  "https://pds.nasa.gov/ds-view/pds/viewCollection.jsp?identifier=";
const doiSite = "https://doi.org";
const feedbackEmail = "mailto:example@example.com";
const solrEndpoint = "https://pds.nasa.gov/services/search/search";
const getFiltersQuery =
  "&rows=0&facet=on&facet.field=investigation_ref&facet.field=instrument_ref&facet.field=target_ref&facet.field=page_type&wt=json&facet.limit=-1";
const investigationNamesEndpoint =
  solrEndpoint +
  "?wt=json&q=data_class:Investigation&fl=investigation_name,identifier&rows=10000";
const instrumentNamesEndpoint =
  solrEndpoint +
  "?wt=json&q=data_class:Instrument&fl=instrument_name,identifier&rows=10000";
const targetNamesEndpoint =
  solrEndpoint +
  "?wt=json&q=data_class:Target&fl=target_name,identifier&rows=10000";

const linkStyles = {
  fontFamily: "Inter",
  fontSize: "14px",
  fontWeight: "300",
  lineHeight: "19px",
  paddingY: "4px",
};

const SearchPage = () => {
  const theme = useTheme();
  const isSmallScreen = !useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const params = useParams();
  const searchInputRef = useRef("");

  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<SolrSearchResponse | null>(
    null
  );
  const [paginationPage, setPaginationPage] = useState(1);
  const [paginationCount, setPaginationCount] = useState(1);
  const [resultRows, setResultRows] = useState(20);
  const [resultSort, setResultSort] = useState("relevance");
  const [isLoading, setIsLoading] = useState(false);
  const [resultFilters, setResultFilters] = useState("");
  const [parsedFilters, setParsedFilters] = useState<FilterProps[]>([]);
  const [areResultsExpanded, setAreResultsExpanded] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(true);
  const [unmatchedFilters, setUnmatchedFilters] = useState<
    { name: string; identifier: string; parentName: string }[] | null
  >(null);

  const doFilterMap = (
    filterIdsData: SolrIdentifierNameResponse,
    investigationsData: SolrIdentifierNameResponse,
    instrumentsData: SolrIdentifierNameResponse,
    targetsData: SolrIdentifierNameResponse,
    originalFilters: string
  ) => {
    let investigationFilterIds: string[] = [];
    let instrumentFilterIds: string[] = [];
    let targetFilterIds: string[] = [];
    let pageTypeFilterIds: string[] = [];

    if (
      filterIdsData.facet_counts.facet_fields.investigation_ref &&
      filterIdsData.facet_counts.facet_fields.investigation_ref.length > 0
    ) {
      investigationFilterIds =
        filterIdsData.facet_counts.facet_fields.investigation_ref;
    }
    if (
      filterIdsData.facet_counts.facet_fields.instrument_ref &&
      filterIdsData.facet_counts.facet_fields.instrument_ref.length > 0
    ) {
      instrumentFilterIds =
        filterIdsData.facet_counts.facet_fields.instrument_ref;
    }
    if (
      filterIdsData.facet_counts.facet_fields.target_ref &&
      filterIdsData.facet_counts.facet_fields.target_ref.length > 0
    ) {
      targetFilterIds = filterIdsData.facet_counts.facet_fields.target_ref;
    }
    if (
      filterIdsData.facet_counts.facet_fields.page_type &&
      filterIdsData.facet_counts.facet_fields.page_type.length > 0
    ) {
      pageTypeFilterIds = filterIdsData.facet_counts.facet_fields.page_type;
    }

    const investigationNames: IdentifierNameDoc[] =
      investigationsData.response.docs;
    const instrumentNames: IdentifierNameDoc[] = instrumentsData.response.docs;
    const targetNames: IdentifierNameDoc[] = targetsData.response.docs;

    const investigationFilterOptions = mapFilterIdsToName(
      investigationFilterIds,
      investigationNames
    );
    const instrumentFilterOptions = mapFilterIdsToName(
      instrumentFilterIds,
      instrumentNames
    );
    const targetFilterOptions = mapFilterIdsToName(
      targetFilterIds,
      targetNames
    );
    const pageTypeFilterOptions = mapPageType(pageTypeFilterIds);

    if (originalFilters.length > 0) {
      const unmatchedFilters = getUnmatchedFilters(
        originalFilters,
        investigationFilterOptions,
        instrumentFilterOptions,
        targetFilterOptions,
        investigationNames,
        instrumentNames,
        targetNames
      );
      setUnmatchedFilters(unmatchedFilters);
    }

    setPropsForFilter(
      investigationFilterOptions,
      instrumentFilterOptions,
      targetFilterOptions,
      pageTypeFilterOptions,
      originalFilters
    );
  };

  const setPropsForFilter = (
    investigationFilterOptions: { name: string; identifier: string }[],
    instrumentFilterOptions: { name: string; identifier: string }[],
    targetFilterOptions: { name: string; identifier: string }[],
    pageTypeFilterOptions: { name: string; identifier: string }[],
    originalFilters: string
  ) => {
    const filters: FilterProps[] = [];

    const pageTypeFilter = {
      displayTitle: "Page Type",
      title: "facet_page_type",
      value: "page_type",
      options: parseFilterOptions(
        pageTypeFilterOptions,
        originalFilters,
        "page_type"
      ),
      onChecked: handleFilterChecked,
    };
    filters.push(pageTypeFilter);

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

    setIsLoading(false);
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

  const doSearch = async (
    searchText: string,
    start: number,
    rows: number,
    sort: string,
    filters: string
  ) => {
    if (searchText !== "" || filters.length > 0) {
      setIsEmptyState(false);

      let url =
        solrEndpoint +
        "?wt=json&qt=keyword&q=" +
        encodeURIComponent(searchText) +
        "&rows=" +
        encodeURIComponent(rows) +
        "&start=" +
        encodeURIComponent(start);

      if (sort !== "relevance") {
        url = url + "&sort=title " + encodeURIComponent(sort);
      }

      if (filters.length > 0) {
        const formattedFilters = formatFilterQueries(filters);

        url = url + formattedFilters;
      }

      setIsLoading(true);

      const response = await fetch(url);
      const data = await response.json();
      const formattedResults = formatSearchResults(data);

      setSearchResults(formattedResults);
      setPaginationCount(calculatePaginationCount(formattedResults));

      parseFilters(searchText, filters);
    } else {
      setIsLoading(true);
      setIsEmptyState(true);
      parseFilters(searchText, filters);
    }
  };

  const handleSearchInputValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    searchInputRef.current = event.target.value;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      doNavigate(
        searchInputRef.current,
        resultRows.toString(),
        resultSort,
        "1",
        ""
      );
    }
  };

  const handleSearchClick = () => {
    doNavigate(
      searchInputRef.current,
      resultRows.toString(),
      resultSort,
      "1",
      ""
    );
  };

  const handlePaginationChange = (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    console.log("event", event);
    doNavigate(
      searchInputRef.current,
      resultRows.toString(),
      resultSort,
      value.toString(),
      resultFilters
    );
  };

  const handleResultRowsChange = (event: SelectChangeEvent) => {
    doNavigate(
      searchInputRef.current,
      event.target.value,
      resultSort,
      "1",
      resultFilters
    );
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    doNavigate(
      searchInputRef.current,
      resultRows.toString(),
      event.target.value,
      "1",
      resultFilters
    );
  };

  const handleFilterChipDelete = (value: string, parentValue: string) => {
    let filters = "";

    filters = removeFilter(parentValue, value, resultFilters);
    doNavigate(
      searchInputRef.current,
      resultRows.toString(),
      resultSort,
      "1",
      filters
    );
  };

  const handleFilterClear = () => {
    const filters = "";

    doNavigate(
      searchInputRef.current,
      resultRows.toString(),
      resultSort,
      "1",
      filters
    );
  };

  const handleExpandAll = () => {
    setAreResultsExpanded(true);
  };

  const handleCollapseAll = () => {
    setAreResultsExpanded(false);
  };

  const handleRemoveUnmatchedFiltersButtonClick = () => {
    if (unmatchedFilters && unmatchedFilters.length > 0) {
      const filtersToRemove: { value: string; name: string }[] = [];

      unmatchedFilters.forEach((filter) => {
        filtersToRemove.push({
          value: filter.parentName,
          name: filter.identifier,
        });
      });

      const filters = removeFilters(filtersToRemove, resultFilters);

      doNavigate(
        searchInputRef.current,
        resultRows.toString(),
        resultSort,
        "1",
        filters
      );
    }
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

  const removeFilters = (
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

        filters = removeFilters(filtersToDelete, resultFilters);
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
      searchInputRef.current,
      resultRows.toString(),
      resultSort,
      "1",
      filters
    );
  };

  const parseFilters = (originalSearchText: string, filters: string) => {
    const filterIdsUrl =
      solrEndpoint + "?q=" + originalSearchText + getFiltersQuery;
    const investigationsUrl = investigationNamesEndpoint;
    const instrumentsUrl = instrumentNamesEndpoint;
    const targetsUrl = targetNamesEndpoint;

    fetch(filterIdsUrl) // api for the get request
      .then((filtersResponse) => filtersResponse.json())
      .then((filterIdsData) => {
        const formattedFilterIdData =
          formatIdentifierNameResults(filterIdsData);

        fetch(investigationsUrl) // api for the get request
          .then((investigationsResponse) => investigationsResponse.json())
          .then((investigationsData) => {
            const formattedInvestigationData =
              formatIdentifierNameResults(investigationsData);

            fetch(instrumentsUrl) // api for the get request
              .then((instrumentsResponse) => instrumentsResponse.json())
              .then((instrumentsData) => {
                const formattedInstrumentsData =
                  formatIdentifierNameResults(instrumentsData);

                fetch(targetsUrl) // api for the get request
                  .then((targetsResponse) => targetsResponse.json())
                  .then((targetsData) => {
                    const formattedTargetsData =
                      formatIdentifierNameResults(targetsData);

                    doFilterMap(
                      formattedFilterIdData,
                      formattedInvestigationData,
                      formattedInstrumentsData,
                      formattedTargetsData,
                      filters
                    );
                  });
              });
          });
      });
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

  useEffect(() => {
    let searchText = params.searchText;
    if (!searchText) {
      searchText = "";
    }
    searchInputRef.current = searchText;

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

    console.log("do search");
    doSearch(searchText, start, rows, sort, filters);

    if (!params.searchText) {
      setSearchResults(null);
    }
  }, [params.searchText, searchParams]);

  const getInvestigationPath = (lid: string) => {
    lid = convertLogicalIdentifier(lid, LID_FORMAT.URL_FRIENDLY);
    const params = {
      lid,
    };
    return generatePath("/investigations/:lid/data", params);
  };

  const getInstrumentPath = (lid: string) => {
    lid = convertLogicalIdentifier(lid, LID_FORMAT.URL_FRIENDLY);
    const params = {
      lid,
    };
    return generatePath("/instruments/:lid/data", params);
  };

  const getDataBundlePath = (location: string) => {
    return pdsSite + location;
  };

  const getDoiPath = (doi: string) => {
    return doiSite + "/" + doi;
  };

  const getDataCollectionPath = (location: string) => {
    return pdsSite + location;
  };

  const getTargetPath = (identifier: string) => {
    return pdsIdViewer + identifier;
  };

  const getResourcePath = (identifier: string) => {
    return pdsIdViewer + identifier;
  };

  const getDataSetPath = (identifier: string) => {
    return pdsIdViewer + identifier;
  };

  const getFacilityPath = (identifier: string) => {
    return pdsIdViewer + identifier;
  };

  const getTelescopePath = (identifier: string) => {
    return pdsIdViewer + identifier;
  };

  const getInstrumentHostPath = (identifier: string) => {
    return pdsIdViewer + identifier;
  };

  return (
    <>
      <DocumentMeta
        title={"Search"}
        description={"Planetary Data System Search Page"}
      />
      <StyledEngineProvider injectFirst>
        <Container maxWidth={false} disableGutters sx={{ textAlign: "left" }}>
          {/* Result Counter & Search Bar*/}
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
                    marginBottom: "18px",
                    marginTop: "2px",
                    paddingY: "3px",
                    paddingX: "5px",
                    borderRadius: "3px",
                    width: "fit-content",
                  }}
                >
                  <RouterLink to="/" style={linkStyles}>
                    Home
                  </RouterLink>
                  <Typography variant="h6" weight="regular" component={"span"}>
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
                {searchResults && searchResults.response.numFound > 0 ? (
                  <Box>
                    <Typography variant="h3" weight="bold">
                      Showing results for{" "}
                      <Box
                        component="span"
                        className="resultsCounterInputValue"
                      >
                        {ellipsisText(
                          searchResults.responseHeader.params.q,
                          20
                        )}
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
                    inputRef={searchInputRef}
                    defaultValue={params.searchText ? params.searchText : ""}
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

          {isLoading ? (
            <Box className="pds-search-loader-container">
              <Loader />
            </Box>
          ) : (
            <>
              {/*Search Options*/}
              {searchResults && searchResults.response.numFound > 0 ? (
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
                      onClick={handleExpandAll}
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
                      onClick={handleCollapseAll}
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
              )}

              {/* Search Results Content */}
              {searchResults || isEmptyState ? (
                <Container
                  maxWidth={"xl"}
                  sx={{
                    paddingY: "24px",
                  }}
                >
                  {/*Results Label */}
                  {(searchResults && searchResults.response.numFound > 0) ||
                  (searchResults && resultFilters.length > 0) ? (
                    <Box
                      sx={{
                        display: { xs: "none", md: "block" },
                      }}
                    >
                      <Grid
                        container
                        spacing={4}
                        columns={{ xs: 3, sm: 8, md: 12 }}
                        className="pds-search-results-labels"
                      >
                        <Grid item xs={3} sm={3} md={3}>
                          <Typography variant="h5" weight="semibold">
                            {resultFilters.length > 0
                              ? "Active Filters"
                              : "Filters"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                          {searchResults.response.numFound === 0 &&
                          resultFilters.length > 0 ? (
                            <></>
                          ) : (
                            <Typography variant="h5" weight="semibold">
                              Results
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={2} sm={2} md={2}>
                          {searchResults.response.numFound === 0 &&
                          resultFilters.length > 0 ? (
                            <></>
                          ) : (
                            <Typography
                              variant="h5"
                              weight="semibold"
                              className="pds-search-page-type-label"
                            >
                              Page Type
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <></>
                  )}

                  {(searchResults && searchResults.response.numFound > 0) ||
                  (searchResults && resultFilters.length > 0) ||
                  isEmptyState ? (
                    <Grid
                      container
                      spacing={4}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      <Grid item xs={12} sm={12} md={3}>
                        <Typography variant="h6" weight="regular">
                          <Filters
                            filters={parsedFilters}
                            onChecked={handleFilterChecked}
                            onFilterChipDelete={handleFilterChipDelete}
                            onFilterClear={handleFilterClear}
                            collapseAll={isSmallScreen}
                          ></Filters>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12} md={9}>
                        {searchResults &&
                        searchResults.response.docs.length > 0 ? (
                          searchResults.response.docs.map((doc) => (
                            <Box>
                              {getDocType(doc) === "databundle" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.description ? doc.description[0] : "-"
                                  }
                                  primaryLink={
                                    doc.resLocation
                                      ? getDataBundlePath(doc.resLocation[0])
                                      : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Data Bundle",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    doi={
                                      doc.citation_doi
                                        ? {
                                            value: doc.citation_doi[0],
                                            link: getDoiPath(
                                              doc.citation_doi[0]
                                            ),
                                          }
                                        : { value: "-" }
                                    }
                                    investigation={
                                      doc.investigation_name
                                        ? {
                                            value: doc.investigation_name[0],
                                            link: doc.investigation_ref
                                              ? getInvestigationPath(
                                                  doc.investigation_ref[0]
                                                )
                                              : "/",
                                          }
                                        : { value: "-" }
                                    }
                                    processingLevel={
                                      doc.primary_result_processing_level
                                        ? doc.primary_result_processing_level
                                        : ["-"]
                                    }
                                    lid={{
                                      value: doc.identifier[0],
                                      link: doc.resLocation
                                        ? getDataBundlePath(doc.resLocation[0])
                                        : "/",
                                    }}
                                    startDate={
                                      doc.observation_start_date_time
                                        ? {
                                            value:
                                              doc
                                                .observation_start_date_time[0],
                                          }
                                        : { value: "-" }
                                    }
                                    stopDate={
                                      doc.observation_stop_date_time
                                        ? {
                                            value:
                                              doc.observation_stop_date_time[0],
                                          }
                                        : { value: "-" }
                                    }
                                    disciplineName={
                                      doc.primary_result_purpose
                                        ? doc.primary_result_purpose
                                        : ["-"]
                                    }
                                    variant={
                                      FeaturedLinkDetailsVariant.DATA_BUNDLE
                                    }
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "datacollection" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.description ? doc.description[0] : "-"
                                  }
                                  primaryLink={
                                    doc.resLocation
                                      ? getDataCollectionPath(
                                          doc.resLocation[0]
                                        )
                                      : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Data Collection",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    doi={
                                      doc.citation_doi
                                        ? {
                                            value: doc.citation_doi[0],
                                            link: getDoiPath(
                                              doc.citation_doi[0]
                                            ),
                                          }
                                        : { value: "-" }
                                    }
                                    investigation={
                                      doc.investigation_name
                                        ? {
                                            value: doc.investigation_name[0],
                                            link: doc.investigation_ref
                                              ? getInvestigationPath(
                                                  doc.investigation_ref[0]
                                                )
                                              : "/",
                                          }
                                        : { value: "-" }
                                    }
                                    disciplineName={
                                      doc.primary_result_discipline_name
                                        ? doc.primary_result_discipline_name
                                        : ["-"]
                                    }
                                    processingLevel={
                                      doc.primary_result_processing_level
                                        ? doc.primary_result_processing_level
                                        : ["-"]
                                    }
                                    lid={{
                                      value: doc.identifier[0],
                                      link: doc.resLocation
                                        ? getDataBundlePath(doc.resLocation[0])
                                        : "/",
                                    }}
                                    startDate={
                                      doc.observation_start_date_time
                                        ? {
                                            value:
                                              doc
                                                .observation_start_date_time[0],
                                          }
                                        : { value: "-" }
                                    }
                                    stopDate={
                                      doc.observation_stop_date_time
                                        ? {
                                            value:
                                              doc.observation_stop_date_time[0],
                                          }
                                        : { value: "-" }
                                    }
                                    variant={
                                      FeaturedLinkDetailsVariant.DATA_COLLECTION
                                    }
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "dataset" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.description ? doc.description[0] : "-"
                                  }
                                  primaryLink={
                                    doc.identifier
                                      ? getDataSetPath(doc.identifier[0])
                                      : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Data Set",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    disciplineName={
                                      doc.instrument_type
                                        ? doc.instrument_type
                                        : ["-"]
                                    }
                                    doi={
                                      doc.citation_doi
                                        ? {
                                            value: doc.citation_doi[0],
                                            link: getDoiPath(
                                              doc.citation_doi[0]
                                            ),
                                          }
                                        : { value: "-" }
                                    }
                                    investigation={
                                      doc.investigation_name &&
                                      doc.investigation_ref
                                        ? {
                                            value: doc.investigation_name[0],
                                            link: doc.investigation_ref
                                              ? getInvestigationPath(
                                                  doc.investigation_ref[0]
                                                )
                                              : "/",
                                          }
                                        : doc.investigation_name &&
                                          !doc.investigation_ref
                                        ? { value: doc.investigation_name[0] }
                                        : { value: "-" }
                                    }
                                    processingLevel={
                                      doc.primary_result_processing_level
                                        ? doc.primary_result_processing_level
                                        : ["-"]
                                    }
                                    target={
                                      doc["form-target"]
                                        ? { value: doc["form-target"][0] }
                                        : { value: "-" }
                                    }
                                    variant={
                                      FeaturedLinkDetailsVariant.DATA_SET
                                    }
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "facility" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.facility_description
                                      ? doc.facility_description[0]
                                      : "-"
                                  }
                                  primaryLink={
                                    doc.identifier
                                      ? getFacilityPath(doc.identifier[0])
                                      : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Facility",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    variant={
                                      FeaturedLinkDetailsVariant.FACILITY
                                    }
                                    country={
                                      doc.facility_country
                                        ? doc.facility_country
                                        : ["-"]
                                    }
                                    lid={{
                                      value: doc.identifier[0],
                                      link: doc.identifier
                                        ? getFacilityPath(doc.identifier[0])
                                        : "/",
                                    }}
                                    telescopes={["-"]}
                                    type={
                                      doc.facility_type
                                        ? doc.facility_type
                                        : ["-"]
                                    }
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "instrument" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.instrument_description
                                      ? doc.instrument_description[0]
                                      : doc.description
                                      ? doc.description[0]
                                      : "-"
                                  }
                                  primaryLink={
                                    doc.identifier
                                      ? getInstrumentPath(doc.identifier[0])
                                      : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Instrument",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    variant={
                                      FeaturedLinkDetailsVariant.INSTRUMENT
                                    }
                                    lid={{
                                      value: doc.identifier[0],
                                      link: doc.identifier
                                        ? getInstrumentPath(doc.identifier[0])
                                        : "/",
                                    }}
                                    investigation={
                                      doc["form-instrument-host"]
                                        ? {
                                            value:
                                              doc["form-instrument-host"][0],
                                          }
                                        : { value: "-" }
                                    }
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "instrument_host" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.instrument_host_description
                                      ? doc.instrument_host_description[0]
                                      : doc.description
                                      ? doc.description[0]
                                      : "-"
                                  }
                                  primaryLink={
                                    doc.identifier
                                      ? getInstrumentHostPath(doc.identifier[0])
                                      : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Instrument Host",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    variant={
                                      FeaturedLinkDetailsVariant.INSTRUMENT_HOST
                                    }
                                    lid={{
                                      value: doc.identifier[0],
                                      link: doc.identifier
                                        ? getInstrumentHostPath(
                                            doc.identifier[0]
                                          )
                                        : "/",
                                    }}
                                    investigation={
                                      doc.investigation_name
                                        ? {
                                            value: doc.investigation_name[0],
                                            link: doc.investigation_ref
                                              ? getInvestigationPath(
                                                  doc.investigation_ref[0]
                                                )
                                              : "/",
                                          }
                                        : { value: "-" }
                                    }
                                    instruments={
                                      doc.instrument_name
                                        ? doc.instrument_name
                                        : ["-"]
                                    }
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "investigation" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.investigation_description
                                      ? doc.investigation_description[0]
                                      : doc.instrument_host_description
                                      ? doc.instrument_host_description[0]
                                      : doc.description
                                      ? doc.description[0]
                                      : "-"
                                  }
                                  primaryLink={
                                    doc.identifier
                                      ? getInvestigationPath(doc.identifier[0])
                                      : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Investigation",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    variant={
                                      FeaturedLinkDetailsVariant.INVESTIGATION
                                    }
                                    instrumentHostTitles={
                                      doc.instrument_host_name
                                        ? doc.instrument_host_name
                                        : ["-"]
                                    }
                                    lid={{
                                      value: doc.identifier[0],
                                      link: doc.identifier
                                        ? getInvestigationPath(
                                            doc.identifier[0]
                                          )
                                        : "/",
                                    }}
                                    startDate={
                                      doc.investigation_start_date
                                        ? {
                                            value:
                                              doc.investigation_start_date[0],
                                          }
                                        : { value: "-" }
                                    }
                                    stopDate={
                                      doc.investigation_stop_date
                                        ? {
                                            value:
                                              doc.investigation_stop_date[0],
                                          }
                                        : { value: "-" }
                                    }
                                    investigationType={
                                      doc.investigation_type
                                        ? doc.investigation_type
                                        : ["-"]
                                    }
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "resource" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.description ? doc.description[0] : "-"
                                  }
                                  primaryLink={
                                    doc.identifier
                                      ? getResourcePath(doc.identifier[0])
                                      : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Resource",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    variant={
                                      FeaturedLinkDetailsVariant.RESOURCE
                                    }
                                    format={{ value: "" }}
                                    size={{ value: doc.file_ref_size[0] }}
                                    version={{ value: doc.version_id[0] }}
                                    year={{
                                      value: doc.citation_publication_year[0],
                                    }}
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "target" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.description ? doc.description[0] : "-"
                                  }
                                  primaryLink={
                                    doc.identifier
                                      ? getTargetPath(doc.identifier[0])
                                      : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Target",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    lid={{
                                      value: doc.identifier[0],
                                      link: doc.identifier
                                        ? getTargetPath(doc.identifier[0])
                                        : "/",
                                    }}
                                    targetType={
                                      doc.target_type ? doc.target_type : ["-"]
                                    }
                                    variant={FeaturedLinkDetailsVariant.TARGET}
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "telescope" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.telescope_description
                                      ? doc.telescope_description[0]
                                      : "-"
                                  }
                                  primaryLink={
                                    doc.identifier
                                      ? getTelescopePath(doc.identifier[0])
                                      : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Telescope",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    lid={{
                                      value: doc.identifier[0],
                                      link: doc.identifier
                                        ? getTelescopePath(doc.identifier[0])
                                        : "/",
                                    }}
                                    instruments={
                                      doc.telescope_aperture
                                        ? doc.telescope_aperture
                                        : ["-"]
                                    }
                                    facility={["-"]}
                                    variant={
                                      FeaturedLinkDetailsVariant.TELESCOPE
                                    }
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "tool" ? (
                                <FeaturedLink
                                  title={doc.title}
                                  description={
                                    doc.description ? doc.description[0] : "-"
                                  }
                                  primaryLink={
                                    doc.service_url ? doc.service_url[0] : "/"
                                  }
                                  startExpanded={areResultsExpanded}
                                  columns={[
                                    {
                                      horizontalAlign: "center",
                                      data: "Tool",
                                      verticalAlign: "center",
                                      width: 1,
                                    },
                                  ]}
                                >
                                  <FeaturedLinkDetails
                                    support={
                                      doc.pds_model_version
                                        ? { value: doc.pds_model_version }
                                        : { value: "-" }
                                    }
                                    url={
                                      doc.service_url
                                        ? {
                                            value: doc.service_url[0],
                                            link: doc.service_url[0],
                                          }
                                        : { value: "-" }
                                    }
                                    categories={
                                      doc.service_category
                                        ? doc.service_category
                                        : ["-"]
                                    }
                                    version={
                                      doc.version_id
                                        ? { value: doc.version_id[0] }
                                        : { value: "-" }
                                    }
                                    variant={FeaturedLinkDetailsVariant.TOOL}
                                  />
                                </FeaturedLink>
                              ) : (
                                <></>
                              )}

                              {getDocType(doc) === "" ? (
                                <Box>
                                  <p>
                                    This doc type is not supported: {doc.title}.
                                    product_class: {doc.product_class}.
                                    data_class: {doc.data_class}.{" "}
                                  </p>
                                </Box>
                              ) : (
                                <></>
                              )}
                            </Box>
                          ))
                        ) : searchResults ? (
                          <Box className="pds-search-empty-container">
                            <br />
                            <Typography
                              variant="h3"
                              weight="bold"
                              className="pds-search-empty-icon-div"
                            >
                              <IconSearch />
                              &nbsp;No Results Found.
                            </Typography>
                            <br />

                            <Typography variant="h4" weight="regular">
                              You may want to try using different keywords,
                              checking for typos, or adjusting your filters.
                            </Typography>

                            {unmatchedFilters && unmatchedFilters.length > 0 ? (
                              <Typography variant="h4" weight="regular">
                                Filters{" "}
                                {unmatchedFilters.map(
                                  (filter) => filter.name + ", "
                                )}{" "}
                                are not related to your query.{" "}
                                <MuiButton
                                  onClick={
                                    handleRemoveUnmatchedFiltersButtonClick
                                  }
                                >
                                  Click here
                                </MuiButton>{" "}
                                to remove them.
                              </Typography>
                            ) : (
                              <></>
                            )}

                            <br />
                            <Typography variant="h4" weight="regular">
                              Not the results you expected?{" "}
                              <a href={feedbackEmail} target="_top">
                                Give feedback
                              </a>
                            </Typography>
                          </Box>
                        ) : (
                          <Box className="pds-search-empty-container">
                            <br />
                            <Typography
                              variant="h3"
                              weight="bold"
                              className="pds-search-empty-icon-div"
                            >
                              <IconSearch />
                              &nbsp;Start a search
                            </Typography>
                            <Typography variant="h4" weight="regular">
                              Start by using the search box or by selecting
                              filters to see relevant results.
                            </Typography>
                            <br />
                            <Typography variant="h4" weight="regular">
                              How can we improve your search experience?{" "}
                              <a href={feedbackEmail} target="_top">
                                Give feedback
                              </a>
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  ) : (
                    <></>
                  )}
                </Container>
              ) : (
                <></>
              )}
              {searchResults &&
              searchResults.response.numFound === 0 &&
              resultFilters.length === 0 ? (
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
                      &nbsp;No matching results found
                    </Typography>
                    <Typography variant="h4" weight="regular">
                      You may want to try using different keywords, checking for
                      typos, or adjusting your filters.
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
              ) : (
                <></>
              )}
              {searchResults && searchResults.response.numFound > 0 ? (
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
            </>
          )}
        </Container>
      </StyledEngineProvider>
    </>
  );
};

export default SearchPage;
