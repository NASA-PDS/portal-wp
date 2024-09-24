import { Grid, Stack } from "@mui/material";
import { Card, MediaCard } from "@nasapds/wds-react";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { ExploreTopicsSixUp, ExploreTopicsSixUpProps } from "src/components/ExploreTopicsSixUp";
import { SubmitDataQuickLinks } from "src/components/SubmitDataQuickLinks";
import { ExploreTopicsFourUp } from "src/components/ExploreTopicsFourUp";
import { Link } from "react-router-dom";
import { HomeSearch } from "src/components/HomeSearch/HomeSearch";


const HomePage = () => {

  const exploreSixUpTabs:ExploreTopicsSixUpProps = {
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
              image: "/assets/images/cards/missions/urn--nasa--pds--context--investigation--mission---insight.jpg",
              imageDescription: "Artist's rendering of the Insight Lander on the Mars surface.",
              lid: "urn--nasa--pds--context--investigation--mission---insight",
              title: "Insight",
              url: "/investigations/urn--nasa--pds--context--investigation--mission---insight/instruments"
            },
            {
              image: "/assets/images/cards/missions/urn--nasa--pds--context--investigation--mission---cassini-huygens.jpg",
              imageDescription: "Artist's rendering of the Cassini spacecraft.",
              lid: "urn--nasa--pds--context--investigation--mission---cassini-huygens",
              title: "Cassini",
              url: "/investigations/urn--nasa--pds--context--investigation--mission---cassini-huygens/instruments"
            },
            {
              image: "/assets/images/cards/missions/urn--nasa--pds--context--investigation--mission---juno.jpg",
              imageDescription: "Artist's rendering of the Juno spacecraft with Jupiter in the background.",
              lid: "urn--nasa--pds--context--investigation--mission---juno",
              title: "Juno",
              url: "/investigations/urn--nasa--pds--context--investigation--mission---juno/instruments"
            },
            {
              image: "/assets/images/cards/missions/urn--nasa--pds--context--investigation--mission---mars----science----laboratory.jpg",
              imageDescription: "Artist's rendering of the Curiosity rover on the Mars surface.",
              lid: "urn--nasa--pds--context--investigation--mission---mars----science----laboratory",
              title: "Mars Science Laboratory",
              url: "/investigations/urn--nasa--pds--context--investigation--mission---mars----science----laboratory/instruments"
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
              image: "",
              imageDescription: "",
              lid: "",
              title: "Near Infrared Camera (NIRCam)",
              url: ""
            },
            {
              image: "/assets/images/cards/instruments/urn--nasa--pds--context--instrument--mars2020---sherloc.jpg",
              imageDescription: "Picture of the Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals instrument in a clean room.",
              lid: "urn--nasa--pds--context--instrument--mars2020---sherloc",
              title: "Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals (SHERLOC)",
              url: "/instruments/urn--nasa--pds--context--instrument--mars2020---sherloc/data"
            },
            {
              image: "/assets/images/cards/instruments/urn--nasa--pds--context--instrument--ovirs---orex.jpg",
              imageDescription: "Picture of the OSIRIS-REx Visible and Infrared Spectrometer (OVIRS) instrument.",
              lid: "urn--nasa--pds--context--instrument--ovirs---orex",
              title: "OSIRIS-REx Visible and Infrared Spectrometer (OVIRS)",
              url: "/instruments/urn--nasa--pds--context--instrument--ovirs---orex/data"
            },
            {
              image: "/assets/images/cards/instruments/urn--nasa--pds--context--instrument--mount----bigelow---1m54---mont4k.jpg",
              imageDescription: "Picture of the Mont4K CCD Imager instrument.",
              lid: "urn--nasa--pds--context--instrument--mount----bigelow---1m54---mont4k",
              title: "Mont4K CCD Imager",
              url: "/instruments/urn--nasa--pds--context--instrument--mount----bigelow---1m54---mont4k/data"
            },
            {
              image: "/assets/images/cards/instruments/urn--nasa--pds--context--instrument--chemcam----libs---msl.jpg",
              imageDescription: "Picture of the Chemistry Camera Laser Induced Breakdown Spectrometer (ChemCam) instrument.",
              lid: "urn--nasa--pds--context--instrument--chemcam----libs---msl",
              title: "Chemistry Camera Laser Induced Breakdown Spectrometer (ChemCam)",
              url: "/instruments/urn--nasa--pds--context--instrument--chemcam----libs---msl/data"
            },
          ]
        }
      }
    ]
  };

  const toolsAndServices = [
    {
      description: "Purus tellus lorem urna faucibus lectus viverra egestas. Pulvinar fermentum sed bibendum sed dui.",
      image: "/assets/images/cards/tools/search-tools.jpg",
      imageDescription: "",
      title: "Search Tools",
      url: "/search/service_category:Search?rows=20&sort=relevance&page=1",
    },
    {
      description: "Turpis ipsum ac feugiat dictum nunc nisl, vestibulum. Euismod aliquet elementum volutpat ullamcorper facilisi.",
      image: "/assets/images/cards/tools/analysis-tools.jpg",
      imageDescription: "",
      title: "Analysis Tools",
      url: "/search/service_category:Analysis?rows=20&sort=relevance&page=1",
    },
    {
      description: "Ultrices mi diam fames at feugiat. Sociis nec morbi in amet, eu semper eros odio.",
      image: "/assets/images/cards/tools/visualization-tools.jpg",
      imageDescription: "",
      title: "Visualization Tools",
      url: "/search/service_category:Visualization?rows=20&sort=relevance&page=1",
    },
    {
      description: "Lacus non vitae scelerisque at tristique aliquet. At hac tortor gravida ipsum ullamcorper turpis ac, sit sed.",
      image: "/assets/images/cards/tools/api-services.jpg",
      imageDescription: "",
      title: "API Services",
      url: "/search/service_interface_type:API?rows=20&sort=relevance&page=1",
    },
  ];

  return <>
    <DocumentMeta
      title={ "Homepage" }
      description={ "The Planetary Data Systems Homepage" }
    />
    <HomeSearch />
    <ExploreTopicsSixUp {...exploreSixUpTabs} />
    <SubmitDataQuickLinks />
    <ExploreTopicsFourUp
      title="Explore Tools and Services"
      jumpLinkLabel="More About Tools & Services"
      jumpLinkUrl="https://pds.nasa.gov/tools/about/"
      jumpLinkType={"external"}
      content={ <>
          <Stack direction={"row"} spacing={"12px"} style={{overflowX: "scroll", scrollSnapType: "x mandatory"}} display={{md: "none"}}>
            {
              toolsAndServices.map( (tool) => {
                return <>
                  <Card 
                    height={250}
                    image={tool.image}
                    imageDescription={tool.imageDescription}
                    maxWidth={204} 
                    title={tool.title}
                    url={tool.url} 
                    width={204}
                    style={{scrollSnapAlign: "start"}}
                  />

                </>
              })
            }
            </Stack>
          <Grid container spacing={"12px"} display={{xs: "none", md: "flex"}}>
            {
              toolsAndServices.map( (tool) => {
                return <>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Link to={tool.url}>
                      <MediaCard 
                        description={tool.description}
                        image={tool.image}
                        imageDescription={tool.imageDescription}
                        title={tool.title}
                      />
                    </Link>
                  </Grid>
                </>
              })
            }
          </Grid>
        </>
      }
    />
  </>;
};

export default HomePage;