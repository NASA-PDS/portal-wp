import Grid from '@mui/material/Grid';

import StatsItem from './StatsItem';
import React from 'react';

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
          return <React.Fragment key={"statsitem_"+index}>
              <Grid item xs={6} md={6} sx={{
                marginTop: "24px"
              }}>
                <StatsItem label={item.label} value={item.value} index={index} enableCopy={item.enableCopy || false} />
              </Grid>
            </React.Fragment>
        })
      }
    </Grid>
  );
}

export default StatsList;