import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import { Link as AnchorLink } from '@mui/material';
import { Link } from "react-router-dom";

export type FeaturedTargetLinkListItemProps = {
  description: string,
  primaryAction:Function,
  title: string,
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
  primaryAction,
  title = '',
}: FeaturedTargetLinkListItemProps) => {

  const [showDetails, setShowDetails] = useState<boolean>(false);

  const toggleDetails = () => {
    setShowDetails( !showDetails );
  }
  
  return (
    <Stack sx={{
      marginBottom: "15px"
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
                {description.substring(0, 275) + "..."}
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
          minHeight: "200px"
        }}>

        </Box>
        : ""
      }
    </Stack>
  );
}

export default FeaturedTargetLinkListItem;