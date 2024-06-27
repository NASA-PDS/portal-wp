import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Link as AnchorLink } from '@mui/material';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { stringCleanup } from 'src/utils/strings';

type PrimaryActionFunction = () => void;

export type FeaturedInstrumentLinkListItemProps = {
  description:string,
  lid:string,
  primaryAction:PrimaryActionFunction,
  title:string,
  bundles:[]
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



export const FeaturedInstrumentLinkListItem = ({
  bundles = [],
  description = '',
  lid = '',
  primaryAction,
  title = '',
}: FeaturedInstrumentLinkListItemProps) => {

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
                  stringCleanup(description, lid)
                  /*[
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vulputate scelerisque ligula, sit amet molestie quam faucibus sed. Aenean mattis a sapien ut aliquet.",
                    "Etiam suscipit varius nulla, quis congue neque blandit quis. Donec convallis quam nulla, nec ultrices nunc congue eu. Quisque aliquam urna quis maximus ultrices. ",
                    "Sed rhoncus tortor posuere augue ultrices pretium. Phasellus blandit tortor leo, sed consequat lacus ultricies ut.",
                    "Praesent mauris nisl, rutrum at mattis quis, condimentum non nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
                    "Proin rutrum quis justo sit amet cursus. Duis lacinia blandit turpis, ac mattis nisl lacinia et. Mauris tempus feugiat auctor. Quisque quis orci scelerisque, placerat quam et, dapibus ante."
                  ][Math.floor(Math.random() * 5)]*/
                }
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
              >View Instrument and Data</Typography>
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
          <AnchorLink component="button" onClick={() => primaryAction()}
            sx={{
              textAlign: "left",
              color: "#000000",
              textDecoration: "none",
              cursor: "pointer"
            }}>
            <Typography variant="subtitle2" display="inline">
              {title}
            </Typography>
          </AnchorLink>

          <Typography variant="body1" gutterBottom
            sx={{
              fontFamily: "Inter",
              fontSize: "12px",
              lineHeight: "130%",
              fontWeight: "500"
            }}
          >
            {stringCleanup(description, lid)}
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
            >View Instrument and Data</Typography>
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
          padding: "20px 20px 0px 80px"
        }}>
          <Box sx={{
            marginBottom: "20px"
          }}>
            {
              bundles.length > 0 ? (
                bundles.map( (bundle, index) => {
                  return (
                    <Box key={index} sx={{marginBottom: "20px"}}>
                      <Stack direction={{ xs: "column", "md": "column" }} spacing={0.5}>
                        <Typography sx={{
                          color: '#1C67E3',
                          fontSize: "11px",
                          fontFamily: 'Inter',
                          fontWeight: '700',
                          textDecoration: 'underline',
                          textTransform: 'uppercase',
                          lineHeight: "19px",
                          letterSpacing: "0.25px",
                          wordWrap: 'break-word',
                        }}>{bundle.title}</Typography>
                        <Typography sx={{
                          color: '#17171B',
                          fontSize: "11px",
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          
                          lineHeight: "19px",
                          letterSpacing: "0.25px",
                          paddingLeft: "24px",
                          wordWrap: 'break-word'
                        }}>{bundle.properties["pds:Bundle.pds:description"] !== undefined ? bundle.properties["pds:Bundle.pds:description"][0] : "No Description Available"}</Typography>
                      </Stack>
                    </Box>
                  )
                })
              )
              :
              <Typography sx={{
                color: '#17171B',
                fontSize: "11px",
                fontFamily: 'Inter',
                fontWeight: '400',
                lineHeight: "19px",
                letterSpacing: "0.25px",
                paddingLeft: "24px",
                wordWrap: 'break-word'
              }}>No Bundles Found.</Typography>
            }
          </Box>
          {/*
          <Box sx={{
            marginBottom: "20px"
          }}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              wordWrap: 'break-word'
            }}>
              Raw Data Products
            </Typography>
            {
              [
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
              ].map( item => {
                return <Box sx={{
                  marginBottom: "5px"
                }}>
                  <Link style={styles.link}>{item.title}</Link>
                  <Typography sx={{
                    marginLeft: "32px",
                    color: '#17171B',
                    fontSize: "11px",
                    fontFamily: 'Inter',
                    fontWeight: '400',
                    textTransform: 'uppercase',
                    lineHeight: "19px",
                    letterSpacing: "0.25px",
                    wordWrap: 'break-word'
                  }}>{item.description}</Typography>
                </Box>
              })
            }
          </Box>
          <Box sx={{
            marginBottom: "20px"
          }}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              wordWrap: 'break-word'
            }}>
              Derived Data Products
            </Typography>
            {
              [
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
              ].map( item => {
                return <Box sx={{
                  marginBottom: "5px"
                }}>
                  <Link style={styles.link}>{item.title}</Link>
                  <Typography sx={{
                    marginLeft: "32px",
                    color: '#17171B',
                    fontSize: "11px",
                    fontFamily: 'Inter',
                    fontWeight: '400',
                    textTransform: 'uppercase',
                    lineHeight: "19px",
                    letterSpacing: "0.25px",
                    wordWrap: 'break-word'
                  }}>{item.description}</Typography>
                </Box>
              })
            }
          </Box>
          <Box sx={{
            marginBottom: "20px"
          }}>
            <Typography sx={{
              color: 'black',
              fontSize: "14px",
              fontFamily: 'Inter',
              fontWeight: '600',
              lineHeight: "19px",
              wordWrap: 'break-word'
            }}>
              Derived Data Products from Investigators
            </Typography>
            {
              [
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
                {title:"Lorem Ipsum", description: "Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan posuere dui non scelerisque."},
              ].map( item => {
                return <Box sx={{
                  marginBottom: "5px"
                }}>
                  <Link style={styles.link}>{item.title}</Link>
                  <Typography sx={{
                    marginLeft: "32px",
                    color: '#17171B',
                    fontSize: "11px",
                    fontFamily: 'Inter',
                    fontWeight: '400',
                    textTransform: 'uppercase',
                    lineHeight: "19px",
                    letterSpacing: "0.25px",
                    wordWrap: 'break-word'
                  }}>{item.description}</Typography>
                </Box>
              })
            }
          </Box>*/}
        </Box>
        : <></>
      }
      <Divider />
    </Stack>
  );
}

export default FeaturedInstrumentLinkListItem;