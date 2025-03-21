import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import { Link } from '@mui/material';
import { Tag } from '@nasapds/wds-react';
import { ellipsisText } from 'src/utils/strings';

type PrimaryActionFunction = () => void;

export type FeaturedTargetLinkListItemProps = {
  description:string,
  lid:string,
  primaryAction:PrimaryActionFunction,
  tags:string[],
  title:string,
  type:string,
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
      marginTop: "15px"
    }}>
      <Box sx={{ width: "100%"}}>
        <Grid container spacing={2} sx={{
            minHeight: "64px",
            paddingY: "10px",
            alignItems: "center"
          }}
          display={{xs: "none", md: "flex"}}
        >
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
                {ellipsisText(description, 256)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Stack direction="row">
                <Typography sx={{
                  color: 'black',
                  fontSize: 16,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: '20px',
                  wordWrap: "break-word"
                }}
                >View Targets<br />and Data</Typography>
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
                </Stack>
              </Grid>
            </Grid>
      </Box>
      <Stack
        sx={{
          padding: "20px 20px 20px 0px",
        }}
        display={{xs: "flex", md: "none"}}
        direction={"row"}
        alignItems={"top"}
      >
        <Box sx={{height: "100%"}}>
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
        </Box>
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
            {ellipsisText(description, 256)}
          </Typography>

          <Stack direction="row" alignItems={"center"} gap={1}>
            <Typography sx={{
              color: 'black',
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: '20px',
              wordWrap: "break-word"
            }}
            >View Targets and Data</Typography>
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
              onClick={() => {primaryAction()}}>
                <ArrowForward sx={{
                  color: "#FFFFFF",
                  width: "14px"
                }}
              />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
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
            <Stack direction={"row"} spacing={1} useFlexGap flexWrap="wrap">
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
      <Divider />
    </Stack>
  );
}

export default FeaturedTargetLinkListItem;