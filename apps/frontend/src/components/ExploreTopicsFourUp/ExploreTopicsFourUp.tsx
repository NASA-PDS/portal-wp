import { Container, Stack as MuiStack } from "@mui/material"
import { Link } from "react-router-dom";
import { PrimaryButton, Typography } from "@nasapds/wds-react"

import "./ExploreTopicsFourUp.scss";

export type ExploreTopicsFourUpProps = {
  content:React.ReactElement;
  title:string;
  jumpLinkUrl:string;
  jumpLinkLabel:string;
  jumpLinkType:"internal" | "external";
}

export const ExploreTopicsFourUp = ({
  content,
  jumpLinkUrl,
  jumpLinkLabel,
  jumpLinkType = "internal",
  title,
}:ExploreTopicsFourUpProps) => {
  return <>
    <Container
      maxWidth={false}
      className="pds-explore-topics-four-up-root"
      >
      <Container
        maxWidth={"xl"}
        className="pds-explore-topics-four-up-container"
        >
          <MuiStack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
            <Typography variant="h2" weight="bold" className="pds-explore-topics-four-up-title">{title}</Typography>
            <Link to={jumpLinkUrl}><PrimaryButton label={jumpLinkLabel} iconType={jumpLinkType} /></Link>
          </MuiStack>
          {content}
      </Container>
    </Container>
  </>
}