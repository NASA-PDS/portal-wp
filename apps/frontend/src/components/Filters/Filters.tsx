import { ChangeEvent } from "react";
import Filter from "./Filter";
import { FilterProps } from "./Filter";
import { Divider, Typography } from "@mui/material";

export type FiltersProps = {
  filters: FilterProps[];
  onChecked: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Filters = ({ filters, onChecked }: FiltersProps) => {
  return (
    <div>
      <Typography fontWeight="fontWeightMedium" sx={{ marginTop: "5px" }}>
        Filters
      </Typography>

      <Divider sx={{ marginBottom: "5px" }} />

      {filters.map((filter) => (
        <Filter
          value={filter.value}
          title={filter.title}
          displayTitle={filter.displayTitle}
          options={filter.options}
          onChecked={onChecked}
        />
      ))}
    </div>
  );
};

export default Filters;
