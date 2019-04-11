import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FireBase from '../../../firebase/firebase';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit * 2,
    marginRight: 0,
  },
  input: {
    display: 'none',
  },
});

class LoginButton extends Component {
  handleClick = async () => {
    await FireBase.auth();
  }

  render() {
    const { classes } = this.props;
    return (
      <Button
        variant="outlined"
        className={classes.button}
        onClick={this.handleClick}
      >Login
      </Button>
    );
  }
}

LoginButton.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(LoginButton);
