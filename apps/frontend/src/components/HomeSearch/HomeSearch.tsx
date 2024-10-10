import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Grid,
  InputAdornment,
  ListSubheader,
} from "@mui/material";
import {
  Button,
  Chip,
  IconSearch,
  IconChevronDown,
  TextField,
  Typography,
} from "@nasapds/wds-react";
import {
  IdentifierNameDoc,
  SolrIdentifierNameResponse,
} from "../../types/solrSearchResponse";
import {
  createSearchParams,
  generatePath,
  useNavigate,
} from "react-router-dom";
import {
  mapFilterIdsToName,
  mapPageType,
} from "../../pages/search/searchUtils";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import "./HomeSearch.scss";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  autoFocus: false,
  PaperProps: {
    sx: {
      paddingTop: 0,
      maxHeight: ITEM_HEIGHT * 8.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  sx: {
    "& .MuiMenu-paper": {
      "& .MuiList-root": {
        paddingTop: 0,
      },
    },
  },
};

const solrEndpoint = "https://pds.nasa.gov/services/search/search";
const getFiltersQuery =
  solrEndpoint +
  "?q=*&qt=keyword&rows=0&facet=on&facet.field=investigation_ref&facet.field=instrument_ref&facet.field=target_ref&facet.field=page_type&wt=json&facet.limit=-1";
const investigationNamesEndpoint =
  solrEndpoint +
  "?wt=json&qt=keyword&q=data_class:Investigation&fl=investigation_name,identifier&rows=10000";
const instrumentNamesEndpoint =
  solrEndpoint +
  "?wt=json&qt=keyword&q=data_class:Instrument&fl=instrument_name,identifier&rows=10000";
const targetNamesEndpoint =
  solrEndpoint +
  "?wt=json&qt=keyword&q=data_class:Target&fl=target_name,identifier&rows=10000";

type Filter = {
  name: string;
  value: string;
};

type SelectedFilter = {
  name: string;
  value: string;
  parentFilterName: string;
};

export const HomeSearch = () => {
  const searchInputRef = useRef("");
  const navigate = useNavigate();

  const [allTargetFilters, setAllTargetFilters] = useState<Filter[]>([]);
  const [allInvestigationFilters, setAllInvestigationFilters] = useState<
    Filter[]
  >([]);
  const [allInstrumentFilters, setAllInstrumentFilters] = useState<Filter[]>(
    []
  );
  const [allPageTypeFilters, setAllPageTypeFilters] = useState<Filter[]>([]);

  const [targetFilters, setTargetFilters] = useState<Filter[]>([]);
  const [investigationFilters, setInvestigationFilters] = useState<Filter[]>(
    []
  );
  const [instrumentFilters, setInstrumentFilters] = useState<Filter[]>([]);
  const [pageTypeFilters, setPageTypeFilters] = useState<Filter[]>([]);

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);

  const [selectedTargetFilters, setSelectedTargetFilters] = useState<string[]>([
    "all",
  ]);
  const [selectedInvestigationFilters, setSelectedInvestigationFilters] =
    useState<string[]>(["all"]);
  const [selectedInstrumentFilters, setSelectedInstrumentFilters] = useState<
    string[]
  >(["all"]);
  const [selectedPageTypeFilters, setSelectedPageTypeFilters] = useState<
    string[]
  >(["all"]);

  const [targetSubFilter, setTargetSubFilter] = useState("");
  const [investigationSubFilter, setInvestigationSubFilter] = useState("");
  const [instrumentSubFilter, setInstrumentSubFilter] = useState("");
  const [pageTypeSubFilter, setPageTypeSubFilter] = useState("");

  const getFilterName = (identifier: string, parentName: string) => {
    let filterName = "";

    if (parentName === "targets") {
      filterName = allTargetFilters.filter((filter) =>
        filter.value.toLowerCase().includes(identifier)
      )[0].name;
    }
    if (parentName === "instruments") {
      filterName = allInstrumentFilters.filter((filter) =>
        filter.value.toLowerCase().includes(identifier)
      )[0].name;
    }
    if (parentName === "investigations") {
      filterName = allInvestigationFilters.filter((filter) =>
        filter.value.toLowerCase().includes(identifier)
      )[0].name;
    }
    if (parentName === "page_type") {
      filterName = allPageTypeFilters.filter((filter) =>
        filter.value.toLowerCase().includes(identifier)
      )[0].name;
    }

    return filterName;
  };

  const getUpdatedFilters = (filterName: string, matchString: string) => {
    let updatedFilters: Filter[] = [];
    matchString = matchString.toLowerCase();

    if (filterName === "targets") {
      updatedFilters = allTargetFilters.filter((filter) =>
        filter.name.toLowerCase().includes(matchString)
      );
    }
    if (filterName === "instruments") {
      updatedFilters = allInstrumentFilters.filter((filter) =>
        filter.name.toLowerCase().includes(matchString)
      );
    }
    if (filterName === "investigations") {
      updatedFilters = allInvestigationFilters.filter((filter) =>
        filter.name.toLowerCase().includes(matchString)
      );
    }
    if (filterName === "page_type") {
      updatedFilters = allPageTypeFilters.filter((filter) =>
        filter.name.toLowerCase().includes(matchString)
      );
    }

    return updatedFilters;
  };

  const resetTargetFilters = () => {
    setTargetFilters(allTargetFilters);
  };

  const resetInvestigationFilters = () => {
    setInvestigationFilters(allInvestigationFilters);
  };

  const resetInstrumentFilters = () => {
    setInstrumentFilters(allInstrumentFilters);
  };

  const resetPageTypeFilters = () => {
    setPageTypeFilters(allPageTypeFilters);
  };

  const onTargetSubFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTargetSubFilter(value);

    if (value.length > 1) {
      const updatedFilters = getUpdatedFilters("targets", value);
      setTargetFilters(updatedFilters);
    }
    if (value.length === 0) {
      resetTargetFilters();
    }
  };

  const onInvestigationSubFilterChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setInvestigationSubFilter(event.target.value);

    if (value.length > 1) {
      const updatedFilters = getUpdatedFilters("investigations", value);
      setInvestigationFilters(updatedFilters);
    }
    if (value.length === 0) {
      resetInvestigationFilters();
    }
  };

  const onInstrumentSubFilterChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setInstrumentSubFilter(value);

    if (value.length > 1) {
      const updatedFilters = getUpdatedFilters("instruments", value);
      setInstrumentFilters(updatedFilters);
    }
    if (value.length === 0) {
      resetInstrumentFilters();
    }
  };

  const onPageTypeSubFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPageTypeSubFilter(value);

    if (value.length > 1) {
      const updatedFilters = getUpdatedFilters("page_type", value);
      setPageTypeFilters(updatedFilters);
    }
    if (value.length === 0) {
      resetPageTypeFilters();
    }
  };

  const handleFilterChange = (value: string[], parentFilterName: string) => {
    if (value.includes("all")) {
      if (value[value.length - 1] === "all") {
        value = ["all"];
      } else if (value[value.length - 1] !== "all") {
        const index = value.indexOf("all");
        if (index > -1) {
          value.splice(index, 1);
        }
      }
    } else {
      if (value.length === 0) {
        value = ["all"];
      }
    }

    if (parentFilterName === "targets") {
      setSelectedTargetFilters(value);
    }
    if (parentFilterName === "investigations") {
      setSelectedInvestigationFilters(value);
    }
    if (parentFilterName === "instruments") {
      setSelectedInstrumentFilters(value);
    }
    if (parentFilterName === "page_type") {
      setSelectedPageTypeFilters(value);
    }

    const filtersToAdd: SelectedFilter[] = [];
    value.forEach((val) => {
      if (val !== "all") {
        const matches = selectedFilters.filter(
          (filter) =>
            filter.value == val && filter.parentFilterName === parentFilterName
        );
        if (matches.length === 0) {
          filtersToAdd.push({
            name: "",
            value: val,
            parentFilterName: parentFilterName,
          });
        }
      }
    });

    const newSelectedFilters = selectedFilters.filter(() => true);
    filtersToAdd.forEach((filter) => {
      newSelectedFilters.push(filter);
    });

    const filtersToRemove: SelectedFilter[] = [];
    newSelectedFilters.forEach((filter) => {
      if (filter.parentFilterName === parentFilterName) {
        if (!value.includes(filter.value)) {
          filtersToRemove.push(filter);
        }
      }
    });

    filtersToRemove.forEach((filter) => {
      const index = newSelectedFilters.indexOf(filter);
      if (index > -1) {
        newSelectedFilters.splice(index, 1);
      }
    });

    setSelectedFilters(newSelectedFilters);
  };

  const handleTargetFilterChange = (
    event: SelectChangeEvent<typeof selectedTargetFilters>
  ) => {
    let value = event.target.value;
    const name = event.target.name;

    if (typeof value === "string") {
      value = value.split(",");
    }

    handleFilterChange(value, name);
  };

  const handleInvestigationFilterChange = (
    event: SelectChangeEvent<typeof selectedInvestigationFilters>
  ) => {
    let value = event.target.value;
    const name = event.target.name;

    if (typeof value === "string") {
      value = value.split(",");
    }

    handleFilterChange(value, name);
  };

  const handleInstrumentFilterChange = (
    event: SelectChangeEvent<typeof selectedInstrumentFilters>
  ) => {
    let value = event.target.value;
    const name = event.target.name;

    if (typeof value === "string") {
      value = value.split(",");
    }

    handleFilterChange(value, name);
  };

  const handlePageTypeFilterChange = (
    event: SelectChangeEvent<typeof selectedPageTypeFilters>
  ) => {
    let value = event.target.value;
    const name = event.target.name;

    if (typeof value === "string") {
      value = value.split(",");
    }

    handleFilterChange(value, name);
  };

  const handleSearchInputValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    searchInputRef.current = event.target.value;
  };

  const formatSelectedFiltersForSearchPage = (filters: SelectedFilter[]) => {
    let formattedFilters = "";

    filters.forEach((filter, index) => {
      if (filter.value !== "all") {
        let key = "";
        if (filter.parentFilterName === "investigations") {
          key = "investigation_ref";
        }
        if (filter.parentFilterName === "instruments") {
          key = "instrument_ref";
        }
        if (filter.parentFilterName === "targets") {
          key = "target_ref";
        }
        if (filter.parentFilterName === "page_type") {
          key = "page_type";
        }

        if (index === 0) {
          formattedFilters = key + "+" + filter.value;
        } else {
          formattedFilters = formattedFilters + "+" + key + "+" + filter.value;
        }
      }
    });

    return formattedFilters;
  };

  const doNavigate = (searchText: string) => {
    const pathParams = {
      searchText,
    };

    if (selectedFilters.length > 0) {
      const formattedFilters =
        formatSelectedFiltersForSearchPage(selectedFilters);

      const queryParams = {
        filters: formattedFilters,
      };

      navigate({
        pathname: generatePath("/search/:searchText/", pathParams),
        search: createSearchParams(queryParams).toString(),
      });
    } else {
      navigate({
        pathname: generatePath("/search/:searchText/", pathParams),
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      doNavigate(searchInputRef.current);
    }
  };

  const handleSearchClick = () => {
    doNavigate(searchInputRef.current);
  };

  const handleFilterChipDelete = (identifier: string, parentName: string) => {
    let newFilters: string[] = [];

    if (parentName === "targets") {
      newFilters = selectedTargetFilters.filter(() => true);
    }
    if (parentName === "investigations") {
      newFilters = selectedInvestigationFilters.filter(() => true);
    }
    if (parentName === "instruments") {
      newFilters = selectedInstrumentFilters.filter(() => true);
    }
    if (parentName === "page_type") {
      newFilters = selectedPageTypeFilters.filter(() => true);
    }

    const index = newFilters.indexOf(identifier);
    if (index > -1) {
      newFilters.splice(index, 1);
    }

    if (parentName === "targets") {
      setSelectedTargetFilters(newFilters);
    }
    if (parentName === "investigations") {
      setSelectedInvestigationFilters(newFilters);
    }
    if (parentName === "instruments") {
      setSelectedInstrumentFilters(newFilters);
    }
    if (parentName === "page_type") {
      setSelectedPageTypeFilters(newFilters);
    }

    const newSelectedFilters = selectedFilters.filter(() => true);
    const filterToRemove = newSelectedFilters.find(
      (filter) => filter.value === identifier
    );

    if (filterToRemove) {
      const index = newSelectedFilters.indexOf(filterToRemove);
      if (index > -1) {
        newSelectedFilters.splice(index, 1);
      }
    }

    setSelectedFilters(newSelectedFilters);
  };

  const formatFilterDataResults = (data: SolrIdentifierNameResponse) => {
    return data;
  };

  useEffect(() => {
    searchInputRef.current = "";

    const investigationsUrl = investigationNamesEndpoint;
    const instrumentsUrl = instrumentNamesEndpoint;
    const targetsUrl = targetNamesEndpoint;
    const filtersUrl = getFiltersQuery;

    fetch(investigationsUrl)
      .then((investigationsResponse) => investigationsResponse.json())
      .then((investigationsData) => {
        fetch(instrumentsUrl)
          .then((instrumentsResponse) => instrumentsResponse.json())
          .then((instrumentsData) => {
            fetch(targetsUrl)
              .then((targetsResponse) => targetsResponse.json())
              .then((targetsData) => {
                fetch(filtersUrl)
                  .then((filterResponse) => filterResponse.json())
                  .then((filtersData) => {
                    const formattedFiltersData =
                      formatFilterDataResults(filtersData);

                    let investigationFilterIds: string[] = [];
                    let instrumentFilterIds: string[] = [];
                    let targetFilterIds: string[] = [];
                    let pageTypeFilterIds: string[] = [];

                    if (
                      formattedFiltersData.facet_counts.facet_fields
                        .investigation_ref &&
                      formattedFiltersData.facet_counts.facet_fields
                        .investigation_ref.length > 0
                    ) {
                      investigationFilterIds =
                        formattedFiltersData.facet_counts.facet_fields
                          .investigation_ref;
                    }
                    if (
                      formattedFiltersData.facet_counts.facet_fields
                        .instrument_ref &&
                      formattedFiltersData.facet_counts.facet_fields
                        .instrument_ref.length > 0
                    ) {
                      instrumentFilterIds =
                        formattedFiltersData.facet_counts.facet_fields
                          .instrument_ref;
                    }
                    if (
                      formattedFiltersData.facet_counts.facet_fields
                        .target_ref &&
                      formattedFiltersData.facet_counts.facet_fields.target_ref
                        .length > 0
                    ) {
                      targetFilterIds =
                        formattedFiltersData.facet_counts.facet_fields
                          .target_ref;
                    }
                    if (
                      formattedFiltersData.facet_counts.facet_fields
                        .page_type &&
                      formattedFiltersData.facet_counts.facet_fields.page_type
                        .length > 0
                    ) {
                      pageTypeFilterIds =
                        formattedFiltersData.facet_counts.facet_fields
                          .page_type;
                    }

                    const investigationNames: IdentifierNameDoc[] =
                      investigationsData.response.docs;
                    const instrumentNames: IdentifierNameDoc[] =
                      instrumentsData.response.docs;
                    const targetNames: IdentifierNameDoc[] =
                      targetsData.response.docs;

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
                    const pageTypeFilterOptions =
                      mapPageType(pageTypeFilterIds);

                    const investigationFilters = investigationFilterOptions.map(
                      (filter) => ({
                        name: filter.name,
                        value: filter.identifier,
                      })
                    );
                    investigationFilters.splice(0, 0, {
                      name: "All",
                      value: "all",
                    });

                    const instrumentFilters = instrumentFilterOptions.map(
                      (filter) => ({
                        name: filter.name,
                        value: filter.identifier,
                      })
                    );
                    instrumentFilters.splice(0, 0, {
                      name: "All",
                      value: "all",
                    });

                    const targetFilters = targetFilterOptions.map((filter) => ({
                      name: filter.name,
                      value: filter.identifier,
                    }));
                    targetFilters.splice(0, 0, { name: "All", value: "all" });

                    const pageTypeFilters = pageTypeFilterOptions.map(
                      (filter) => ({
                        name: filter.name,
                        value: filter.identifier,
                      })
                    );
                    pageTypeFilters.splice(0, 0, { name: "All", value: "all" });

                    console.log(
                      "investigationFilterOptions",
                      investigationFilterOptions
                    );
                    console.log(
                      "instrumentFilterOptions",
                      instrumentFilterOptions
                    );
                    console.log("targetFilterOptions", targetFilterOptions);
                    console.log("pageTypeFilterOptions", pageTypeFilterOptions);

                    setAllInvestigationFilters(investigationFilters);
                    setAllInstrumentFilters(instrumentFilters);
                    setAllTargetFilters(targetFilters);
                    setAllPageTypeFilters(pageTypeFilters);

                    setTargetFilters(targetFilters);
                    setInvestigationFilters(investigationFilters);
                    setInstrumentFilters(instrumentFilters);
                    setPageTypeFilters(pageTypeFilters);
                  });
              });
          });
      });
  }, []);

  return (
    <Container
      className="pds-home-search-container"
      maxWidth={false}
      disableGutters
    >
      <Container
        className="pds-home-search-container-inner"
        maxWidth={"xl"}
        sx={{
          paddingY: "24px",
        }}
      >
        <Grid
          container
          spacing={4}
          direction="row"
          columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
        >
          <Grid item xs={0} sm={0} md={0} lg={2}></Grid>
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <Typography
              className="pds-home-page-search-title"
              variant="h3"
              weight="bold"
            >
              Search The Planetary Data System
            </Typography>

            <Box className="pds-home-search-search-bar-container">
              <TextField
                variant="search"
                className="pds-home-page-search-bar"
                placeholder="Search the PDS archives"
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
                defaultValue=""
              />
              <Button
                variant={"cta"}
                className="pds-search-searchButton"
                onClick={handleSearchClick}
              >
                Search
              </Button>
            </Box>

            <Box>
              {selectedFilters.map((filter) =>
                filter.value !== "all" ? (
                  <Chip
                    sx={{
                      backgroundColor: "white",
                      textTransform: "uppercase",
                    }}
                    key={filter.value}
                    label={getFilterName(filter.value, filter.parentFilterName)}
                    onDelete={() =>
                      handleFilterChipDelete(
                        filter.value,
                        filter.parentFilterName
                      )
                    }
                  />
                ) : (
                  <></>
                )
              )}
            </Box>
          </Grid>
          <Grid item xs={0} sm={0} md={0} lg={2}></Grid>
        </Grid>

        <Grid
          container
          spacing={4}
          direction="row"
          columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
        >
          <Grid
            item
            xs={0}
            sm={0}
            md={0}
            lg={2}
            sx={{
              display: { xs: "none", sm: "none", md: "none", lg: "block" },
            }}
          ></Grid>
          <Grid item xs={4} sm={4} md={3} lg={2}>
            <Box className="pds-home-page-filter-container">
              <Typography variant="h6" weight="semibold">
                Planetary Bodies & Systems
              </Typography>

              <FormControl className="pds-home-page-search-form-control">
                <Select
                  className="pds-home-page-select"
                  name="targets"
                  size="small"
                  multiple
                  value={selectedTargetFilters}
                  onChange={handleTargetFilterChange}
                  renderValue={(selected) =>
                    selected.includes("all")
                      ? "All"
                      : selected.length + " Selected"
                  }
                  MenuProps={MenuProps}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  IconComponent={IconChevronDown}
                >
                  <ListSubheader className="pds-home-page-filter-container">
                    <TextField
                      className="pds-home-page-filter-textfield"
                      autoFocus
                      placeholder="Type to search..."
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconSearch />
                          </InputAdornment>
                        ),
                      }}
                      onChange={onTargetSubFilterChange}
                      onKeyDown={(e) => {
                        if (e.key !== "Escape") {
                          e.stopPropagation();
                        }
                      }}
                      value={targetSubFilter}
                      variant="standard"
                    />
                  </ListSubheader>

                  {targetFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      <Checkbox
                        checked={selectedTargetFilters.includes(filter.value)}
                        disabled={
                          filter.value === "all" &&
                          selectedTargetFilters.includes(filter.value)
                        }
                      />
                      <ListItemText
                        className="pds-home-page-filter-option-text"
                        primary={filter.name}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={4} sm={4} md={3} lg={2}>
            <Box className="pds-home-page-filter-container">
              <Typography variant="h6" weight="semibold">
                Investigations
              </Typography>

              <FormControl className="pds-home-page-search-form-control">
                <Select
                  className="pds-home-page-select"
                  name="investigations"
                  size="small"
                  multiple
                  value={selectedInvestigationFilters}
                  onChange={handleInvestigationFilterChange}
                  renderValue={(selected) =>
                    selected.includes("all")
                      ? "All"
                      : selected.length + " Selected"
                  }
                  MenuProps={MenuProps}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  IconComponent={IconChevronDown}
                >
                  <ListSubheader className="pds-home-page-filter-container">
                    <TextField
                      className="pds-home-page-filter-textfield"
                      autoFocus
                      placeholder="Type to search..."
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconSearch />
                          </InputAdornment>
                        ),
                      }}
                      onChange={onInvestigationSubFilterChange}
                      onKeyDown={(e) => {
                        if (e.key !== "Escape") {
                          e.stopPropagation();
                        }
                      }}
                      value={investigationSubFilter}
                      variant="standard"
                    />
                  </ListSubheader>

                  {investigationFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      <Checkbox
                        checked={selectedInvestigationFilters.includes(
                          filter.value
                        )}
                        disabled={
                          filter.value === "all" &&
                          selectedInvestigationFilters.includes(filter.value)
                        }
                      />
                      <ListItemText
                        className="pds-home-page-filter-option-text"
                        primary={filter.name}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={4} sm={4} md={3} lg={2}>
            <Box className="pds-home-page-filter-container">
              <Typography variant="h6" weight="semibold">
                Instruments
              </Typography>

              <FormControl className="pds-home-page-search-form-control">
                <Select
                  className="pds-home-page-select"
                  name="instruments"
                  size="small"
                  multiple
                  value={selectedInstrumentFilters}
                  onChange={handleInstrumentFilterChange}
                  renderValue={(selected) =>
                    selected.includes("all")
                      ? "All"
                      : selected.length + " Selected"
                  }
                  MenuProps={MenuProps}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  IconComponent={IconChevronDown}
                >
                  <ListSubheader className="pds-home-page-filter-container">
                    <TextField
                      className="pds-home-page-filter-textfield"
                      autoFocus
                      placeholder="Type to search..."
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconSearch />
                          </InputAdornment>
                        ),
                      }}
                      onChange={onInstrumentSubFilterChange}
                      onKeyDown={(e) => {
                        if (e.key !== "Escape") {
                          e.stopPropagation();
                        }
                      }}
                      value={instrumentSubFilter}
                      variant="standard"
                    />
                  </ListSubheader>

                  {instrumentFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      <Checkbox
                        checked={selectedInstrumentFilters.includes(
                          filter.value
                        )}
                        disabled={
                          filter.value === "all" &&
                          selectedInstrumentFilters.includes(filter.value)
                        }
                      />
                      <ListItemText
                        className="pds-home-page-filter-option-text"
                        primary={filter.name}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={4} sm={4} md={3} lg={2}>
            <Box className="pds-home-page-filter-container">
              <Typography variant="h6" weight="semibold">
                Page Type
              </Typography>

              <FormControl className="pds-home-page-search-form-control">
                <Select
                  className="pds-home-page-select"
                  name="page_type"
                  size="small"
                  multiple
                  value={selectedPageTypeFilters}
                  onChange={handlePageTypeFilterChange}
                  renderValue={(selected) =>
                    selected.includes("all")
                      ? "All"
                      : selected.length + " Selected"
                  }
                  MenuProps={MenuProps}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  IconComponent={IconChevronDown}
                >
                  <ListSubheader className="pds-home-page-filter-container">
                    <TextField
                      className="pds-home-page-filter-textfield"
                      autoFocus
                      placeholder="Type to search..."
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconSearch />
                          </InputAdornment>
                        ),
                      }}
                      onChange={onPageTypeSubFilterChange}
                      onKeyDown={(e) => {
                        if (e.key !== "Escape") {
                          e.stopPropagation();
                        }
                      }}
                      value={pageTypeSubFilter}
                      variant="standard"
                    />
                  </ListSubheader>

                  {pageTypeFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      <Checkbox
                        checked={selectedPageTypeFilters.includes(filter.value)}
                        disabled={
                          filter.value === "all" &&
                          selectedPageTypeFilters.includes(filter.value)
                        }
                      />
                      <ListItemText
                        className="pds-home-page-filter-option-text"
                        primary={filter.name}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid
            item
            xs={0}
            sm={0}
            md={0}
            lg={2}
            sx={{
              display: { xs: "none", sm: "none", md: "none", lg: "block" },
            }}
          ></Grid>
        </Grid>
      </Container>
    </Container>
  );
};
