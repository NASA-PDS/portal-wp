import { Container } from "@mui/material"
import { Typography } from "@nasapds/wds-react"
import { Tabs } from "@nasapds/wds-react";

import "./ExploreTopicsSixUp.scss";

export type ExploreTopicsSixUpProps = {
  tabs:Array<{label:string, content:React.ReactElement}>;
  tabsDescription:string;
  title:string;
}

export const ExploreTopicsSixUp = ({
  tabs,
  tabsDescription,
  title,
}:ExploreTopicsSixUpProps) => {
  return <>
    <Container
      maxWidth={false}
      className="pds-explore-topics-six-up-root"
      >
      <Container
        maxWidth={"xl"}
        className="pds-explore-topics-six-up-container"
        >
          <Typography variant="h2" weight="bold" className="pds-explore-topics-six-up-title">{title}</Typography>
          <Tabs description={tabsDescription} tabs={tabs} />
      </Container>
    </Container>
  </>
}