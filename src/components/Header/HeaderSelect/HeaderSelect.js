import React, { Component, Fragment } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Select from 'react-select';
import PropTypes from 'prop-types';
import './HeaderSelect.scss';

const isMentor = (mentor, list) => {
  const mentors = [];
  list.forEach((element) => {
    mentors.push(element.label);
  });
  return mentors.includes(mentor);
};

const customStyles = {
  container: provided => ({
    ...provided,
    width: '20%',
    'min-width': 155,
  }),
};

class HeaderSelect extends Component {
  constructor(props) {
    super();

    const { database, getMentorList } = props;

    this.state = {
      selectedOption: null,
      mentorsList: getMentorList(database),
    };
  }

  componentDidMount = () => {
    const { mentorsList } = this.state;

    firebase.auth().onAuthStateChanged((firebaseUser = {}) => {
      let user = firebaseUser;

      if (user === null) {
        user = { displayName: 'Need signing' };
      }

      const mentorFromStorage = localStorage.getItem('currentMentor');
      const mentor = isMentor(user.displayName, mentorsList);

      if (user && mentor) {
        this.handleChange({ value: user.displayName, label: user.displayName });
        localStorage.removeItem('currentMentor');
      } else if (mentorFromStorage) {
        this.setState({
          selectedOption: { value: mentorFromStorage, label: mentorFromStorage },
        });
      }
    });
  };

  handleChange = (selectedOption) => {
    const { handleInput } = this.props;
    this.setState({ selectedOption });
    handleInput(selectedOption.label);
    localStorage.setItem('currentMentor', selectedOption.value);
  };

  render() {
    const { placeholder, database, getMentorList } = this.props;
    const { selectedOption } = this.state;

    return (
      <Fragment>
        <Select
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder={placeholder}
          value={selectedOption}
          onChange={this.handleChange}
          options={getMentorList(database)}
          styles={customStyles}
        />
      </Fragment>
    );
  }
}

HeaderSelect.propTypes = {
  placeholder: PropTypes.string.isRequired,
  database: PropTypes.instanceOf(Object).isRequired,
};

export default HeaderSelect;
