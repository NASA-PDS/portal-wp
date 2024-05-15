import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Link, Stack } from '@mui/material';
import { Tag } from '@nasapds/wds-react';
import { useState } from 'react';

type PrimaryActionFunction = () => void;

export type FeaturedResrouceLinkListItemProps = {
  description:string
  format:string
  primaryAction:PrimaryActionFunction
  size:string
  tags:string[]
  title:string
  year:string
  version:string
}

export const FeaturedResrouceLinkListItem = ({
  description = '',
  format,
  primaryAction,
  size,
  tags=[],
  title,
  year,
  version = ''
}: FeaturedResrouceLinkListItemProps) => {

  const [showDetails, setShowDetails] = useState<boolean>(false);

  const toggleDetails = () => {
    setShowDetails( !showDetails );
  }
  
  return (
    <Stack sx={{
      marginTop: "15px"
    }}>
      <Box sx={{ width: "100%"}}>
        <Grid container spacing={2} sx={{
          minHeight: "77px",
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
          <Grid item xs={6}>
            <Stack alignItems="left" gap={1}>
              <Link component="button" onClick={() => primaryAction()}
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
              </Link>
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
                gutterBottom
                >
                {description.substring(0, 275) + "..."}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={1}>
            {version}
          </Grid>
          <Grid item xs={1}>
            {year}
          </Grid>
          <Grid item xs={1}>
            {size}
          </Grid>
          <Grid item xs={1}>
            {format}
          </Grid>
          <Grid item xs={1} sx={{textAlign:"right"}}>
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
        <Divider sx={{
          marginTop: "15px",
        }}/>
      </Box>
      { showDetails ?
        <Box sx={{
          backgroundColor: "#F6F6F6",
          padding: "20px 20px 20px 80px",
        }}>
          {
            [
              {label: "Version", value: version},
              {label: "Year", value: year},
              {label: "Format", value: format},
              {label: "Size", value: size},
            ].map( (metadata, index) => {
              return <Stack direction={"row"} alignItems={"center"} sx={{ marginBottom: "8px"}} key={index}>
                <Typography sx={{
                  color: 'black',
                  fontSize: "14px",
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: "19px",
                  minWidth: "140px",
                  maxWidth: "140px",
                  wordWrap: "break-word"
                }}>{metadata.label}</Typography>
                <Typography sx={{
                  fontSize: "12px",
                  fontFamily: 'Inter',
                  fontWeight: '400',
                  lineHeight: "15.60px",
                  letterSpacing: "0.25px",
                  wordWrap: 'break-word'
                }}>{metadata.value}</Typography>
              </Stack>
            })
          }
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

export default FeaturedResrouceLinkListItem;