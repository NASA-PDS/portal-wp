import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Link } from '@mui/material';

type PrimaryActionFunction = () => void;

export type FeaturedInvestigationLinkListItemProps = {
  affiliated_spacecraft: string,
  description: string,
  investigation_type: string,
  primaryAction:PrimaryActionFunction,
  title: string,
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
              {description}
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
            {description}
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