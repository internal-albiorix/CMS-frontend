import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { NavLink as RouterLink } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { getSecureLocalStorage } from "../../helpers/SecureLocalStorage";

interface HeaderProps {
  toggleSideBar: () => void;
  isSidebarOpen: boolean;
}

const HeaderBar: React.FC<HeaderProps> = (
  props: React.PropsWithChildren<HeaderProps>
) => {
  const { isSidebarOpen, toggleSideBar } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const toggleProfileMenu =
    (ops: string) => (event: React.MouseEvent<HTMLElement>) => {
      if (ops === "open") setAnchorEl(event.currentTarget);
      else setAnchorEl(null);
    };

  const toggleProfileMobileMenu =
    (ops: string) => (event: React.MouseEvent<HTMLElement>) => {
      if (ops === "open") setMobileMoreAnchorEl(event.currentTarget);
      else setMobileMoreAnchorEl(null);
    };

  const profileMenuItems = [
    {
      menuName: "Profile",
      menuIcon: <PersonIcon fontSize="small" />,
      menuLink: "profile",
    },
    {
      menuName: "Logout",
      menuIcon: <Logout fontSize="small" />,
      menuLink: "/",
    },
  ];
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={toggleProfileMenu("close")}
      onClick={toggleProfileMenu("close")}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          width: 190,
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {profileMenuItems.map((item) => (
        <MenuItem
          onClick={toggleProfileMenu("close")}
          key={item.menuName}
          component={RouterLink}
          to={item.menuLink}
        >
          <ListItemIcon>{item.menuIcon}</ListItemIcon>
          {item.menuName}
        </MenuItem>
      ))}
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      open={isMobileMenuOpen}
      onClose={toggleProfileMobileMenu("close")}
      onClick={toggleProfileMobileMenu("close")}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
    >
      {profileMenuItems.map((item) => (
        <MenuItem
          onClick={toggleProfileMobileMenu("close")}
          key={item.menuName}
          component={RouterLink}
          to={item.menuLink}
        >
          <ListItemIcon>{item.menuIcon}</ListItemIcon>
          {item.menuName}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#DE4948" }}>
        <Toolbar>
          <IconButton
            onClick={toggleSideBar}
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            sx={{ flexGrow: 1 }}
          >
            CMS
          </Typography>

          {/* Profile menu for web/desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              onClick={toggleProfileMenu("open")}
              color="inherit"
            >
              <Avatar
                alt="profile user"
                src={""}
                sx={{ width: 32, height: 32, marginRight: 2 }}
              />
              <Typography variant="subtitle1">
                {getSecureLocalStorage("fullname")}
              </Typography>
            </IconButton>
          </Box>

          {/* Profile menu for mobile */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={toggleProfileMobileMenu("open")}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};
export default HeaderBar;
