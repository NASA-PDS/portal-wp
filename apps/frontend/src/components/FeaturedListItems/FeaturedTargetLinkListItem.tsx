import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import { Link as AnchorLink } from '@mui/material';
import { Tag } from '@nasapds/wds-react';

type PrimaryActionFunction = () => void;

export type FeaturedTargetLinkListItemProps = {
  description:string,
  lid:string,
  primaryAction:PrimaryActionFunction,
  tags:string[],
  title:string,
  type:string,
}

const styles = {
  link: {
    color: '#1C67E3',
    fontSize: "11px",
    fontFamily: 'Inter',
    fontWeight: '700',
    textDecoration: 'underline',
    textTransform: 'uppercase',
    lineHeight: "19px",
    letterSpacing: "0.25px",
    wordWrap: 'break-word'
  }
}

export const FeaturedTargetLinkListItem = ({
  description = '',
  lid,
  primaryAction,
  tags = [],
  title,
  type,
}: FeaturedTargetLinkListItemProps) => {

  const [showDetails, setShowDetails] = useState<boolean>(false);

  const toggleDetails = () => {
    setShowDetails( !showDetails );
  }
  
  return (
    <Stack sx={{
      marginTop: "15px",
    }}>
      <Box sx={{ width: "100%"}}>
        <Grid container spacing={2} sx={{
          minHeight: "64px",
          paddingY: "10px",
          alignItems: "center"
        }}>
          <Grid item xs={1}>
            <IconButton onClick={toggleDetails}>
              {
                showDetails ? 
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10.0004" r="9.5" stroke="black"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 11.0555L13.2328 7.80042L14 8.57286L10 12.6004L6 8.57286L6.76716 7.80042L10 11.0555Z" fill="black"/>
                  </svg>
                :
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="9.5" transform="rotate(-90 10 10)" stroke="black"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.0552 10L7.80005 6.76716L8.57249 6L12.6 10L8.57249 14L7.80005 13.2328L11.0552 10Z" fill="black"/>
                  </svg>
              }

            </IconButton>
          </Grid>
          <Grid item xs={4}>
            <AnchorLink component="button" onClick={() => primaryAction()}
              sx={{
                textAlign: "left",
                color: "#000000",
                textDecoration: "none",
                cursor: "pointer"
              }}>
              <Typography sx={{
                color: 'black',
                fontSize: "1.125rem",
                fontFamily: 'Inter',
                fontWeight: '600',
                lineHeight: '23px',
                wordWrap: 'break-word'
              }}>
                {title}
              </Typography>
            </AnchorLink>
          </Grid>
          <Grid item xs={5}>
            <Typography
              sx={{
                color: 'black',
                fontSize: '0.75rem',
                fontFamily: 'Inter',
                fontWeight: '400',
                lineHeight: '16px',
                letterSpacing: "0.25px",
                wordWrap: 'break-word'
              }}
              >
                {
                  lid.toUpperCase().includes("MARS") ? (
                    "Mars is no place for the faint-hearted. It’s dry, rocky, and bitter cold. The fourth planet from the Sun, Mars, is one of Earth's two closest planetary neighbors (Venus is the other)."
                  ) : (
                    [
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vulputate scelerisque ligula, sit amet molestie quam faucibus sed. Aenean mattis a sapien ut aliquet.",
                      "Etiam suscipit varius nulla, quis congue neque blandit quis. Donec convallis quam nulla, nec ultrices nunc congue eu. Quisque aliquam urna quis maximus ultrices.",
                      "Sed rhoncus tortor posuere augue ultrices pretium. Phasellus blandit tortor leo, sed consequat lacus ultricies ut.",
                      "Praesent mauris nisl, rutrum at mattis quis, condimentum non nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
                      "Proin rutrum quis justo sit amet cursus. Duis lacinia blandit turpis, ac mattis nisl lacinia et. Mauris tempus feugiat auctor. Quisque quis orci scelerisque, placerat quam et, dapibus ante."
                    ][Math.floor(Math.random() * 5)]
                  )
                }
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{textAlign:"right"}}>
            <Grid container spacing={1} sx={{alignItems: "center", width: "fit-content"}}>
              <Grid item>
                <Typography sx={{
                  color: 'black',
                  fontSize: 16,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: '20px',
                  textAlign: "left",
                  wordWrap: "break-word"
                }}
                >View Targets<br />and Data</Typography>
              </Grid>
              <Grid item>
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
          </Grid>
        </Grid>
        <Divider sx={{
          marginTop: "15px",
        }}/>
      </Box>
      { showDetails ?
        <Box sx={{
          backgroundColor: "#F6F6F6",
          padding: "20px 20px 20px 80px",
        }}>
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
            }}>Identifier</Typography>
            <Typography sx={{
              fontSize: "12px",
              fontFamily: 'Inter',
              fontWeight: '400',
              textDecoration: 'underline',
              lineHeight: "15.60px",
              letterSpacing: "0.25px",
              wordWrap: 'break-word'
            }}>{lid}</Typography>
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
            }}>Type</Typography>
            <Typography sx={{
              color: 'black',
              fontSize: "12px",
              fontFamily: 'Inter',
              fontWeight: '400',
              lineHeight: "15.60px",
              letterSpacing: "0.25px",
              wordWrap: 'break-word'
            }}>{type}</Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} >
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              minWidth: "140px",
              maxWidth: "140px",
              wordWrap: "break-word"
            }}>Tags</Typography>
            <Stack direction={"row"} spacing={1}>
              {
                tags.map( (tag, index) => {
                  return <Tag label={tag} key={index}></Tag>
                })
              }
            </Stack>
          </Stack>
        </Box>
        : ""
      }
    </Stack>
  );
}

export default FeaturedTargetLinkListItem;