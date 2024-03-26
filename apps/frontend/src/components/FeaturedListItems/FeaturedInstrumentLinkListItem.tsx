import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Container, Icon, Link } from '@mui/material';

export type FeaturedInstrumentLinkListItemProps = {
  description: string,
  primaryAction:Function,
  title: string,
}

export const FeaturedInstrumentLinkListItem = ({
  description = '',
  primaryAction,
  title = '',
}: FeaturedInstrumentLinkListItemProps) => {
  
  return (
    <Box sx={{ width: "100%"}}>
      <Grid container spacing={2} sx={{
        minHeight: "64px",
        paddingY: "10px",
        alignItems: "center"

      }}>
        <Grid item xs={1}>
          <IconButton>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9.5" transform="rotate(-90 10 10)" stroke="black"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M11.0552 10L7.80005 6.76716L8.57249 6L12.6 10L8.57249 14L7.80005 13.2328L11.0552 10Z" fill="black"/>
            </svg>
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
              {description.substring(0, 275) + "..."}
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
      <Divider sx={{
        marginTop: "15px",
        marginBottom: "15px"
      }}/>
    </Box>
  );
}

export default FeaturedInstrumentLinkListItem;