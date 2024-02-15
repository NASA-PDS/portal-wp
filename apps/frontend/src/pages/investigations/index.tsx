import React, { useEffect } from "react";
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from "@mui/material";
import { FeaturedLinkListItem } from "@nasapds/wds-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getInvestigations } from "../../features/investigations/investigationsSlice";
import { Investigation } from "../../types/investigation.d";

const InvestigationsDirectoryPage = () => {

   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const investigations = useAppSelector( (state) => state.investigations )
   
   useEffect( () => {

      let isMounted = true;

      // If status is 'idle', then fetch the investigations data from the API
      if( investigations.status === "idle" ) {
         dispatch(getInvestigations());
      }

      if( investigations.status === "pending" ) {
         // Do something to inform user that investigation data is being fetched
         console.log("Loading Investigations data from API...");
      } else if ( investigations.status === "succeeded" ) {
         // Do something to handle the successful fetching of data
         console.log("Loading Investigations data from API succeeded!");
      } else if ( investigations.error != null || investigations.error != undefined ) {
         // Do something to handle the error
         console.log(investigations.error);
      }

      // Cleanup function
      return () => {
         isMounted = false
      }

   }, [investigations.status, dispatch]);

   const linkStyles = {
      color: "white",
      fontFamily: "Inter",
      fontSize: "14px",
      fontWeight: "300",
      lineHeight: "19px",
      paddingY: "4px",
   };

   const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

   const getItemsByIndex = (arr:Investigation[], key:string, index:string):Investigation[] => {
      return arr.filter( (item) => {
         //console.log("item:", item)
         return item.shortName[0].toUpperCase().startsWith(index.toUpperCase())
      })
   };

   const investigationListItemPrimaryAction = (path:string) => {
      navigate(path);
   };

   return (
      <Container
         maxWidth={false}
         disableGutters
      >
         {/* Page Intro */}
         <Container
            maxWidth={false} 
            sx={{
               backgroundImage: "url(/assets/images/headers/investigations.png)",
               backgroundSize: "cover",
               backgroundRepeat: 'no-repeat',
               backgroundColor: "white",
               height: "201px",
               textAlign: "left",
               padding: 0,
            }}
         >
            <Container
               maxWidth={"xl"}
               sx={{
                  paddingY: "24px",
                  paddingLeft: "140px",
                  paddingRight: "140px",
               }}
            >
               <Breadcrumbs
                  aria-label='breadcrumb'
                  maxItems={3}
                  sx={{
                     backgroundColor: "rgba(23,23,27,0.17)",
                     paddingY: "3px",
                     paddingX: "5px",
                     borderRadius: "3px",
                  }}
               >
                  <Link underline="hover" color="inherit" href="/"
                     style={linkStyles}>
                     Home
                  </Link>
                  <Typography style={{color: "white"}}>Investigations</Typography>
               </Breadcrumbs>
               <Typography variant="h1" style={{
                     color: "white",
                     padding: "0px",
                     paddingTop: "30px",
                     fontSize: "72px",
                     fontWeight: "700",
                  }}>Investigations</Typography>
            </Container>
         </Container>
         {/* Main Content */}
         <Container
            maxWidth={"xl"}
            sx={{
               paddingY: "80px",
               paddingLeft: "140px",
               paddingRight: "140px",
               textAlign: "center",
            }}>
            <Box>
               {
                  investigations.investigationItems.length > 0 && alphabet.map((letter) => {
                     const filteredInvestigations = getItemsByIndex(investigations.investigationItems, "shortName", letter);
                     const filteredInvestigationsCount = Object.keys(filteredInvestigations).length;
                     const anchorName = filteredInvestigationsCount > 0 ? "#" + letter : undefined;
                     const anchorColor = filteredInvestigationsCount > 0 ? "#1976d2" : "#959599";
                     return (
                        ( filteredInvestigationsCount >= 0 ) ?
                           <Link
                              sx={{
                                 fontFamily: "Inter",
                                 fontSize: "29px",
                                 fontWeight: "700",
                                 lineHeight: "29px",
                                 paddingRight: "10px",
                                 color: anchorColor
                              }}
                              href={anchorName}
                              key={"letter_" + letter}
                              underline="none"
                           >{letter}</Link>
                           :
                           <Typography sx={{
                              fontFamily: "Inter",
                              fontSize: "29px",
                              fontWeight: "700",
                              lineHeight: "29px",
                              paddingRight: "10px",
                           }}>{letter}</Typography>
                     );
                  })
               }
            </Box>
            <Container maxWidth={"xl"}
               sx={{
                  paddingTop: "48px",
                  textAlign: "left",
               }}
            >
               <Box>
                  <Grid container spacing={2} alignItems="left" sx={{
                        paddingY: "10px",
                        paddingLeft: "10px",
                        backgroundColor: "#F6F6F6",
                     }}>
                     <Grid xs={7}>
                        <Typography variant="body1" display="block" color='#58585B' style={{ textTransform: "uppercase", fontWeight: "bold"}}>
                           Investigation Name
                        </Typography>
                     </Grid>
                     <Grid xs={2}>
                        <Typography variant="body1" display="block" color='#58585B' style={{ textTransform: "uppercase", fontWeight: "bold"}}>
                           Investigation Type
                        </Typography>
                     </Grid>
                     <Grid xs={2}>
                        <Typography variant="body1" display="block" color='#58585B' style={{ textTransform: "uppercase", fontWeight: "bold"}}>
                           Affiliated Spacecraft
                        </Typography>
                     </Grid>
                  </Grid>
               </Box>
               <Box>
                  {
                     investigations.investigationItems.length > 0 && alphabet.map((letter) => {
                        
                        const filteredInvestigations = getItemsByIndex(investigations.investigationItems, "shortName", letter);
                        const filteredInvestigationsCount = Object.keys(filteredInvestigations).length;
                        console.log(filteredInvestigations)
                        return (
                           <React.Fragment
                              key={"investigations_" + letter}
                           >
                              <Typography
                                 variant="h3"
                                 sx={{
                                    fontFamily: "Inter",
                                    fontSize: "29px",
                                    fontWeight: "700",
                                    lineHeight: "29px",
                                    paddingRight: "10px",
                                    paddingY: "15px",
                                    color: filteredInvestigationsCount ? "#000000" : "#959599"
                                 }}
                              >
                                 <a id={letter}>{letter}</a>
                              </Typography><br />
                              {
                                 filteredInvestigations.map((investigation:Investigation) => {
                                    return (
                                       <FeaturedLinkListItem
                                          key={investigation.id}
                                          description={investigation.description}
                                          primaryButtonAction={() => investigationListItemPrimaryAction("/investigations/" + investigation.id)}
                                          variant={investigation.type}
                                          affiliated_spacecraft="Affiliated Spacecraft"
                                          title={investigation.longName}
                                       />
                                    );
                                 })
                              }
                           </React.Fragment>
                        );
                     })
                  }
               </Box>
            </Container>
         </Container>
      </Container>
   )
};

export default InvestigationsDirectoryPage;