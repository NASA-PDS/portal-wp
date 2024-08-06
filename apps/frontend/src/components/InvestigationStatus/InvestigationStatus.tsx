import { Stack, Typography } from "@mui/material"
import InvestigationStatusLight from "./InvestigationStatusLight";

export type InvestigationStatusProps = {
  stopDate:string,
}

export const InvestigationStatus = ({
  stopDate
}: InvestigationStatusProps) => {

  const statuses = {
    ACTIVE: {
      label: "Active Investigation",
      color: "#47DA84",
      classname: "active"
    },
    COMPLETED: { 
      label: "Completed Investigation",
      color: "#B9B9BB",
      classname: "completed"
    }
  };

  const styles = {
    marginTop: "16px",
    "& .MuiTypography-root":  {
      fontFamily: 'DM Mono',
      fontSize: "12px",
      fontWeight: '500',
      textTransform: 'uppercase',
      lineHeight: "22px",
      letterSpacing: "3.50px",
      wordWrap: 'break-word',
      marginLeft: "8px",
    },
    "& .active": {
      color: '#D1D1D1',
    },
    "& .completed": {
      color: '#58585B',
    }
  }

  const parsedStopDate = Date.parse(stopDate);
  let status = statuses.ACTIVE;

  if( parsedStopDate < Date.now() ) {
    status = statuses.COMPLETED;
  }  
  
  return (
    <Stack direction={"row"} alignItems={"center"} sx={styles}>
      <InvestigationStatusLight color={status.color} />
      <Typography className={status.classname}>
        {status.label}
      </Typography>
    </Stack>
  );
}

export default InvestigationStatus;