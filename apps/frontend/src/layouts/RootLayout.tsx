import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { Header } from "@nasapds/wds-react";

const navItems = [
  {
    id: "find-data",
    label: "Find Data",
    href: "/find-data",
    items: [
      {
        id: "find-data-1",
        label: "Find Data Link 1",
        href: "/find-data/find-data-link-1",
      },
      {
        id: "find-data-2",
        label: "Find Data Link 2",
        href: "/find-data/find-data-link-2",
      },
      {
        id: "find-data-3",
        label: "Find Data Link 3",
        href: "/find-data/find-data-link-3",
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    href: "/tools",
  },
  {
    id: "data-standards",
    label: "Data Standards",
    href: "/data-standards",
    items: [
      {
        id: "data-standards-link-1",
        label: "Data Standards Link 1",
        href: "/data-standards/data-standards-link-1",
      },
      {
        id: "data-standards-link-2",
        label: "Data Standards Link 2",
        href: "/data-standards/data-standards-link-2",
      },
      {
        id: "data-standards-link-3",
        label: "Data Standards Link 3",
        href: "/data-standards/data-standards-link-3",
      },
    ],
  },
  {
    id: "submit-data",
    label: "Submit Data",
    href: "/submit-data",
  },
  {
    id: "training",
    label: "Training & Learning",
    href: "/training",
    items: [
      {
        id: "training-link-1",
        label: "Training Link 1",
        href: "/training/training-link-1",
      },
      {
        id: "training-link-2",
        label: "Training Link 2",
        href: "/training/training-link-2",
      },
    ],
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    items: [
      {
        id: "about-link-1",
        label: "About Link 1",
        href: "/about/about-link-1",
      },
      {
        id: "about-link-2",
        label: "About Link 2",
        href: "/about/about-link-2",
      },
      {
        id: "about-link-3",
        label: "About Link 3",
        href: "/about/about-link-2",
      },
    ],
  },
];

function RootLayout() {
  return (
    <>
      <Header navItems={navItems} title={"Planetary Data System"} />
      <div style={{ backgroundColor: "white", padding: "0px", color: "black" }}>
        {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}

        {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default RootLayout;
