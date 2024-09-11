import { Stack } from "@mui/material";
import { Card } from "@nasapds/wds-react";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { ExploreTopicsSixUp } from "src/components/ExploreTopicsSixUp";

const HomePage = () => {

  const investigations = [
    { 
      title: "Mars 2020",
      url: "/investigations/urn--nasa--pds--context--investigation--mission---mars2020/instruments"
    },
    { 
      title: "Insight",
      url: "/investigations/urn--nasa--pds--context--investigation--mission---insight/instruments"
    },
    { 
      title: "Cassini",
      url: "/investigations/urn--nasa--pds--context--investigation--mission---cassini-huygens/instruments"
    },
    { 
      title: "Juno",
      url: "/investigations/urn--nasa--pds--context--investigation--mission---juno/instruments"
    },
    { 
      title: "Mars Science Laboratory",
      url: "/investigations/urn--nasa--pds--context--investigation--mission---mars----science----laboratory/instruments"
    },
  ];

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
                investigations.map( (investigation) => {
                  return <Card title={investigation.title} height={250} width={204} maxWidth={204} url={investigation.url} />
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