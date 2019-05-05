import React, { Fragment } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';
import {
  getMentorList, getCurrentMentor, setStudent, setTask,
} from './parser';
import './Dashboard.scss';
import Header from '../Header/Header';

import FireBase from '../../firebase/firebase';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

FireBase.init();

class Dashboard extends React.Component {
  constructor() {
    super();

    this.database = firebase
      .database()
      .ref()
      .child('2019Q1');

    this.admins = firebase
      .database()
      .ref()
      .child('Admins');

    this.mentors = firebase
      .database()
      .ref()
      .child('mentors');

    this.state = {
      admins: null,
      mentors: null,
      userStatus: null,
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

        this.admins.on('value', (snap) => {
          this.setState({
            admins: snap.val(),
          });
        });

        this.mentors.on('value', (snap) => {
          this.setState({
            mentors: snap.val(),
          });
        });

        this.database.on('value', (snap) => {
          const { admins, mentors } = this.state;
          const currUser = user.displayName;
          if (admins.includes(currUser)) {
            const storageUser = localStorage.getItem('currentMentor');
            this.setState({
              database: snap.val(),
            });
            this.setState({
              userStatus: 'admin',
            });
            this.handleInput(storageUser);
          } else if (mentors.includes(currUser)) {
            const data = {};
            data.mentors = {};
            data.mentors[currUser] = snap.child(`mentors/${currUser}`).val();
            data.tasksStatus = snap.child('tasksStatus').val();
            data.taskCount = snap.child('taskCount').val();

            this.setState({
              database: data,
            });
            this.setState({
              userStatus: 'mentor',
            });
            this.setState({
              selectedOption: { value: currUser, label: currUser },
            });
          }
        });
      }
    });
  };

  handleInput = (mentorInput) => {
    this.setState({
      selectedOption: { value: mentorInput, label: mentorInput },
    });
  };

  render() {
    const {
      selectedOption,
      mentorDataObj,
      database,
      userStatus,
      mentors,
      admins,
    } = this.state;

    return (
      <Fragment>
        <div className="App">
          <Header
            handleInput={this.handleInput}
            selectedOption={selectedOption}
            getMentorList={getMentorList}
            mentorDataObj={mentorDataObj}
            database={database}
            mentors={mentors}
            admins={admins}
            userStatus={userStatus}
          />
          {database
            && mentorDataObj
            && selectedOption
            && (admins.includes(selectedOption.value)
              || mentors.includes(selectedOption.value)) ? (
              <Fragment>
                <table className="table mentor-table">
                  <thead className="thead">
                    <tr>
                      <td className="mentorTitle">Ментор</td>
                      <td className="mentorName">
                        {getCurrentMentor(selectedOption)}
                      </td>
                    </tr>
                  </thead>
                </table>
                <div className="wrapper">
                  <table align="center" className="table task-table">
                    <thead>
                      <tr>
                        <td />
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
                      <td className="description-table__cell">
                        <span role="img" aria-label="checked">
                          ✅{' '}
                        </span>
                        Checked by mentor
                    </td>
                    </tr>
                    <tr>
                      <td className="Checking description-table__cell" />
                      <td className="description-table__cell">
                        <span role="img" aria-label="checking">
                          🕓{' '}
                        </span>
                        Checking by mentor
                    </td>
                    </tr>
                    <tr>
                      <td className="InProgress description-table__cell" />
                      <td className="description-table__cell">
                        <span role="img" aria-label="fire">
                          🔨{' '}
                        </span>
                        In Progress
                    </td>
                    </tr>
                    <tr>
                      <td className="ToDo description-table__cell" />
                      <td className="description-table__cell">
                        <span role="img" aria-label="to-do">
                          🔜{' '}
                        </span>
                        ToDo
                    </td>
                    </tr>
                    <tr>
                      <td className="failed description-table__cell" />
                      <td className="description-table__cell">
                        <span role="img" aria-label="fail">
                          ⛔{' '}
                        </span>
                        No solution
                    </td>
                    </tr>
                    <tr>
                      <td className="dismissed description-table__cell">
                        semitransparent student -{' '}
                      </td>
                      <td className="description-table__cell">
                        <span role="img" aria-label="dismiss">
                          {' '}
                        </span>{' '}
                        student dismissed
                    </td>
                    </tr>
                  </tbody>
                </table>
              </Fragment>
            ) : null}
        </div>
      </Fragment>
    );
  }
}

export default Dashboard;
