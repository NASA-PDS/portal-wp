import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  IconArrowCircleDown,
  IconArrowCircleUp,
  IconSearch,
  Typography,
} from "@nasapds/wds-react";

export type FilterOptionProps = {
  title: string;
  value: string;
  resultsFound: number;
  isChecked: boolean;
};

export type FilterVariant = "single" | "multi";

export type FilterProps = {
  displayTitle: string;
  value: string;
  title: string;
  options: FilterOptionProps[];
  onChecked: (event: ChangeEvent<HTMLInputElement>) => void;
  onCheckedRadio: (name: string, checked: boolean, value: string) => void;
  collapseAll?: boolean;
  variant: FilterVariant;
};

import "./filter.scss";

const Filter = ({
  displayTitle,
  value,
  options,
  onChecked,
  collapseAll = false,
  onCheckedRadio,
  variant = "multi",
}: FilterProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subFilter, setSubFilter] = useState("");

  const handleCollapseClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  const onSubFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSubFilter(event.target.value);
  };

  const titleIncludesSubFilter = (
    titleString: string,
    subFilterString: string
  ) => {
    let isIncluded = false;

    if (
      titleString.toLowerCase().includes(subFilterString.toLowerCase()) ||
      titleString.toLowerCase() === "all"
    ) {
      isIncluded = true;
    }
    return isIncluded;
  };

  const isASingleSelected = (
    possibleOptions: FilterOptionProps[],
    filterVariant: FilterVariant
  ) => {
    let isSingleAndSelected = false;
    if (filterVariant === "single") {
      possibleOptions.forEach((option) => {
        if (option.value !== "all" && option.isChecked === true) {
          isSingleAndSelected = true;
        }
      });
    }

    return isSingleAndSelected;
  };

  useEffect(() => {
    setIsCollapsed(collapseAll);
  }, [collapseAll]);

  return (
    <>
      {!isASingleSelected(options, variant) ? (
        <div>
          <Box>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ paddingBottom: 0 }}
            >
              <Grid item xs={10}>
                <Typography variant="h8" weight="semibold">
                  {displayTitle.toUpperCase()}
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                className="pds-search-filter-dropdown-button-grid"
              >
                <IconButton aria-label="star" onClick={handleCollapseClick}>
                  {isCollapsed ? (
                    <IconArrowCircleDown />
                  ) : (
                    <IconArrowCircleUp />
                  )}
                </IconButton>
              </Grid>
            </Grid>
          </Box>
          {!isCollapsed ? (
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ paddingBottom: 0 }}
            >
              <Grid item xs={12}>
                <TextField
                  className="pds-filter-textfield"
                  id="subfilter"
                  value={subFilter}
                  variant="standard"
                  onChange={onSubFilterChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {!isCollapsed ? (
            <Box className="pds-search-filter-checkbox-container">
              {options.map((option) =>
                titleIncludesSubFilter(option.title, subFilter) ? (
                  <Box
                    className="pds-search-filter-checkbox-box"
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "start",
                    }}
                  >
                    {variant !== "single" ? (
                      <>
                        <Checkbox
                          sx={{ padding: 0 }}
                          onChange={onChecked}
                          name={option.value}
                          value={value}
                          checked={option.isChecked}
                          disabled={option.isChecked && option.title === "all"}
                        />
                        <Typography variant="h6" weight="regular">
                          {option.title.toUpperCase()}

                          <span className="pds-search-filter-count-span">
                            {option.title === "all"
                              ? ""
                              : " (" + option.resultsFound + ")"}
                          </span>
                        </Typography>
                      </>
                    ) : option.title === "all" ? (
                      <></>
                    ) : (
                      <div>
                        <Typography
                          variant="h6"
                          weight="regular"
                          onClick={() =>
                            onCheckedRadio(
                              option.value,
                              !option.isChecked,
                              value
                            )
                          }
                        >
                          {option.title.toUpperCase()}

                          <span className="pds-search-filter-count-span">
                            {option.title === "all"
                              ? ""
                              : " (" + option.resultsFound + ")"}
                          </span>
                        </Typography>
                      </div>
                    )}
                  </Box>
                ) : (
                  <></>
                )
              )}
            </Box>
          ) : (
            ""
          )}
          <Divider />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Filter;
