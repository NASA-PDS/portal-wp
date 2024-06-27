import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Button, Link } from '@mui/material';

type PrimaryActionFunction = () => void;

export type FeaturedInvestigationLinkListItemProps = {
  affiliated_spacecraft: string,
  description: string,
  investigation_type: string,
  primaryAction:PrimaryActionFunction,
  title: string,
}

function stringCleanup(str:string):string {
  
  return str.replace("Mission Overview ================","")
    .replace("Significance ------------","")
    .replace("Cruise Objectives. -----------------", "")
    .replace("TABLE OF CONTENTS ---------------------------------- =", "")
    .replace("============", "")
    .replace("Introduction ------------", "")
    .replace("One-sentence Mission Result Summary =======================", "")
    .replace("MESSENGER ==========", "")
    .replace("ROSETTA Mission Overview = ROSETTA Mission Objectives - Science Objectives = Mission Profile = Mission Phases Overview - Mission Phase Schedule - Solar Conjunctions/Oppositions - Payload Checkouts = Mission Phases Description - Launch phase (LEOP) - Commissioning phase - Cruise phase 1 - Earth swing-by 1 - Cruise phase 2 (and Deep Impact) - Mars swing-by - Cruise phase 3 - Earth swing-by 2 - Cruise phase 4 (splitted in 4-1 and 4-2) - Steins flyby - Earth swing-by 3 - Cruise phase 5 - Lutetia flyby - Rendez-Vous Manouver 1 - Cruise phase 6 - Rendez-Vous Manouver 2 - Near comet drift (NCD) phase - Approach phase - Lander delivery and relay phase - Escort phase - Near perihelion phase - Extended mission = Orbiter Experiments - ALICE - CONSERT - COSIMA - GIADA - MIDAS - MIRO - OSIRIS - ROSINA - RPC - RSI - VIRTIS - SREM = LANDER (PHILAE) - Science Objectives - Lander Experiments = Ground Segment - Rosetta Ground Segment - Rosetta Science Operations Center - Rosetta Mission Operations Center - Rosetta Lander Ground Segment - Lander Control Center - Science Operations and Navigation Center - Rosetta Scientific Data Archive = Acronyms ROSETTA =========================================", "")
    .substring(0,250)
    .concat("...")
}

export const FeaturedInvestigationLinkListItem = ({
  affiliated_spacecraft = '',
  description = '',
  investigation_type = 'data',
  primaryAction,
  title = '',
}: FeaturedInvestigationLinkListItemProps) => {
  
  return (
    <Box>
      <Grid container spacing={8} alignItems="center" display={{xs: "none", md: "flex"}}>
        <Grid item xs={7}>
          <Stack alignItems="left" gap={1} sx={{
            paddingLeft: "15px"
          }}>
            <Link component="button" onClick={() => primaryAction()}
              sx={{
                textAlign: "left",
                color: "#000000",
                textDecoration: "none",
                cursor: "pointer"
              }}>
              <Typography sx={{
                  color: "#000000",
                  fontSize: "14px",
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: "19px",
                  wordWrap: 'break-word'
                }}>
                {title}
              </Typography>
            </Link>

            <Typography variant="body1" gutterBottom
            sx={{
              fontFamily: "Inter",
              fontSize: "12px",
              lineHeight: "130%",
              fontWeight: "500"}}>
              {stringCleanup(description)}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={2} sx={{textAlign: "center"}}>
          <Typography variant="body1" display="block" color='#58585B' sx={{ wordBreak: "break-word", textAlign: "center" }}>
            {investigation_type}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{textAlign: "center"}}>
          <Typography variant="body1" display="block" color='#58585B' sx={{ textTransform: "capitalize", wordWrap: "break-word" }}>
            {affiliated_spacecraft ? affiliated_spacecraft.toLowerCase() : "-"}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton 
            sx={{
              "&:hover": {
                backgroundColor: "#B60109"
              },
              backgroundColor: "#F64137",
              height: "36px",
              width: "36px",
              padding: "18px"
           }}
           aria-label="arrow"
           onClick={() => {primaryAction()}}>
            <ArrowForward sx={{
              color: "#FFFFFF"
            }}
          />
          </IconButton>
        </Grid>
      </Grid>
      <Box sx={{
          padding: "20px 20px 20px 0px",
        }}
        display={{xs: "block", md: "none"}}
      >
        <Stack alignItems="left" gap={1} sx={{
            paddingLeft: "15px",
            marginBottom: "8px",
          }}
        >
          <Link component="button" onClick={() => primaryAction()}
            sx={{
              textAlign: "left",
              color: "#000000",
              textDecoration: "none",
              cursor: "pointer"
            }}>
            <Typography variant="subtitle2" display="inline">
              {title}
            </Typography>
          </Link>

          <Typography variant="body1" gutterBottom
            sx={{
              fontFamily: "Inter",
              fontSize: "12px",
              lineHeight: "130%",
              fontWeight: "500"
            }}
          >
            {stringCleanup(description)}
          </Typography>
        </Stack>
        <Box sx={{paddingLeft: "15px"}}>
          <Stack direction={"row"} alignItems={"center"} sx={{marginBottom: "8px"}}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              minWidth: "140px",
              maxWidth: "140px",
              wordWrap: "break-word"
            }}>Type</Typography>
            <Typography sx={{
              color: 'black',
              fontSize: "12px",
              fontFamily: 'Inter',
              fontWeight: '400',
              lineHeight: "15.60px",
              letterSpacing: "0.25px",
              wordWrap: 'break-word'
            }}>{investigation_type}</Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} sx={{ marginBottom: "8px"}}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              minWidth: "140px",
              maxWidth: "140px",
              wordWrap: "break-word"
            }}>Spacecraft</Typography>
            <Typography sx={{
              color: 'black',
              fontSize: "12px",
              fontFamily: 'Inter',
              fontWeight: '400',
              lineHeight: "15.60px",
              letterSpacing: "0.25px",
              wordWrap: 'break-word'
            }}>{affiliated_spacecraft ? affiliated_spacecraft : "-"}</Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} gap={1} sx={{paddingTop: "8px"}}>
            <Link sx={{
              // Explore
              color: 'black',
              fontSize: "18px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "23px",
              wordWrap: 'break-word',
              textDecoration: "none",
              cursor: "pointer"
              
            }} onClick={() => {primaryAction()}}>
              Explore {title}
            </Link>
            <IconButton 
                sx={{
                  "&:hover": {
                    backgroundColor: "#B60109"
                  },
                  backgroundColor: "#F64137",
                  height: "20px",
                  width: "20px",
                  padding: "10px"
              }}
              aria-label="arrow"
              >
                <ArrowForward sx={{
                  color: "#FFFFFF",
                  width: "14px",
                }}
              />
              </IconButton>
          </Stack>
        </Box>
      </Box>
      <Divider sx={{
        marginTop: "15px",
        marginBottom: "15px"
      }}/>
    </Box>
  );
}

export default FeaturedInvestigationLinkListItem;