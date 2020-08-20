import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, IconButton, makeStyles, Toolbar } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import React from "react";

const useStyles = makeStyles({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

interface Props {
  openDrawer: () => void;
}

export default function Header({ openDrawer }: Props) {
  const classes = useStyles();
  const { user } = useAuth0();
  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <IconButton onClick={openDrawer} size="small" aria-label="avatar">
          <Avatar alt={user?.name} src={user?.picture} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
