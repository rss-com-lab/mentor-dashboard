import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import FireBase from '../../../firebase/firebase';

const styles = theme => ({
  avatar: {
    margin: 4,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
  button: {
    margin: 0,
    padding: 0,
  },
});

class UserInfo extends Component {
  state = {
    open: false,
  };

  handleLogout = async () => {
    await FireBase.logout();
  };

  handleToggle = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  handleClose = async (event) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { classes, mentorDataObj } = this.props;
    const { open } = this.state;
    return (
      <Fragment>
        <Button
          className={classes.button}
          buttonRef={(node) => {
            this.anchorEl = node;
          }}
          aria-owns={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          <Avatar
            alt={mentorDataObj.displayName}
            src={mentorDataObj.photoURL}
            className={classes.avatar}
          />
        </Button>
        <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    <MenuItem>{mentorDataObj.displayName}</MenuItem>
                    <MenuItem onClick={this.handleLogout}>Log Out</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    );
  }
}

UserInfo.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  mentorDataObj: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(UserInfo);
