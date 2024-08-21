import { ChangeEvent, useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { IconArrowCircleDown, IconArrowCircleUp } from "@nasapds/wds-react";

export type FilterOptionProps = {
  title: string;
  value: string;
  resultsFound: number;
  isChecked: boolean;
};

export type FilterProps = {
  displayTitle: string;
  value: string;
  title: string;
  options: FilterOptionProps[];
  onChecked: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Filter = ({
  title,
  displayTitle,
  value,
  options,
  onChecked,
}: FilterProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subFilter, setSubFilter] = useState("");

  const handleCollapseClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  const onSubFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div>
      <Box>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ paddingBottom: 0 }}
        >
          <Grid item xs={12}>
            <TextField
              id="outlined-controlled"
              label="Controlled"
              value={subFilter}
              onChange={onSubFilterChange}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ paddingBottom: 0 }}
        >
          <Grid item xs={10}>
            <Typography fontWeight="fontWeightMedium" sx={{ color: "#58585a" }}>
              {displayTitle.toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton aria-label="star" onClick={handleCollapseClick}>
              {isCollapsed ? <IconArrowCircleDown /> : <IconArrowCircleUp />}
            </IconButton>
          </Grid>
        </Grid>
      </Box>

      {!isCollapsed
        ? options.map((option, index) =>
            titleIncludesSubFilter(option.title, subFilter) ? (
              <Box
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "start",
                }}
              >
                <Checkbox
                  sx={{ padding: 0 }}
                  onChange={onChecked}
                  name={option.value}
                  value={value}
                  checked={option.isChecked}
                  disabled={
                    option.isChecked && option.title === "all" ? true : false
                  }
                />
                <Typography
                  fontWeight="fontWeightMedium"
                  sx={{ color: "#58585a" }}
                >
                  {option.title.toUpperCase()}
                </Typography>
              </Box>
            ) : (
              <></>
            )
          )
        : ""}
      <Divider />
    </div>
  );
};

export default Filter;
