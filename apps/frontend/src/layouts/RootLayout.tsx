import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import { FooterLink } from "@nasapds/wds-react";

function RootLayout() {

  const primaryLinks:FooterLink[] = [
    {
      id: "",
      label: "Home",
      href: "/"
    },
    {
      id: "",
      label: "Contact",
      href: ""
    },
    {
      id: "",
      label: "Site Map",
      href: ""
    },
    {
      id: "",
      label: "Find Data",
      href: ""
    },
    {
      id: "",
      label: "Tools",
      href: ""
    },
    {
      id: "",
      label: "Data Standards",
      href: ""
    },
    {
      id: "",
      label: "Submit Data",
      href: ""
    },
    {
      id: "",
      label: "Training & Learning",
      href: ""
    },
    {
      id: "",
      label: "NASA",
      href: "https://www.nasa.gov/"
    },
    {
      id: "",
      label: "Caltech",
      href: "https://www.caltech.edu/"
    },
    {
      id: "",
      label: "Privacy Policy",
      href: "https://www.nasa.gov/nasa-web-privacy-policy-and-important-notices/"
    },
    {
      id: "",
      label: "Image Policy",
      href: ""
    },
    {
      id: "accessibility",
      label: "Accessibility",
      href: "https://www.nasa.gov/accessibility/"
    },
    {
      id: "",
      label: "Give Feedback",
      href: ""
    },
  ];

  const secondaryLinks:FooterLink[] = [
    {
      id: "",
      label: "Sitemap",
      href: ""
    },
    {
      id: "",
      label: "Privacy Policy",
      href: ""
    },
    {
      id: "",
      label: "FOIA",
      href: ""
    },
    {
      id: "",
      label: "No FEAR Act",
      href: ""
    },
    {
      id: "",
      label: "Office of the IG",
      href: ""
    },
    {
      id: "",
      label: "Contact PDS",
      href: ""
    },
  ];

  return (
    <>
      <Header />
      <div style={{ backgroundColor: "white", padding: "0px", color: "black" }}>
        {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}

        {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
        <Outlet />
      </div>
      <Footer pageLastUpdated="Sept. 19, 2024" primaryLinks={primaryLinks} secondaryLinks={secondaryLinks} />
      <ScrollRestoration />
    </>
  );
}

export default RootLayout;
