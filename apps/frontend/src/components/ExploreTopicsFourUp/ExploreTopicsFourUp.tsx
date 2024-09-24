import { Container, Grid, Stack as MuiStack, Stack } from "@mui/material"
import { Link } from "react-router-dom";
import { Card, MediaCard, PrimaryButton, Typography } from "@nasapds/wds-react"

import "./ExploreTopicsFourUp.scss";

export type ExploreTopicsFourUpProps = {
  cards:Array<{description:string, image:string, imageDescription:string, title:string, url:string}>;
  title:string;
  jumpLinkUrl:string;
  jumpLinkLabel:string;
  jumpLinkType:"internal" | "external";
}

export const ExploreTopicsFourUp = ({
  cards,
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
          <Stack direction={"row"} spacing={"12px"} style={{overflowX: "scroll", scrollSnapType: "x mandatory"}} display={{md: "none"}}>
            {
              cards.map( (card) => {
                return <>
                  <Card 
                    height={250}
                    image={card.image}
                    imageDescription={card.imageDescription}
                    maxWidth={204}
                    title={card.title}
                    url={card.url} 
                    width={204}
                    style={{scrollSnapAlign: "start"}}
                  />

                </>
              })
            }
            </Stack>
          <Grid container spacing={"12px"} display={{xs: "none", md: "flex"}}>
            {
              cards.map( (card) => {
                return <>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Link to={card.url}>
                      <MediaCard 
                        description={card.description}
                        image={card.image}
                        imageDescription={card.imageDescription}
                        title={card.title}
                      />
                    </Link>
                  </Grid>
                </>
              })
            }
          </Grid>
      </Container>
    </Container>
  </>
}