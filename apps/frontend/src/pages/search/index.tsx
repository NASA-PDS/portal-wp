import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import {
  IdentifierNameDoc,
  SolrSearchResponse,
  SolrIdentifierNameResponse,
  SearchResultDoc,
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
  FeaturedLink,
  FeaturedLinkDetails,
  FeaturedLinkDetailsVariant,
} from "@nasapds/wds-react";

import "./search.css";

const feedbackEmail = "mailto:example@example.com";
const solrEndpoint = "https://pds.nasa.gov/services/search/search";
const getFiltersQuery =
  "&rows=0&facet=on&facet.field=investigation_ref&facet.field=instrument_ref&facet.field=target_ref&wt=json&facet.limit=-1";
const filterDefault =
  "&fq=-product_class:Product_Attribute_Definition&fq=-product_class:Product_Class_Definition&fq=-product_class:Product_Target_PDS3&fq=-product_class:Product_Instrument_PDS3&fq=-product_class:Product_Instrument_Host_PDS3&fq=-product_class:Product_Mission_PDS3&fq=-collection_type:schema&fq=-data_class:resource";
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

  const [areResultsExpanded, setAreResultsExpanded] = useState(false);

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

  const mapFilterIdsToName = (ids: string[], names: IdentifierNameDoc[]) => {
    const filtersMap: { name: string; identifier: string }[] = [];
    const notFoundfiltersMap: string[] = [];

    ids.forEach((id, index) => {
      if (index % 2 == 0) {
        const urnSplit = id.split("::")[0];
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
            identifier: id,
          });
        } else {
          notFoundfiltersMap.push(urnSplit);
        }
      }
    });

    console.log("filters with no matching name", notFoundfiltersMap);
    return filtersMap;
  };

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

    setPropsForFilter(
      investigationFilterOptions,
      instrumentFilterOptions,
      targetFilterOptions,
      originalFilters
    );
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
      start +
      filterDefault;

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

  const handleFilterChipDelete = (value: string, parentValue: string) => {
    let filters = "";

    filters = removeFilter(parentValue, value, resultFilters);
    doNavigate(
      searchInputValue,
      resultRows.toString(),
      resultSort,
      "1",
      filters
    );
  };

  const handleFilterClear = () => {
    const filters = "";

    doNavigate(
      searchInputValue,
      resultRows.toString(),
      resultSort,
      "1",
      filters
    );
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

  const getDocType = (doc: SearchResultDoc) => {
    let docType = "";
    if (doc.product_class) {
      if (doc.product_class[0].toLowerCase() === "product_data_set_pds3") {
        docType = "dataset";
      }
      if (doc.product_class[0].toLowerCase() === "product_bundle") {
        docType = "databundle";
      }
      if (doc.product_class[0].toLowerCase() === "product_collection") {
        if (doc.collection_type) {
          if (doc.collection_type[0] !== "document") {
            docType = "datacollection";
          }
        } else {
          docType = "datacollection";
        }
      }
      if (doc.product_class[0].toLowerCase() === "product_service") {
        docType = "tool";
      }
      /*
      if (
        doc.product_class[0].toLowerCase() === "product_document" ||
        (doc.collection_type &&
          doc.collection_type[0].toLowerCase() === "document")
      ) {
        docType = "resource";
      }
      */
      if (doc.product_class[0].toLowerCase() === "product_context") {
        if (
          doc.data_class &&
          doc.data_class[0].toLowerCase() === "investigation"
        ) {
          docType = "investigation";
        }
        if (
          doc.data_class &&
          doc.data_class[0].toLowerCase() === "instrument"
        ) {
          docType = "instrument";
        }
        if (doc.data_class && doc.data_class[0].toLowerCase() === "target") {
          docType = "target";
        }
        /*
        if (
          doc.data_class &&
          doc.data_class[0].toLowerCase() === "instrument_host"
        ) {
          docType = "investigation";
        }
        */
      }
    }
    return docType;
  };

  const handleExpandAll = () => {
    setAreResultsExpanded(true);
  };

  const handleCollapseAll = () => {
    setAreResultsExpanded(false);
  };

  return (
    <>
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
                {searchResults && searchResults.response.numFound > 0 ? (
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
          {searchResults ? (
            <Container
              maxWidth={"xl"}
              sx={{
                paddingY: "24px",
              }}
            >
              {/*Results Label */}
              {searchResults.response.numFound > 0 ||
              resultFilters.length > 0 ? (
                <Grid
                  container
                  spacing={4}
                  columns={{ xs: 3, sm: 8, md: 12 }}
                  className="pds-search-results-labels"
                >
                  <Grid item xs={3} sm={3} md={3}>
                    <Typography variant="h5" weight="semibold">
                      {resultFilters.length > 0 ? "Active Filters" : "Filters"}
                    </Typography>
                  </Grid>
                  <Grid item xs={7} sm={7} md={7}>
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
                      <Typography variant="h5" weight="semibold">
                        Page Type
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}

              {searchResults.response.numFound > 0 ||
              resultFilters.length > 0 ? (
                <Grid container spacing={4} columns={{ xs: 3, sm: 8, md: 12 }}>
                  <Grid item xs={3} sm={3} md={3}>
                    <Typography variant="h6" weight="regular">
                      <Filters
                        filters={parsedFilters}
                        onChecked={handleFilterChecked}
                        onFilterChipDelete={handleFilterChipDelete}
                        onFilterClear={handleFilterClear}
                      ></Filters>
                    </Typography>
                  </Grid>
                  <Grid item xs={9} sm={9} md={9}>
                    {searchResults.response.docs.length > 0 ? (
                      searchResults.response.docs.map((doc, index) => (
                        <Box>
                          {getDocType(doc) === "investigation" ? (
                            <FeaturedLink
                              title={doc.title}
                              description={
                                doc.investigation_description
                                  ? doc.investigation_description[0]
                                  : doc.instrument_host_description
                                  ? doc.instrument_host_description[0]
                                  : "-"
                              }
                              primaryLink="/"
                              startExpanded={areResultsExpanded}
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
                                lid={{ value: doc.identifier }}
                                startDate={
                                  doc.investigation_start_date
                                    ? { value: doc.investigation_start_date[0] }
                                    : { value: "-" }
                                }
                                stopDate={
                                  doc.investigation_stop_date
                                    ? { value: doc.investigation_stop_date[0] }
                                    : { value: "-" }
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
                                  : "-"
                              }
                              primaryLink="/"
                              startExpanded={areResultsExpanded}
                            >
                              <FeaturedLinkDetails
                                variant={FeaturedLinkDetailsVariant.INSTRUMENT}
                                instrumentType={
                                  doc["form-instrument-type"]
                                    ? doc["form-instrument-type"]
                                    : ["-"]
                                }
                                lid={{ value: doc.identifier }}
                                startDate={{ value: "-" }}
                                stopDate={{ value: "-" }}
                                investigation={
                                  doc["form-instrument-host"]
                                    ? { value: doc["form-instrument-host"][0] }
                                    : { value: "-" }
                                }
                              />
                            </FeaturedLink>
                          ) : (
                            <></>
                          )}

                          {getDocType(doc) === "databundle" ? (
                            <FeaturedLink
                              title={doc.title}
                              description={
                                doc.description ? doc.description[0] : "-"
                              }
                              primaryLink="/"
                              startExpanded={areResultsExpanded}
                            >
                              <FeaturedLinkDetails
                                doi={
                                  doc.citation_doi
                                    ? { value: doc.citation_doi[0] }
                                    : { value: "-" }
                                }
                                investigation={
                                  doc["form-investigation"]
                                    ? { value: doc["form-investigation"][0] }
                                    : { value: "-" }
                                }
                                instrumentType={[""]}
                                processingLevel={
                                  doc.primary_result_processing_level
                                    ? {
                                        value:
                                          doc
                                            .primary_result_processing_level[0],
                                      }
                                    : { value: "-" }
                                }
                                lid={{ value: doc.identifier }}
                                startDate={
                                  doc.observation_start_date_time
                                    ? {
                                        value:
                                          doc.observation_start_date_time[0],
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
                                variant={FeaturedLinkDetailsVariant.DATA_BUNDLE}
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
                              primaryLink="/"
                              startExpanded={areResultsExpanded}
                            >
                              <FeaturedLinkDetails
                                doi={{ value: doc.search_id }}
                                investigation={
                                  doc.investigation_name
                                    ? { value: doc.investigation_name[0] }
                                    : { value: "-" }
                                }
                                disciplineName={
                                  doc.primary_result_discipline_name
                                    ? {
                                        value:
                                          doc.primary_result_discipline_name[0],
                                      }
                                    : { value: "-" }
                                }
                                processingLevel={
                                  doc.primary_result_processing_level
                                    ? {
                                        value:
                                          doc
                                            .primary_result_processing_level[0],
                                      }
                                    : { value: "-" }
                                }
                                lid={{ value: doc.identifier }}
                                startDate={
                                  doc.observation_start_date_time
                                    ? {
                                        value:
                                          doc.observation_start_date_time[0],
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

                          {getDocType(doc) === "target" ? (
                            <FeaturedLink
                              title={doc.title}
                              description={
                                doc.target_description
                                  ? doc.target_description[0]
                                  : "-"
                              }
                              primaryLink="/"
                              startExpanded={areResultsExpanded}
                            >
                              <FeaturedLinkDetails
                                lid={{ value: doc.identifier }}
                                targetType={
                                  doc.target_type ? doc.target_type : ["-"]
                                }
                                variant={FeaturedLinkDetailsVariant.TARGET}
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
                              primaryLink="/"
                              startExpanded={areResultsExpanded}
                            >
                              <FeaturedLinkDetails
                                support={
                                  doc.pds_model_version
                                    ? { value: doc.pds_model_version }
                                    : { value: "-" }
                                }
                                url={
                                  doc.service_url
                                    ? { value: doc.service_url[0] }
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

                          {getDocType(doc) === "resource" ? (
                            <FeaturedLink
                              title={doc.title}
                              description={
                                doc.description ? doc.description[0] : "-"
                              }
                              primaryLink="/"
                              startExpanded={areResultsExpanded}
                            >
                              <FeaturedLinkDetails
                                variant={FeaturedLinkDetailsVariant.RESOURCE}
                                format={{ value: "" }}
                                size={{ value: "" }}
                                version={{ value: "" }}
                                year={{ value: "" }}
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
                              primaryLink="/"
                              startExpanded={areResultsExpanded}
                            >
                              <FeaturedLinkDetails
                                disciplineName={{ value: "?????" }}
                                doi={{ value: doc.search_id }}
                                investigation={
                                  doc.investigation_name
                                    ? { value: doc.investigation_name[0] }
                                    : { value: "-" }
                                }
                                processingLevel={{ value: "?????" }}
                                target={
                                  doc["form-target"]
                                    ? { value: doc["form-target"][0] }
                                    : { value: "-" }
                                }
                                variant={FeaturedLinkDetailsVariant.DATA_SET}
                              />
                            </FeaturedLink>
                          ) : (
                            <></>
                          )}

                          {getDocType(doc) === "" ? (
                            <Box>
                              <p>
                                This doc type is not supported: {doc.title}.
                                product_class: {doc.product_class}. data_class:{" "}
                                {doc.data_class}.{" "}
                              </p>
                            </Box>
                          ) : (
                            <></>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Box className="pds-search-empty-container">
                        <br />
                        <Typography variant="h3" weight="bold">
                          No Results Found
                        </Typography>
                        <Typography variant="h4" weight="regular">
                          You may want to try using different keywords, checking
                          for typos, or adjusting your filters
                        </Typography>
                        <br />
                        <Typography variant="h4" weight="regular">
                          Not the results you expected?{" "}
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
        </Container>
      </StyledEngineProvider>
    </>
  );
};

export default SearchPage;
