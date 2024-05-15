import { Box, Divider, Typography } from "@mui/material"

export type StatsItemProps = {
  label:string,
  value:string,
}

export const StatsItem = ({
  label,
  value
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
      <Typography sx={{
        color: 'white',
        fontSize: "14px",
        fontFamily: 'Inter',
        fontWeight: '600',
        lineHeight: "19px",
        wordWrap: 'break-word',
        marginTop: "4px"
      }}>{value}</Typography>
    </Box>
  );
}

export default StatsItem;