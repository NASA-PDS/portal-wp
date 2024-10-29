import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ellipsisText } from 'src/utils/strings';
import { Tag } from '@nasapds/wds-react';

type PrimaryActionFunction = () => void;

export type FeaturedInvestigationLinkListItemProps = {
  description: string,
  instrumentHosts: string,
  lid: string,
  primaryAction:PrimaryActionFunction,
  startDate: string,
  stopDate?: string
  tags: string[], 
  title: string,
  type: string
}

export const FeaturedInvestigationLinkListItem = ({
  description,
  instrumentHosts,
  lid,
  primaryAction,
  startDate,
  stopDate,
  tags,
  title,
  type
}: FeaturedInvestigationLinkListItemProps) => {

  const [showDetails, setShowDetails] = useState<boolean>(false);
  const descriptionLength = 256;

  const toggleDetails = () => {
    setShowDetails( !showDetails );
  }

  return (
    <Stack sx={{
      marginTop: "15px"
    }}>
      <Box>
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
          <Grid item xs={6}>
            <Stack alignItems="left" gap={1} sx={{
              paddingLeft: "15px"
            }}>
              <Link to={{}} onClick={() => primaryAction()}
                style={{
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
              <Typography 
                variant="body1"
                gutterBottom
                sx={{
                  fontFamily: "Inter",
                  fontSize: "12px",
                  lineHeight: "130%",
                  fontWeight: "500",
                }}
                title={description}
              >
                {ellipsisText(description, descriptionLength)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={2} sx={{textAlign: "center"}}>
            <Typography variant="body1" display="block" color='#58585B' sx={{ wordBreak: "break-word", textAlign: "center" }}>
              {type}
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{textAlign: "center"}}>
            <Typography variant="body1" display="block" color='#58585B' sx={{ textTransform: "capitalize", wordWrap: "break-word" }}>
              {instrumentHosts ? instrumentHosts.toLowerCase() : "-"}
            </Typography>
          </Grid>
          <Grid item xs={1} sx={{textAlign: "right"}}>
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
        {/*<Box sx={{
            padding: "20px 20px 20px 0px",
          }}
          display={{xs: "block", md: "none"}}
        >
          <Stack alignItems="left" gap={1} sx={{
              paddingLeft: "15px",
              marginBottom: "8px",
            }}
          >
            <Link to={{}} onClick={() => primaryAction()}
              style={{
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
              {ellipsisText(description, descriptionLength)}
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
              }}>{type}</Typography>
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
              }}>{instrumentHosts ? instrumentHosts : "-"}</Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} gap={1} sx={{paddingTop: "8px"}}>
              <Link to={{}} style={{
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
        </Box>*/}
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
          <Link to={{}} onClick={() => primaryAction()}
            style={{
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
            title={description}
          >
            {ellipsisText(description, descriptionLength)}
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
            >Explore</Typography>
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
              onClick={() => {primaryAction()}}
            >
                <ArrowForward sx={{
                  color: "#FFFFFF",
                  width: "14px",
                }}
              />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      { showDetails &&
        <Box sx={{
          backgroundColor: "#F6F6F6",
          padding: "20px 20px 20px 80px",
        }} display={{xs: "none", md:"block"}}>
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
              textDecorationLine: "none",
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
            }}>Start Date</Typography>
            <Typography sx={{
              fontSize: "12px",
              fontFamily: 'Inter',
              fontWeight: '400',
              textDecoration: 'underline',
              lineHeight: "15.60px",
              letterSpacing: "0.25px",
              textDecorationLine: "none",
              wordWrap: 'break-word'
            }}>{startDate ? startDate : "-"}</Typography>
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
            }}>Stop Date</Typography>
            <Typography sx={{
              fontSize: "12px",
              fontFamily: 'Inter',
              fontWeight: '400',
              textDecoration: 'underline',
              lineHeight: "15.60px",
              letterSpacing: "0.25px",
              textDecorationLine: "none",
              wordWrap: 'break-word'
            }}>{stopDate && stopDate !== "3000-01-01T00:00:00.000Z" ? stopDate : "-"}</Typography>
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
            }}>Instrument Hosts</Typography>
            <Typography sx={{
              color: 'black',
              fontSize: "12px",
              fontFamily: 'Inter',
              fontWeight: '400',
              lineHeight: "15.60px",
              letterSpacing: "0.25px",
              textTransform: "capitalize",
              wordWrap: 'break-word'
            }}>{instrumentHosts ? instrumentHosts.toLowerCase() : "-"}</Typography>
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
                tags.length > 0 && tags.map( (tag, index) => {
                  return <Tag label={tag} key={index}></Tag>
                })
              }
              {
                tags.length === 0 && <Typography sx={{
                  color: 'black',
                  fontSize: "14px",
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: "19px",
                  minWidth: "140px",
                  maxWidth: "140px",
                  wordWrap: "break-word"
                }}>-</Typography>
              }
            </Stack>
          </Stack>
        </Box>
      }
      { showDetails &&
          <Box sx={{
            backgroundColor: "#F6F6F6",
            padding: "20px 20px 20px 20px",
          }} display={{xs: "block", md:"none"}}>
            <Stack direction={"column"} alignItems={"left"} sx={{ marginBottom: "8px"}}>
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
              textDecorationLine: "none",
              wordWrap: 'break-word'
            }}>{lid}</Typography>
          </Stack>
          <Stack direction={"column"} alignItems={"left"} sx={{ marginBottom: "8px"}}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              minWidth: "140px",
              maxWidth: "140px",
              wordWrap: "break-word"
            }}>Start Date</Typography>
            <Typography sx={{
              fontSize: "12px",
              fontFamily: 'Inter',
              fontWeight: '400',
              textDecoration: 'underline',
              lineHeight: "15.60px",
              letterSpacing: "0.25px",
              textDecorationLine: "none",
              wordWrap: 'break-word'
            }}>{startDate ? startDate : "-"}</Typography>
          </Stack>
          <Stack direction={"column"} alignItems={"left"} sx={{ marginBottom: "8px"}}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              minWidth: "140px",
              maxWidth: "140px",
              wordWrap: "break-word"
            }}>Stop Date</Typography>
            <Typography sx={{
              fontSize: "12px",
              fontFamily: 'Inter',
              fontWeight: '400',
              textDecoration: 'underline',
              lineHeight: "15.60px",
              letterSpacing: "0.25px",
              textDecorationLine: "none",
              wordWrap: 'break-word'
            }}>{stopDate ? stopDate : "-"}</Typography>
          </Stack>
          <Stack direction={"column"} alignItems={"left"} sx={{ marginBottom: "8px"}}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              minWidth: "140px",
              maxWidth: "140px",
              wordWrap: "break-word"
            }}>Instrument Hosts</Typography>
            <Typography sx={{
              color: 'black',
              fontSize: "12px",
              fontFamily: 'Inter',
              fontWeight: '400',
              lineHeight: "15.60px",
              letterSpacing: "0.25px",
              textTransform: "capitalize",
              wordWrap: 'break-word'
            }}>{instrumentHosts ? instrumentHosts.toLowerCase() : "-"}</Typography>
          </Stack>
          <Stack direction={"column"} alignItems={"left"} >
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
                tags.length > 0 && tags.map( (tag, index) => {
                  return <Tag label={tag} key={index}></Tag>
                })
              }
              {
                tags.length === 0 && <Typography sx={{
                  color: 'black',
                  fontSize: "14px",
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: "19px",
                  minWidth: "140px",
                  maxWidth: "140px",
                  wordWrap: "break-word"
                }}>-</Typography>
              }
            </Stack>
          </Stack>
          </Box>
      }
    </Stack>
  );
}

export default FeaturedInvestigationLinkListItem;