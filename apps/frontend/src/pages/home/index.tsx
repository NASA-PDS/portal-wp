import { Grid, Stack } from "@mui/material";
import { Card, ButtonCard, MediaCard } from "@nasapds/wds-react";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { ExploreTopicsSixUp } from "src/components/ExploreTopicsSixUp";
import { SubmitDataQuickLinks } from "src/components/SubmitDataQuickLinks";
import { ExploreTopicsFourUp } from "src/components/ExploreTopicsFourUp";
import { Link } from "react-router-dom";
import { HomeSearch } from "src/components/HomeSearch/HomeSearch";


const HomePage = () => {

  const investigations = [
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
  ];

  const instruments = [
    {
      image: undefined,
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
  ];

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
    <ExploreTopicsSixUp
      tabs={[
        {
          label: "Investigations",
          content: <>
            <Stack direction={"row"} spacing={"12px"} style={{overflowX: "scroll", scrollSnapType: "x mandatory"}} display={{md: "none"}}>
              {
                investigations.map( (investigation) => {
                  return <>
                    <Card 
                      height={250}
                      image={investigation.image}
                      imageDescription={investigation.imageDescription}
                      maxWidth={204} 
                      title={investigation.title}
                      url={investigation.url} 
                      width={204}
                      style={{scrollSnapAlign: "start"}}
                    />
                  </>
                })
              }
              <Link to={"/investigations"}><ButtonCard title={"More Investigations"} width={"204px"}/></Link>
            </Stack>
            <Grid container spacing={"12px"} display={{xs: "none", md: "flex"}}>
              {
                investigations.map( (investigation) => {
                  return <>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                      <Link to={investigation.url}>
                        <MediaCard 
                          image={investigation.image}
                          imageDescription={investigation.imageDescription}
                          title={investigation.title}
                        />
                      </Link>
                    </Grid>
                  </>
                })
              }
              <Grid item md={4} lg={2}><Link to={"/investigations"}><ButtonCard title={"More Investigations"} /></Link></Grid>
            </Grid>
          </>
        },
        {
          label: "Instruments",
          content: <>
            <Stack direction={"row"} spacing={"12px"} style={{overflowX: "scroll", scrollSnapType: "x mandatory"}} display={{md: "none"}}>
              {
                instruments.map( (instrument) => {
                  return <>
                    <Card 
                      height={250}
                      image={instrument.image}
                      imageDescription={instrument.imageDescription}
                      maxWidth={204} 
                      title={instrument.title}
                      url={instrument.url} 
                      width={204}
                      style={{scrollSnapAlign: "start"}}
                    />
                  </>
                })
              }
              <Link to={"/instruments"}><ButtonCard title={"More Instruments"} width={"204px"}/></Link>
            </Stack>
            <Grid container spacing={"12px"} display={{xs: "none", md: "flex"}}>
              {
                instruments.map( (instrument) => {
                  return <>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                      <Link to={instrument.url}>
                        <MediaCard 
                          image={instrument.image}
                          imageDescription={instrument.imageDescription}
                          title={instrument.title}
                        />
                      </Link>
                    </Grid>
                  </>
                })
              }
              <Grid item md={4} lg={2}><Link to={"/instruments"}><ButtonCard title={"More Instruments"} /></Link></Grid>
            </Grid>
          </>
        }
      ]}
      tabsDescription="Explore the PDS Data Archive by browsing data by the categories they are orgnized within."
      title={"Explore our Data Archive"} 
    />
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