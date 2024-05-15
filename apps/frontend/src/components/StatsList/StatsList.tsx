import Grid from '@mui/material/Grid';

import StatsItem from './StatsItem';

export type Stats = {
  label: string;
  value: string;
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
        stats.map(item => {
          return <Grid item xs={6} md={6} sx={{
            /*"&:first-child": {
              marginTop: { 
                xs: "0px",
                md: "0px"
              }
            },*/
            marginTop: "24px"
          }}>
            <StatsItem label={item.label} value={item.value} />
          </Grid>
        })
      }
    </Grid>
  );
}

export default StatsList;