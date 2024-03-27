import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Link } from '@mui/material';

export type FeaturedInvestigationLinkListItemProps = {
  affiliated_spacecraft: string,
  description: string,
  investigation_type: string,
  primaryAction:Function,
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
      <Grid container spacing={8} alignItems="center">
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
              <Typography variant="subtitle2" display="inline">
                {title}
              </Typography>
            </Link>

            <Typography variant="body1" gutterBottom noWrap
            sx={{
              fontFamily: "Inter",
              fontSize: "12px",
              lineHeight: "130%",
              fontWeight: "500"}}>
              {description}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1" display="block" color='#58585B' sx={{ wordBreak: "break-word", textAlign: "center" }}>
            {investigation_type}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1" display="block" color='#58585B' sx={{ wordBreak: "break-word" }}>
            {affiliated_spacecraft}
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
      <Divider sx={{
        marginTop: "15px",
        marginBottom: "15px"
      }}/>
    </Box>
  );
}

export default FeaturedInvestigationLinkListItem;