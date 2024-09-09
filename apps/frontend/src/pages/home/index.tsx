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
          content: <>Investigation's Content</>
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