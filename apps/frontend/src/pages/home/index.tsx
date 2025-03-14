import { APP_CONFIG } from "src/AppConfig";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { ExploreTopicsSixUp, ExploreTopicsSixUpProps } from "src/components/ExploreTopicsSixUp";
import { SubmitDataQuickLinks } from "src/components/SubmitDataQuickLinks";
import { ExploreTopicsFourUp, ExploreTopicsFourUpProps } from "src/components/ExploreTopicsFourUp";
import { HomeSearch } from "src/components/HomeSearch/HomeSearch";
import { Hero } from "src/components/Hero/Hero";

const HomePage = () => {

  const exploreTopicsSixUpPropx:ExploreTopicsSixUpProps = {
    tabsDescription: "Explore the PDS Data Archive by browsing data by the categories they are orgnized within.",
    title: "Explore our Data Archive",
    tabs: [
      {
        label: "Investigations",
        content: {
          jumpLinkLabel: "More Investigations",
          jumpLinkUrl: "/investigations",
          cards: [
            {
              image: "/assets/images/cards/missions/urn--nasa--pds--context--investigation--mission---mars2020.jpg",
              imageDescription: "Artist's rendering of the Perserverance rover on the Mars surface.",
              lid: "urn--nasa--pds--context--investigation--mission---mars2020",
              title: "Mars 2020",
              url: "/investigations/urn--nasa--pds--context--investigation--mission---mars2020/instruments"
            },
            {
              image: "/assets/images/cards/missions/urn--nasa--pds--context--investigation--mission---lunar----reconnaissance----orbiter.jpg",
              imageDescription: "Lunar reconnaissance orbiter orbiting the moon",
              lid: "urn--nasa--pds--context--investigation--mission---lunar----reconnaissance----orbiter",
              title: "Lunar Reconnaissance Orbiter",
              url: "/investigations/urn--nasa--pds--context--investigation--mission---lunar----reconnaissance----orbiter/instruments"
            },
            {
              image: "/assets/images/cards/missions/urn--nasa--pds--context--investigation--mission---new----horizons----kem2.jpg",
              imageDescription: "Artist's rendering of the new horizons spacecraft with Jupiter in the background.",
              lid: "urn--nasa--pds--context--investigation--mission---new----horizons----kem2",
              title: "New Horizons",
              url: "/investigations/urn--nasa--pds--context--investigation--mission---new----horizons----kem2/instruments"
            },
            {
              image: "/assets/images/cards/missions/urn--nasa--pds--context--investigation--mission---cassini-huygens.jpg",
              imageDescription: "Artist's rendering of the Cassini spacecraft.",
              lid: "urn--nasa--pds--context--investigation--mission---cassini-huygens",
              title: "Cassini",
              url: "/investigations/urn--nasa--pds--context--investigation--mission---cassini-huygens/instruments"
            }, 
            {
              image: "/assets/images/cards/missions/urn--nasa--pds--context--investigation--mission---mars----reconnaissance----orbiter.jpg",
              imageDescription: "Mars reconnaissance orbiter over mars.",
              lid: "urn--nasa--pds--context--investigation--mission---mars----reconnaissance----orbiter",
              title: "Mars Reconnaissance Orbiter",
              url: "/investigations/urn--nasa--pds--context--investigation--mission---mars----reconnaissance----orbiter/instruments"
            },
          ]
        }
      }, 
      {
        label: "Instruments",
        content: {
          jumpLinkLabel: "More Instruments",
          jumpLinkUrl: "/instruments",
          cards: [
            {
              image: "/assets/images/cards/instruments/urn--nasa--pds--context--instrument--lro---lroc.jpg",
              imageDescription: "Artist concept of NASA's Lunar Reconnaissance Orbiter.",
              lid: "urn--nasa--pds--context--instrument--lro---lroc",
              title: "Lunar Reconnaissance Orbiter Camera For LRO (LROC)",
              url: "/instruments/urn--nasa--pds--context--instrument--lro---lroc/data"
            },
            {
              image: "/assets/images/cards/instruments/urn--nasa--pds--context--instrument--hirise---mro.jpg",
              imageDescription: "Front end of the HiRISE Telescopic Camera for Mars Reconnaissance Orbiter. NASA/JPL-Caltech/Ball Aerospace",
              lid: "urn--nasa--pds--context--instrument--hirise---mro",
              title: "High Resolution Imaging Science Experiment for MRO (HiRISE)",
              url: "/instruments/urn--nasa--pds--context--instrument--hirise---mro/data"
            },
            
            {
              image: "/assets/images/cards/instruments/urn--nasa--pds--context--instrument--mount----bigelow---1m54---mont4k.jpg",
              imageDescription: "Picture of the Mont4K CCD Imager instrument.",
              lid: "urn--nasa--pds--context--instrument--mount----bigelow---1m54---mont4k",
              title: "Mont4K CCD Imager",
              url: "/instruments/urn--nasa--pds--context--instrument--mount----bigelow---1m54---mont4k/data"
            },
            {
              image: "/assets/images/cards/instruments/urn--nasa--pds--context--instrument--mars2020---mastcamz.jpg",
              imageDescription: "Mastcam-Z's Color Calibration Targets (lower right) as seen on Mars.",
              lid: "urn--nasa--pds--context--instrument--mars2020---mastcamz",
              title: "Mars 2020 Mastcam-Zoom Camera Instrument Suite (Mastcam-Z)",
              url: "/instruments/urn--nasa--pds--context--instrument--mars2020---mastcamz/data"
            },
            {
              image: "/assets/images/cards/instruments/urn--nasa--pds--context--instrument--ovirs---orex.jpg",
              imageDescription: "Picture of the OSIRIS-REx Visible and Infrared Spectrometer (OVIRS) instrument.",
              lid: "urn--nasa--pds--context--instrument--ovirs---orex",
              title: "OSIRIS-REx Visible and Infrared Spectrometer (OVIRS)",
              url: "/instruments/urn--nasa--pds--context--instrument--ovirs---orex/data"
            },
          ]
        }
      }
    ]
  };

  const exploreTopicsFourUpProps:ExploreTopicsFourUpProps = {
    title: "Explore Tools and Services",
    jumpLinkLabel: "More About Tools & Services",
    jumpLinkUrl: "https://pds.nasa.gov/tools/about/",
    jumpLinkType: "external",
    cards: [
      {
        description: "Search tools help users efficiently and easily find and access planetary science data",
        image: "/assets/images/cards/tools/search-tools.jpg",
        imageDescription: "",
        title: "Search Tools",
        url: "/search/service_category:Search?rows=20&sort=relevance&page=1",
      },
      {
        description: "Analysis tools enable users to process, visualize, and analyze planetary data for research purposes",
        image: "/assets/images/cards/tools/analysis-tools.jpg",
        imageDescription: "",
        title: "Analysis Tools",
        url: "/search/service_category:Analysis?rows=20&sort=relevance&page=1",
      },
      {
        description: "Visualization tools allow users to create visual representations of planetary data for enhanced analysis",
        image: "/assets/images/cards/tools/visualization-tools.jpg",
        imageDescription: "",
        title: "Visualization Tools",
        url: "/search/service_category:Visualization?rows=20&sort=relevance&page=1",
      },
      {
        description: "API services provide programmatic access to planetary data, enabling automated retrieval and integration",
        image: "/assets/images/cards/tools/api-services.jpg",
        imageDescription: "",
        title: "API Services",
        url: "/search/service_interface_type:API?rows=20&sort=relevance&page=1",
      },
    ]
  };

  return <>
    <DocumentMeta
      title={ "Homepage" }
      description={ "The Planetary Data Systems Homepage" }
    />
     <Hero
        title={"NASA Planetary Data System"}
        primaryTitle={"New PDS Beta Site is Live"}
        text={
          "We are thrilled to announce the beta release of our newly redesigned NASA Planetary Data System (PDS) website! Please give us feedback to improve your experience"
        }
        imageSrc={"/assets/images/545_solarsystem_0_2560.jpg"}
        buttonLink={`mailto:${APP_CONFIG.GENERAL.SUPPORT_EMAIL}`}
        buttonText={"Give Feedback"}
      />
    <HomeSearch />
    <ExploreTopicsSixUp {...exploreTopicsSixUpPropx} />
    <SubmitDataQuickLinks />
    <ExploreTopicsFourUp {...exploreTopicsFourUpProps} />
  </>;
};

export default HomePage;