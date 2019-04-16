import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Header.scss';
import Logo from './Logo/Logo';
import HeaderSelect from './HeaderSelect/HeaderSelect';
import LoginButton from './Login/Login';
import UserInfo from './UserInfo/UserInfo';

class Header extends Component {
  render() {
    const {
      handleInput,
      selectedOption,
      getMentorList,
      mentorDataObj,
      database,
    } = this.props;
    return (
      <div className="navbar-container">
        <nav className="navbar">
          <Logo link="/" brandName="RSS Community Lab" />
          {database ? (
            <HeaderSelect
              placeholder="github account"
              handleInput={handleInput}
              selectedOption={selectedOption}
              getMentorList={getMentorList}
              mentorDataObj={mentorDataObj}
              database={database}
            />
          ) : (
            <CircularProgress disableShrink />
          )}
          {mentorDataObj ? (
            <UserInfo mentorDataObj={mentorDataObj} />
          ) : (
            <LoginButton />
          )}
        </nav>
      </div>
    );
  }
}

Header.propTypes = {
  handleInput: PropTypes.func.isRequired,
  mentorDataObj: PropTypes.instanceOf(Object),
  database: PropTypes.instanceOf(Object),
};

Header.defaultProps = {
  mentorDataObj: {},
  database: {},
};

export default Header;
