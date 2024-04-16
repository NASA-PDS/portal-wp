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
          return <Grid item xs={12} md={6}>
            <StatsItem label={item.label} value={item.value}/>
          </Grid>
        })
      }
    </Grid>
  );
}

export default StatsList;