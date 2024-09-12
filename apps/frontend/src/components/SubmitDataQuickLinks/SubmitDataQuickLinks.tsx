import { Container } from "@mui/material";
import { QuickLinksBar } from "@nasapds/wds-react";

import "./SubmitDataQuickLinks.scss"

export const SubmitDataQuickLinks = () => {
  return <>
    <Container
      maxWidth={false}
      className="pds-submit-data-quick-links-root"
      >
      <Container
        maxWidth={"xl"}
        className="pds-submit-data-quick-links-container"
        >
        <QuickLinksBar
          title="Submitting Data to PDS?"
          primaryLinks={[
            { label: "PDS Standards", url: "https://pds.nasa.gov/datastandards/about/" },
            { label: "Submission Guidelines", url: "https://pds.nasa.gov/home/providers/" },
            { label: "Proposal Guidelines", url: "https://pds.nasa.gov/home/proposers/" }, 
          ]}
          secondaryLinks={[
            { label: "More Resources", url: "https://pds.nasa.gov/datastandards/documents/", urlType:"external" },
          ]}
        />
      </Container>
    </Container>
  </>
}