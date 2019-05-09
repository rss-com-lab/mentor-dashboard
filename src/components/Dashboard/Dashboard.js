import React, { Fragment } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
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
      selectedOption, mentorDataObj, database, userStatus, mentors, admins,
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
          && (admins.includes(selectedOption.value) || mentors.includes(selectedOption.value)) ? (
            <Fragment>
              <Table className="table mentor-table">
                <TableHead className="thead">
                  <TableRow>
                    <TableCell className="mentorTitle">Ментор</TableCell>
                    <TableCell className="mentorName">{getCurrentMentor(selectedOption)}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <div className="wrapper">
                <Table className="table task-table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell className="statistics cell">statistics</TableCell>
                      {setStudent(selectedOption, database)}
                    </TableRow>
                  </TableHead>
                  <TableBody>{setTask(selectedOption, database)}</TableBody>
                </Table>
              </div>

              <Table className="table description-table">
                <TableBody className="tbody">
                  <TableRow>
                    <TableCell className="Checked description-table__cell" />
                    <TableCell className="description-table__cell">
                      <span role="img" aria-label="checked">
                        ✅{' '}
                      </span>
                      Checked by mentor
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="Checking description-table__cell" />
                    <TableCell className="description-table__cell">
                      <span role="img" aria-label="checking">
                        🕓{' '}
                      </span>
                      Checking by mentor
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="InProgress description-table__cell" />
                    <TableCell className="description-table__cell">
                      <span role="img" aria-label="fire">
                        🔨{' '}
                      </span>
                      In Progress
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="ToDo description-table__cell" />
                    <TableCell className="description-table__cell">
                      <span role="img" aria-label="to-do">
                        🔜{' '}
                      </span>
                      ToDo
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="failed description-table__cell" />
                    <TableCell className="description-table__cell">
                      <span role="img" aria-label="fail">
                        ⛔{' '}
                      </span>
                      No solution
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="dismissed description-table__cell">
                      semitransparent -{' '}
                    </TableCell>
                    <TableCell className="description-table__cell">
                      <span role="img" aria-label="dismiss">
                        {' '}
                      </span>{' '}
                      student dismissed
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Fragment>
            ) : null}
        </div>
      </Fragment>
    );
  }
}

export default Dashboard;
