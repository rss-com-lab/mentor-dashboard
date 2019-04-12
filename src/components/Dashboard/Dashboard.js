import React, { Fragment } from 'react';
import Select from 'react-select';
import * as firebase from 'firebase/app';
import 'firebase/database';
import {
  getMentorList, getCurrentMentor, setStudent, setTask,
} from './parser';
import './Dashboard.scss';
import Header from '../Header/Header';

import FireBase from '../../firebase/firebase';

FireBase.init();

class Dashboard extends React.Component {
  constructor() {
    super();

    this.database = firebase.database().ref().child('JSONData');

    this.state = {
      selectedOption: null,
      database: null,
      mentorDataObj: null,
    };
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          mentorDataObj: user,
        });
      }
    });

    this.database.on('value', (snap) => {
      this.setState({
        database: snap.val(),
      });
    });
  };

  handleInput = (mentorInput) => {
    this.setState({
      selectedOption: { value: mentorInput, label: mentorInput },
    });
  };

  render() {
    const { selectedOption, mentorDataObj, database } = this.state;

    return (
      <Fragment>
        <div className="App">
          <Header
            handleInput={this.handleInput}
            selectedOption={selectedOption}
            getMentorList={getMentorList}
            mentorDataObj={mentorDataObj}
            database={database}
          />
          { database ? <Fragment>
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
                  <td className="description-table__cell"><span role="img" aria-label="checked">✅ </span>Checked by mentor</td>
                </tr>
                <tr>
                  <td className="Checking description-table__cell" />
                  <td className="description-table__cell"><span role="img" aria-label="checking">🕓 </span>Checking by mentor</td>
                </tr>
                <tr>
                  <td className="InProgress description-table__cell" />
                  <td className="description-table__cell"><span role="img" aria-label="fire">🔨 </span>In Progress</td>
                </tr>
                <tr>
                  <td className="ToDo description-table__cell" />
                  <td className="description-table__cell"><span role="img" aria-label="to-do">🔜 </span>ToDo</td>
                </tr>
                <tr>
                  <td className="failed description-table__cell" />
                  <td className="description-table__cell"><span role="img" aria-label="fail">⛔ </span>No solution</td>
                </tr>
                <tr>
                  <td className="dismissed description-table__cell">
                    semitransparent student -{' '}
                  </td>
                  <td className="description-table__cell"><span role="img" aria-label="dismiss"> </span> student dismissed</td>
                </tr>
              </tbody>
            </table>
          </Fragment> : null}
      </div>
      </Fragment>
    );
  }
}

export default Dashboard;
