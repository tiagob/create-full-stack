import { IconButton, makeStyles, Toolbar } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { grey } from "@material-ui/core/colors";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";

const useStyles = makeStyles({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  infoIcon: {
    color: grey[100],
  },
});

interface Props {
  openDrawer: () => void;
}

export default function Header({ openDrawer }: Props) {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <IconButton aria-label="menu" size="small" onClick={openDrawer}>
          <MenuIcon className={classes.infoIcon} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
