import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles/index';
import AppBar from '@material-ui/core/AppBar/index';
import Toolbar from '@material-ui/core/Toolbar/index';
import Typography from '@material-ui/core/Typography/index';
import Button from '@material-ui/core/Button/index';
import LoginButton from '../Header/Login/Login';
import UserInfo from '../Header/UserInfo/UserInfo';
import Logo from '../Header/Logo/Logo';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};
const TIMETABLE_LINK
  = 'https://docs.google.com/spreadsheets/d/1oM2O8DtjC0HodB3j7hcIResaWBw8P18tXkOl1ymelvE/edit#gid=0';
function ButtonAppBar(props) {
  const { classes, mentorDataObj } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Logo link="/" brandName="RSS Community Lab" />

          <Typography variant="h6" color="inherit" className={classes.grow}>
            <Button
              style={{ marginLeft: 20 }}
              variant="contained"
              href={TIMETABLE_LINK}
            >
              Timetable
            </Button>
          </Typography>

          {mentorDataObj ? (
            <UserInfo mentorDataObj={mentorDataObj} />
          ) : (
            <LoginButton />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  mentorDataObj: PropTypes.instanceOf(Object),
};

ButtonAppBar.defaultProps = {
  mentorDataObj: null,
};

export default withStyles(styles)(ButtonAppBar);
