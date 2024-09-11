import { ChangeEvent, useEffect, useState } from "react";
import Filter from "./Filter";
import { FilterProps, FilterOptionProps } from "./Filter";
import { Box } from "@mui/material";
import { Chip, Typography } from "@nasapds/wds-react";

export type FiltersProps = {
  filters: FilterProps[];
  onChecked: (event: ChangeEvent<HTMLInputElement>) => void;
  onFilterChipDelete: (value: string, parentValue: string) => void;
  onFilterClear: () => void;
  collapseAll?: boolean;
};

type Option = FilterOptionProps & { parentValue: string };

const Filters = ({
  filters,
  onChecked,
  onFilterChipDelete,
  onFilterClear,
  collapseAll = false,
}: FiltersProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const clearFilters = () => {
    onFilterClear();
  };

  const handleFilterChipDelete = (value: string, parentValue: string) => {
    onFilterChipDelete(value, parentValue);
  };

  useEffect(() => {
    const options: Option[] = [];

    if (filters.length > 0) {
      filters.forEach((filter) => {
        filter.options.forEach((option) => {
          if (option.value !== "all" && option.isChecked) {
            const optionProps = {
              title: option.title,
              value: option.value,
              resultsFound: option.resultsFound,
              isChecked: option.isChecked,
              parentValue: filter.value,
            };
            options.push(optionProps);
          }
        });
      });
    }

    setSelectedOptions(options);
  }, [filters]);

  return (
    <>
      {selectedOptions.length > 0 ? (
        <Box>
          {selectedOptions.map((option, index) => (
            <Box sx={{ marginBottom: "5px" }}>
              <Chip
                key={index}
                label={option.title}
                onDelete={() =>
                  handleFilterChipDelete(option.value, option.parentValue)
                }
              />
            </Box>
          ))}

          <Box
            sx={{
              cursor: "pointer",
              textDecoration: "underline dotted",
              color: "#58585a",
            }}
            onClick={clearFilters}
          >
            Clear Filters
          </Box>

          <Box className="filtersTitleBox">
            <Typography variant="h5" weight="semibold" onClick={onFilterClear}>
              Filters
            </Typography>
          </Box>
        </Box>
      ) : (
        <></>
      )}

      {filters.map((filter) => (
        <Filter
          value={filter.value}
          title={filter.title}
          displayTitle={filter.displayTitle}
          options={filter.options}
          onChecked={onChecked}
          collapseAll={collapseAll}
        />
      ))}
    </>
  );
};

export default Filters;
