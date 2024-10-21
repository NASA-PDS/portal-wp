import { Box, Divider, Typography } from "@mui/material"
import { copyToClipboard } from "src/utils/strings";

export type StatsItemProps = {
  label:string,
  value:string,
  index:number,
  enableCopy:boolean
}

export const StatsItem = ({
  label,
  value,
  index,
  enableCopy = false
}: StatsItemProps) => {
  
  return (
    <Box sx={{
      minHeight: { md: "77px" },
      marginBottom: { xs: "0px", md: "24px"},
    }}>
      <Divider variant="fullWidth" orientation="horizontal" sx={{
        backgroundColor: "#D1D1D1"
      }} />
      <Typography sx={{
        color: 'white',
        fontSize: "11px",
        fontFamily: 'Inter',
        fontWeight: '700',
        textTransform: 'uppercase',
        lineHeight: "19px",
        letterSpacing: 0.25,
        wordWrap: 'break-word',
        marginTop: "8px"
      }}>{label}</Typography>
      <Typography id={'stat_'+index} sx={{
        color: 'white',
        fontSize: "14px",
        fontFamily: 'Inter',
        fontWeight: '600',
        lineHeight: "19px",
        wordWrap: 'break-word',
        marginTop: "4px"
      }}>{value}</Typography>
      {
        enableCopy && <Typography sx={{
            color: 'white',
            cursor: "pointer",
            fontSize: "14px",
            fontFamily: 'Inter',
            fontWeight: '600',
            lineHeight: "19px",
            marginTop: "4px"
          }} 
          onClick={() => {copyToClipboard("stat_"+index)}}>
            Copy to Clipboard
        </Typography>
      }
    </Box>
  );
}

export default StatsItem;