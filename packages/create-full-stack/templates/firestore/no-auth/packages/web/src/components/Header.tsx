import {
  IconButton,
  Link,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { grey } from "@material-ui/core/colors";
import InfoIcon from "@material-ui/icons/Info";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  infoIcon: {
    color: grey[100],
  },
});

export default function Header() {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Link component={RouterLink} color="inherit" to="/">
          <Typography variant="h6" color="inherit">
            TODOS
          </Typography>
        </Link>
        <IconButton aria-label="about" component={RouterLink} to="/about">
          <InfoIcon className={classes.infoIcon} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
