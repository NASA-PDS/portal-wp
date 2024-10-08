import { Header } from "@nasapds/wds-react";
import { NavItems } from "@nasapds/wds-react";

const navItems: NavItems[] = [
  {
    id: "find-data",
    label: "Find Data",
    href: "/find-data",
    items: [
      {
        id: "find-data-investigations",
        label: "Investigations",
        href: import.meta.env.BASE_URL + "investigations",
      },
      {
        id: "find-data-instruments",
        label: "Instruments",
        href: import.meta.env.BASE_URL + "instruments",
      },
      {
        id: "data-search",
        label: "Search",
        href: import.meta.env.BASE_URL + "search",
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    href: "https://pds.nasa.gov/tools/tool-registry/",
  },
  {
    id: "data-standards",
    label: "Data Standards",
    href: "/data-standards",
    items: [
      {
        id: "data-standards-link-1",
        label: "PDS Data Standards Home",
        href: "https://pds.nasa.gov/datastandards/about",
      },
      {
        id: "data-standards-link-2",
        label: "PDS4 Documents",
        href: "https://pds.nasa.gov/datastandards/documents",
      },
      {
        id: "data-standards-link-3",
        label: "PDS Data Standards Training",
        href: "https://pds.nasa.gov/datastandards/training/",
      },
    ],
  },
  {
    id: "submit-data",
    label: "Submit Data",
    href: "https://pds.nasa.gov/home/providers/",
  },
  {
    id: "training",
    label: "Training & Learning",
    href: "/training",
    items: [
      {
        id: "training-link-1",
        label: "Information for Data Proposers",
        href: "https://pds.nasa.gov/home/proposers/",
      },
      {
        id: "training-link-2",
        label: "Archiving Formats",
        href: "https://pds.nasa.gov/datastandards/documents/archiving/",
      },
      {
        id: "training-link-3",
        label: "Citing PDS4 Data",
        href: "https://pds.nasa.gov/datastandards/citing/",
      },
      {
        id: "training-link-4",
        label: "How-to Guides",
        href: "https://pds.nasa.gov/datastandards/citing/#how-to-guides",
      },
    ],
  },
  {
    id: "about",
    label: "About",
    href: "https://pds.nasa.gov/home/about/",
  },
  {
    id: "give-feedback",
    label: "Give Feedback",
    href: "mailto:pds-operator@jpl.nasa.gov",
  },
];

function PortalHeader() {
  return (
    <Header
      navItems={navItems}
      title={"Planetary Data System"}
      titleLink={import.meta.env.BASE_URL}
      searchEndpoint={import.meta.env.BASE_URL + "search/"}
    />
  );
}

export default PortalHeader;
