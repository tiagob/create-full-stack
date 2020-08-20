import { useAuth0 } from "@auth0/auth0-react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles({
  list: {
    width: 240,
  },
});

interface Props {
  isDrawerOpen: boolean;
  closeDrawer: () => void;
}

export default function Sidebar({ isDrawerOpen, closeDrawer }: Props) {
  const { logout } = useAuth0();
  const classes = useStyles();
  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={closeDrawer}>
      <List className={classes.list} onClick={closeDrawer}>
        <ListItem button component={RouterLink} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText aria-label="todos" primary="Todos" />
        </ListItem>
        <ListItem button component={RouterLink} to="/about">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText aria-label="about" primary="About" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => logout()}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText aria-label="logout" primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
}
