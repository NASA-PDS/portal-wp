import { Grid, Stack } from "@mui/material";
import { Card, LinkCard, MediaCard } from "@nasapds/wds-react";
import { DocumentMeta } from "src/components/DocumentMeta/DocumentMeta";
import { ExploreTopicsSixUp } from "src/components/ExploreTopicsSixUp";
import { SubmitDataQuickLinks } from "src/components/SubmitDataQuickLinks";

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
                  return <>
                    <Card 
                      height={250}
                      image={investigation.image}
                      imageDescription={investigation.imageDescription}
                      maxWidth={204} 
                      title={investigation.title}
                      url={investigation.url} 
                      width={204} 
                    />
                  </>
                })
              }
              <LinkCard title={"More Investigations"} url={"/investigations"} />
            </Stack>
          </>
        },
        {
          label: "Instruments",
          content: <>
          <Stack direction={"row"} gap={"12px"}>
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
                  />
                </>
              })
            }
            <LinkCard title={"More Instruments"} url={"/instruments"} />
          </Stack>
        </>
        },
        {
          label: "Investigations (Grid)",
          content: <>
            <Grid container spacing={"12px"}>
              {
                investigations.map( (investigation) => {
                  return <>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                      <MediaCard 
                        image={investigation.image}
                        imageDescription={investigation.imageDescription}
                        title={investigation.title}
                        url={investigation.url}
                      />
                    </Grid>
                  </>
                })
              }
            <Grid item xs={12} sm={6} md={4} lg={2}><LinkCard title={"More Investigations"} url={"/investigations"} /></Grid>
          </Grid>
          </>
        },
      ]}
      tabsDescription="Explore the PDS Data Archive by browsing data by the categories they are orgnized within."
      title={"Explore our Data Archive"}
    />
    <SubmitDataQuickLinks />
  </>;
};

export default HomePage;