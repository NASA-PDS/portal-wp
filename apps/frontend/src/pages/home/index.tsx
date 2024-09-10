import { Stack } from "@mui/material";
import { Card } from "@nasapds/wds-react";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { ExploreTopicsSixUp } from "src/components/ExploreTopicsSixUp";

const HomePage = () => {
  return <>
    <DocumentMeta
      title={ "Homepage" }
      description={ "The Planetary Data Systems Homepage" }
    />
    <ExploreTopicsSixUp
      tabs={[
        {
          label: "Investigations",
          content: <>
            <Stack direction={"row"} gap={"12px"}>
              {
                [
                  { "title": "Mars 2020" },
                  { "title": "Insight" },
                  { "title": "Cassini" },
                  { "title": "Juno" },
                  { "title": "Mars Science Laboratory" },
                ].map( (investigation) => {
                  return <Card title={investigation.title} height={250} width={204} maxWidth={204} />
                })
              }
            </Stack>
          </>
        },
        {
          label: "Instruments",
          content: <>Instrument's Content</>
        }
      ]}
      tabsDescription="Explore the PDS Data Archive by browsing data by the categories they are orgnized within."
      title={"Explore our Data Archive"}
    />
  </>;
};

export default HomePage;