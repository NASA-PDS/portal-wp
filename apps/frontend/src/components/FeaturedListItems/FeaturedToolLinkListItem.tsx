import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Link, Stack } from '@mui/material';
import { Tag } from '@nasapds/wds-react';

type PrimaryActionFunction = () => void;

export type FeaturedToolLinkListItemProps = {
  description: string,
  primaryAction:PrimaryActionFunction,
  tags:Array<Object>
  title:string,
}

export const FeaturedToolLinkListItem = ({
  description = '',
  primaryAction,
  tags,
  title = '',
}: FeaturedToolLinkListItemProps) => {
  
  return (
    <Box sx={{ width: "100%"}}>
      <Grid container spacing={2} sx={{
        minHeight: "64px",
        paddingY: "10px",
        alignItems: "center"

      }}>
        <Grid item xs={7}>
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
        <Grid item xs={3}>
          <Stack direction={"row"} spacing={1} useFlexGap flexWrap="wrap">
            { 
              tags.map( (tag) => {
                return <Tag label={tag.label} />  
              })
            }
          </Stack>
        </Grid>
        <Grid item xs={2} sx={{textAlign:"right"}}>
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

export default FeaturedToolLinkListItem;