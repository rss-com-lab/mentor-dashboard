import React, { Fragment } from 'react';
import Select from 'react-select';
import * as firebase from 'firebase/app';
import 'firebase/database';
import {
  getMentorList, getCurrentMentor, setStudent, setTask,
} from './parser';
import './Dashboard.scss';

import FireBase from '../../firebase/firebase';

FireBase.init();

class Dashboard extends React.Component {
  constructor() {
    super();

    this.database = firebase.database().ref().child('JSONData');

    this.state = {
      selectedOption: null,
      database: null,
    };
  }

  componentDidMount = () => {
    this.database.on('value', (snap) => {
      this.setState({
        database: snap.val(),
      });
    });
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    localStorage.setItem('currentMentor', selectedOption.value);
  };

  render() {
    const { selectedOption, database } = this.state;

    return (
      <Fragment>
        { database ? <div className="App">
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={getMentorList(database)}
        />

        <table className="table mentor-table">
          <thead className="thead">
            <tr>
              <td className="mentorTitle">Ментор</td>
              <td className="mentorName">{getCurrentMentor(selectedOption)}</td>
            </tr>
          </thead>
        </table>
        <div className="wrapper">
          <table align="center" className="table task-table">
            <thead>
              <tr>
                <td />
                <td className="check_time cell ">check time</td>
                <td className="statistics cell">statistics</td>
                {setStudent(selectedOption, database)}
              </tr>
            </thead>
            <tbody>{setTask(selectedOption, database)}</tbody>
          </table>
        </div>

        <table className="table description-table">
          <tbody className="tbody">
            <tr>
              <td className="Checked description-table__cell" />
              <td className="description-table__cell">Checked by mentor</td>
            </tr>
            <tr>
              <td className="Checking description-table__cell" />
              <td className="description-table__cell">Checking by mentor</td>
            </tr>
            <tr>
              <td className="InProgress description-table__cell" />
              <td className="description-table__cell">In Progress</td>
            </tr>
            <tr>
              <td className="ToDo description-table__cell" />
              <td className="description-table__cell">ToDo</td>
            </tr>
            <tr>
              <td className="failed description-table__cell" />
              <td className="description-table__cell">No solution</td>
            </tr>
            <tr>
              <td className="dismissed description-table__cell">
                semitransparent student -{' '}
              </td>
              <td className="description-table__cell"> student dismissed</td>
            </tr>
          </tbody>
        </table>
      </div> : null}
      </Fragment>
    );
  }
}

export default Dashboard;
