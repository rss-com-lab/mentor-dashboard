import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import Paper from '@material-ui/core/Paper/index';
// import Typography from '@material-ui/core/Typography/index';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginTop: 20,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

function PaperSheet(props) {
  const { classes, children } = props;

  return (
    <div className={classes.main}>
      <Paper className={classes.root} elevation={1}>
        {children}
      </Paper>
    </div>
  );
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperSheet);
