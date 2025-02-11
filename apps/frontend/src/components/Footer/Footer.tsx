import { FooterLink, Footer } from "@nasapds/wds-react";

function PortalFooter() {

  const pageLastUpdated="Feb. 11, 2025"

  const primaryLinks:FooterLink[] = [
    {
      id: "",
      label: "Home",
      href: "/"
    },
    {
      id: "",
      label: "Contact",
      href: "https://pds.nasa.gov/contact/contact.shtml"
    },
    {
      id: "",
      label: "Find Data",
      href: "/search/"
    },
    {
      id: "",
      label: "Tools",
      href: "https://pds.nasa.gov/tools/tool-registry/"
    },
    {
      id: "",
      label: "Data Standards",
      href: "https://pds.nasa.gov/datastandards/about/"
    },
    {
      id: "",
      label: "Submit Data",
      href: "https://pds.nasa.gov/home/providers/"
    },
    {
      id: "",
      label: "Training & Learning",
      href: "https://pds.nasa.gov/datastandards/training/"
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
      href: "https://www.jpl.nasa.gov/jpl-image-use-policy/"
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
      label: "Privacy Policy",
      href: "https://www.nasa.gov/privacy/"
    },
    {
      id: "",
      label: "FOIA",
      href: "https://www.nasa.gov/foia/"
    },
    {
      id: "",
      label: "No FEAR Act",
      href: "https://www.nasa.gov/odeo/no-fear-act/"
    },
    {
      id: "",
      label: "Office of the IG",
      href: "https://oig.nasa.gov"
    },
    {
      id: "",
      label: "Contact PDS",
      href: "https://pds.nasa.gov/contact/contact.shtml"
    },
    {
      id: "accessibility",
      label: "Accessibility",
      href: "https://www.nasa.gov/general/accessibility/"
    },
  ];

  return (
    <Footer primaryLinks={primaryLinks} secondaryLinks={secondaryLinks} pageLastUpdated={pageLastUpdated}/>
  )
}

export default PortalFooter;