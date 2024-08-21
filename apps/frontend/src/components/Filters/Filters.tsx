import { ChangeEvent } from "react";
import Filter from "./Filter";
import { FilterProps } from "./Filter";

export type FiltersProps = {
  filters: FilterProps[];
  onChecked: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Filters = ({ filters, onChecked }: FiltersProps) => {
  return (
    <>
      {filters.map((filter) => (
        <Filter
          value={filter.value}
          title={filter.title}
          displayTitle={filter.displayTitle}
          options={filter.options}
          onChecked={onChecked}
        />
      ))}
    </>
  );
};

export default Filters;
