import { Container } from "@mui/material";
import { QuickLinksBar } from "@nasapds/wds-react";

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
            { label: "PDS Standards", url: "" },
            { label: "Submission Guidelines", url: "" },
            { label: "Proposal Guidelines", url: "" }, 
          ]}
          secondaryLinks={[
            { label: "More Resources", url: "" },
          ]}
        />
      </Container>
    </Container>
  </>
}