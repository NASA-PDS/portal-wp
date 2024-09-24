import { Box, Container, Grid, Stack } from "@mui/material";
import { Card, ButtonCard, MediaCard, Tabs, Typography } from "@nasapds/wds-react"
import { Link } from "react-router-dom";

import "./ExploreTopicsSixUp.scss";

export type ExploreTopicsSixUpProps = {
  tabs:Array<{label:string, content:{jumpLinkLabel:string, jumpLinkUrl:string, cards:Array<{image:string, imageDescription:string, lid:string, title:string, url:string}>}}>;
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
          <Tabs description={tabsDescription} tabs={
            tabs.map( (tab, tabIndex) => {
              return {
                label: tab.label,
                content: <Box key={tabIndex}>
                  <Stack direction={"row"} spacing={"12px"} style={{overflowX: "scroll", scrollSnapType: "x mandatory"}} display={{md: "none"}}>
                    {
                      tab.content.cards.map( (card, cardIndex) => {
                        return (
                          <Card 
                            height={250}
                            image={card.image}
                            imageDescription={card.imageDescription}
                            maxWidth={204} 
                            title={card.title}
                            url={card.url} 
                            width={204}
                            style={{scrollSnapAlign: "start"}}
                            key={cardIndex}
                          />
                        )
                      })
                    }
                    <Link to={tab.content.jumpLinkUrl}><ButtonCard title={tab.content.jumpLinkLabel} width={"204px"}/></Link>
                  </Stack>
                  <Grid container spacing={"12px"} display={{xs: "none", md: "flex"}}>
                    {
                      tab.content.cards.map( (card, cardIndex) => {
                        return (
                          <Grid item xs={12} sm={6} md={4} lg={2} key={cardIndex}>
                            <Link to={card.url}>
                              <MediaCard 
                                image={card.image}
                                imageDescription={card.imageDescription}
                                title={card.title}
                              />
                            </Link>
                          </Grid>
                        )
                      })
                    }
                    <Grid item md={4} lg={2}><Link to={tab.content.jumpLinkUrl}><ButtonCard title={tab.content.jumpLinkLabel} /></Link></Grid>
                  </Grid>
                </Box>
              }
            })
          } />
      </Container>
    </Container>
  </>
}