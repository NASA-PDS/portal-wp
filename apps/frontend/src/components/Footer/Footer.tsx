import { FooterLink, Footer } from "@nasapds/wds-react";

function PortalFooter() {

  const pageLastUpdated="Sept. 19, 2024"

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
      id: "",
      label: "Give Feedback",
      href: "mailto:pds-operator@jpl.nasa.gov"
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
    {
      id: "accessibility",
      label: "Accessibility",
      href: "https://www.nasa.gov/accessibility/"
    },
  ];

  return (
    <Footer primaryLinks={primaryLinks} secondaryLinks={secondaryLinks} pageLastUpdated={pageLastUpdated}/>
  )
}

export default PortalFooter;