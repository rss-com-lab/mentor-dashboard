import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FireBase from '../../../firebase/firebase';
import './Login.scss';

const styles = () => ({
  input: {
    display: 'none',
  },
});

class LoginButton extends Component {
  handleClick = async () => {
    await FireBase.auth();
  };

  render() {
    return (
      <Button
        variant="outlined"
        className="login-button"
        onClick={this.handleClick}
      >Login
      </Button>
    );
  }
}

export default withStyles(styles)(LoginButton);
