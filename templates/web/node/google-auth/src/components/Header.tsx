import React from "react";
import AppBar from "@material-ui/core/AppBar";
import {
  Typography,
  Toolbar,
  Button,
  Link,
  makeStyles
} from "@material-ui/core";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { Page } from "../constants";

const useStyles = makeStyles({
  toolbar: {
    display: "flex",
    justifyContent: "space-between"
  }
});

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <RouterLink innerRef={ref as any} {...props} />
);

export default function Header() {
  const classes = useStyles();
  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <Link component={AdapterLink} color="inherit" to="/">
          <Typography variant="h6" color="inherit">
            Todos
          </Typography>
        </Link>
        <Button color="inherit" component={AdapterLink} to={`/${Page.about}`}>
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
}
