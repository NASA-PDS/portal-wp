import Grid from '@mui/material/Grid';

import StatsItem from './StatsItem';

export type Stats = {
  label: string;
  value: string;
  enableCopy?: boolean
}

type StatProps = {
  stats:Stats[]
}

export const StatsList = ({
  stats
}: StatProps) => {
  
  return (
    <Grid container spacing={2}>
      {
        stats.map((item,index) => {
          return <Grid item xs={6} md={6} sx={{
            /*"&:first-child": {
              marginTop: { 
                xs: "0px",
                md: "0px"
              }
            },*/
            marginTop: "24px"
          }}>
            <StatsItem label={item.label} value={item.value} index={index} enableCopy={item.enableCopy || false} />
          </Grid>
        })
      }
    </Grid>
  );
}

export default StatsList;