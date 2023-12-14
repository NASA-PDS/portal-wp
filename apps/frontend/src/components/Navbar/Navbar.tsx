import React from "react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Divider } from "@mui/material";

const navItems = [
   {
      id: 'find-data',
      label: 'Find Data',
      href: '/find-data',
      items: [
         {
            id: 'find-data-1',
            label: 'Find Data Link 1',
            href: '/find-data/find-data-link-1'
         },
         {
            id: 'find-data-2',
            label: 'Find Data Link 2',
            href: '/find-data/find-data-link-2'
         },
         {
            id: 'find-data-3',
            label: 'Find Data Link 3',
            href: '/find-data/find-data-link-3'
         }
      ]
   },
   {
      id: 'tools',
      label: 'Tools',
      href: '/tools'
   },
   {
      id: 'data-standards',
      label: 'Data Standards',
      href: '/data-standards',
      items: [
         {
            id: 'data-standards-link-1',
            label: 'Data Standards Link 1',
            href: '/data-standards/data-standards-link-1'
         },
         {
            id: 'data-standards-link-2',
            label: 'Data Standards Link 2',
            href: '/data-standards/data-standards-link-2'
         },
         {
            id: 'data-standards-link-3',
            label: 'Data Standards Link 3',
            href: '/data-standards/data-standards-link-3'
         }
      ]
   },
   {
      id: 'submit-data',
      label: 'Submit Data',
      href: '/submit-data'
   },
   {
      id: 'about',
      label: 'About',
      href: '/about',
      items: [
         {
            id: 'about-link-1',
            label: 'About Link 1',
            href: '/about/about-link-1'
         },
         {
            id: 'about-link-2',
            label: 'About Link 2',
            href: '/about/about-link-2'
         },
         {
            id: 'about-link-3',
            label: 'About Link 3',
            href: '/about/about-link-2'
         }
      ]
   },
];

export default function Navbar() {

   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget);
   };

   const handleCloseNavMenu = () => {
     setAnchorElNav(null);
   };

   return (
      <>
         <Divider variant="fullWidth" orientation="horizontal" sx={{ bgcolor: '#58585B' }} />
         <AppBar component="nav" position="static" 
            sx={{
               backgroundColor: "#17171B",
            }}>
            <Container maxWidth="xl">
               <Toolbar disableGutters sx={{ justifyContent: "space-between"}}>
                  <div />
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                     {navItems.map((item) => {
                        return ( item.items ?
                           <Button key={item.id} sx={{ fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.1875rem', letterSpacing: '-0.25px', color: '#fff', mr: '32px', textTransform: 'none', }} endIcon={<ExpandCircleDownOutlinedIcon />}>
                              {item.label}
                           </Button>
                           : 
                           <Link to={item.href} key={item.id}>
                              <Button key={item.id} sx={{ fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.1875rem', letterSpacing: '-0.25px', color: '#fff', mr: '32px', textTransform: 'none', }}>
                                 {item.label}
                              </Button>
                           </Link>
                        )
                     }
                     )}
                  </Box>

                  <Box sx={{ display: { sm: 'block', md: 'none' }, }}>
                     <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                        >
                        <ExpandCircleDownOutlinedIcon />
                     </IconButton>
                     <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                           vertical: 'bottom',
                           horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                           display: { xs: 'block', md: 'none' },
                        }}
                        >
                        {navItems.map((item) => (
                           <Link key={item.id} to={item.href}>
                              <MenuItem onClick={handleCloseNavMenu}>
                                 <Typography textAlign="center">{item.label}</Typography>
                              </MenuItem>
                           </Link>
                        ))}
                     </Menu>
                  </Box>
               </Toolbar>
            </Container>
         </AppBar>
      </>
   )
}