import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";

import { generatePath, useNavigate, useParams } from "react-router-dom";

import { Button, IconSearch, TextField } from "@nasapds/wds-react";

import "./search.css";

const SearchPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const linkStyles = {
    color: "white",
    fontFamily: "Inter",
    fontSize: "14px",
    fontWeight: "300",
    lineHeight: "19px",
    paddingY: "4px",
  };

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchResults, setSearchResults] = useState("");

  const doSearch = async (searchText: string) => {
    const response = await fetch(
      "https://pds.nasa.gov/services/search/search?wt=json&q=" + searchText
    );
    const data = await response.json();
    setSearchResults(data);
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

  useEffect(() => {
    if (params.searchText) {
      setSearchInputValue(params.searchText);
      doSearch(params.searchText);
    }
  }, [params.searchText]);

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
                <Typography>Search</Typography>
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
              <Typography>Showing Results For ...</Typography>
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
              <Typography>Filters go here</Typography>
            </Grid>
            <Grid item xs={9} sm={9} md={9}>
              <Typography sx={{ wordBreak: "break-all" }}>
                Results go here: {JSON.stringify(searchResults)}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Container>
    </>
  );
};

export default SearchPage;
