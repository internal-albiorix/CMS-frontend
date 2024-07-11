import React, { useState } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ContactsIcon from "@mui/icons-material/Contacts";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddAlarmIcon from "@mui/icons-material/AddAlarm";
import SummarizeIcon from "@mui/icons-material/Summarize";
import GroupIcon from "@mui/icons-material/Group";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BookIcon from "@mui/icons-material/Book";
import TemplateIcon from "@mui/icons-material/FileCopyOutlined";
import LogIcon from "@mui/icons-material/History";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import IntegrationInstructionsSharpIcon from "@mui/icons-material/IntegrationInstructionsSharp";
import { getSecureLocalStorage } from "../../helpers/SecureLocalStorage";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = (
  props: React.PropsWithChildren<SidebarProps>
) => {
  const { isSidebarOpen } = props;
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const drawerWidth: number = 240;

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
    ".MuiDrawer-paper .active": {
      color: "#DE4948",

      ".MuiTypography-root": {
        fontWeight: "bold",
      },

      ".MuiSvgIcon-root": {
        color: "#DE4948",
      },
    },
  }));

  //To render side bar menu items
  const renderMenuItems = () => {
    const menuItems = [
      {
        menuLink: "dashboard",
        menuName: "Dashboard",
        menuIcon: <DashboardIcon />,
        roles: "1,2,3",
      },
      {
        menuLink: "inquiries",
        menuName: "Inquiries",
        menuIcon: <GroupIcon />,
        roles: "1,2",
      },
      {
        menuLink: "candidates",
        menuName: "Candidate",
        menuIcon: <GroupIcon />,
        roles: "1,2,3",
      },
      {
        menuLink: "scheduleInterview",
        menuName: "Schedule Interview",
        menuIcon: <CalendarIcon />,
        roles: "1,2,3",
      },
      {
        menuLink: "users",
        menuName: "Users",
        menuIcon: <ContactsIcon />,
        roles: "1,2",
      },
      {
        menuLink: "current-openings",
        menuName: "Current Openings",
        menuIcon: <PersonAddIcon />,
        roles: "1,2,3",
      },
      {
        menuLink: "refer-employee",
        menuName: "Refer Employee",
        menuIcon: <AddAlarmIcon />,
        roles: "1,2",
      },
      {
        menuLink: "reports",
        menuName: "Reports",
        menuIcon: <SummarizeIcon />,
        roles: "1,2",
      },
      {
        menuLink: "master",
        menuName: "Master",
        menuIcon: <SettingsApplicationsIcon />,
        roles: "1",
        subMenu: [
          {
            menuLink: "status",
            menuName: "Status",
            menuIcon: <MilitaryTechIcon />,
          },
          {
            menuLink: "interviewRound",
            menuName: "Interview Round",
            menuIcon: <AssignmentIcon />,
          },
          {
            menuLink: "technology",
            menuName: "Technology",
            menuIcon: <IntegrationInstructionsSharpIcon />,
          },
          {
            menuLink: "designation",
            menuName: "Designation",
            menuIcon: <BookIcon />,
          },
          {
            menuLink: "emailtemplate",
            menuName: "EmailTemplate",
            menuIcon: < TemplateIcon/>,
          },
          {
            menuLink: "emaillog",
            menuName: "EmailLog",
            menuIcon: < LogIcon/>,
          },
        ],
      },
    ];

    const renderDropDownItems = (subMenu: any[]) => (
      <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subMenu.map(
            (subItem: {
              menuLink: string;
              menuIcon: React.ReactElement<React.JSXElementConstructor<any>>;
              menuName: string;
            }) => (
              <Tooltip
                title={isSidebarOpen ? "" : subItem.menuName}
                placement="right"
                arrow
                key={subItem.menuName}
              >
                <ListItemButton
                  component={RouterLink}
                  to={subItem.menuLink}
                  sx={{ pl: 4 }}
                  key={subItem.menuLink}
                >
                  <ListItemIcon>{subItem.menuIcon}</ListItemIcon>
                  <ListItemText primary={subItem.menuName} />
                </ListItemButton>
              </Tooltip>
            )
          )}
        </List>
      </Collapse>
    );

    return menuItems.map((item) => {
      const checkUserInRole = (roles: any) => {
        if (roles == null) {
          return true;
        }
        if (roles.split(",").includes(getSecureLocalStorage("role"))) {
          return true;
        } else {
          return false;
        }
      };

      if (checkUserInRole(item?.roles)) {
        return !item.subMenu ? (
          <React.Fragment key={item.menuLink}>
            <Tooltip
              title={isSidebarOpen ? "" : item.menuName}
              placement="right"
              arrow
            >
              <ListItemButton component={RouterLink} to={item.menuLink}>
                <ListItemIcon>{item.menuIcon}</ListItemIcon>
                <ListItemText primary={item.menuName} />
              </ListItemButton>
            </Tooltip>
          </React.Fragment>
        ) : (
          <React.Fragment key={item.menuLink}>
            <Tooltip
              title={isSidebarOpen ? "" : item.menuName}
              placement="right"
              arrow
            >
              <ListItemButton onClick={toggleSubMenu}>
                <ListItemIcon>{item.menuIcon}</ListItemIcon>
                <ListItemText primary={item.menuName} />
                {item.menuName === "Master" && isSubMenuOpen ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>
            </Tooltip>
            {renderDropDownItems(item.subMenu)}
          </React.Fragment>
        );
      }
    });
  };

  return (
    <Drawer variant="permanent" open={isSidebarOpen}>
      <List component="nav">{renderMenuItems()}</List>
    </Drawer>
  );
};

export default Sidebar;
