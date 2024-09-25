import { Box, Container, Grid, Stack } from "@mui/material";
import { Button, Typography } from "@nasapds/wds-react";

import "./Hero.scss";

export type HeroProps = {
  title: string;
  primaryTitle: string;
  imageSrc: string;
  text: string;
  buttonLink: string;
  buttonText: string;
};

export const Hero = (props: HeroProps) => {
  const { title, primaryTitle, imageSrc, text, buttonLink, buttonText } = props;

  return (
    <Box
      sx={{
        color: "white",
        textAlign: "left",
        minHeight: "280px",
        background: `linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0) 50%),linear-gradient(to top, rgba(0,0,0,1), rgba(255,255,255,0) 40%), url(" ${imageSrc} ")`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Container
          maxWidth={"xl"}
          sx={{
            paddingY: "24px",
          }}
        >
          <Grid
            container
            spacing={4}
            direction="row"
            columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
          >
            <Grid item xs={4} sm={8} md={6} lg={5}>
              <Stack>
                <Typography
                  sx={{ paddingBottom: "12px" }}
                  variant="h2"
                  weight="light"
                >
                  {title}
                </Typography>
                <Typography
                  sx={{ paddingBottom: "12px" }}
                  variant="display6"
                  weight="bold"
                >
                  {primaryTitle}
                </Typography>
                <Typography
                  sx={{ paddingBottom: "12px" }}
                  variant="body2"
                  weight="regular"
                >
                  {text}
                </Typography>
                <Button
                  sx={{ width: "fit-content", textTransform: "none" }}
                  variant="cta"
                  size="large"
                  href={buttonLink}
                >
                  {buttonText}
                </Button>
              </Stack>
            </Grid>
            <Grid
              item
              xs={0}
              sm={0}
              md={6}
              lg={7}
              sx={{
                display: { xs: "none", md: "block" },
              }}
            ></Grid>
          </Grid>
        </Container>
      </Container>
    </Box>
  );
};
