/* eslint-disable no-console */
// import React, { Component } from 'react';
import "./App.scss";
import React, { Fragment } from "react";
import Select from "react-select";
import * as firebase from 'firebase/app';
import 'firebase/database';
import FireBase from './firebase';
import  MentorForm from './components/MentorForm'

FireBase.init();

let currentMentor = "";

function getMentorList (dataObj) {
  const mentorsList = [];
  const dataFile = Object.keys(dataObj.mentors);

  // eslint-disable-next-line
  for (let i = 0; i < dataFile.length; i++) {
    const mentorLogin = dataFile[i];
    const mentorObject = {};

    mentorObject.value = mentorLogin;
    mentorObject.label = mentorLogin;
    mentorsList.push(mentorObject);
  }

  return mentorsList;
}

function getTaskName(name, dataObj) {
  const getUrl = Object.values(dataObj.tasksStatus[name]);
  return getUrl[1];
}

function getStatistics(name, dataObj) {
  const commonCountTask = Object.entries(dataObj)[1][1];
  const countCurrentTask = Object.values(dataObj.tasksStatus[name]);
  const percent = (countCurrentTask[0] / commonCountTask) * 100;
  if (percent > 0) {
    return Math.round(percent) + " %";
  }
}

function getTaskStatus(name, dataObj) {
  const getStatus = Object.values(dataObj.tasksStatus[name]);
  return getStatus[3].replace(/\s+/g, "");
}

function getStudenName(studentName, mentor, dataObj) {
  const getStudentUrl = Object.values(
    dataObj.mentors[mentor].mentorStudents[studentName]
  );
  const studentGithubUrl = Object.entries(getStudentUrl)[1][1];
  return studentGithubUrl;
}

function getScore(studentName, mentor, currentTaskName, dataObj) {
  const getStudentUrl = Object.values(
    dataObj.mentors[mentor].mentorStudents[studentName]
  );
  const score = Object.entries(getStudentUrl)[4][1][currentTaskName];
  if (score) {
    return score;
  }
  // return score;
}

function getPrTask(studentName, mentor, currentTaskName, dataObj) {
  const getStudentUrl = Object.values(
    dataObj.mentors[mentor].mentorStudents[studentName]
  );
  const pr = Object.entries(getStudentUrl)[1][1][currentTaskName];
  const score = Object.entries(getStudentUrl)[4][1][currentTaskName];
  if (getTaskStatus(currentTaskName, dataObj) === "Checking" && (score <= 0 || !score)) {
    return "#";
  }
  if (!score || score === 0) {
    return;
  }
  return pr;
}

function getCurrentMentor(mentor) {
  if (localStorage.getItem("currentMentor")) {
    currentMentor = localStorage.getItem("currentMentor");
  }
  if (mentor) {
    currentMentor = mentor.value;
  }
  return currentMentor;
}

const getStudent = (mentor, dataObj) => {
  let students = [];
  if (localStorage.getItem("currentMentor")) {
    currentMentor = localStorage.getItem("currentMentor");
    students = Object.keys(dataObj.mentors[currentMentor].mentorStudents);
  }
  if (mentor) {
    currentMentor = mentor.value;
    students = Object.keys(dataObj.mentors[currentMentor].mentorStudents);
  }
  return students;
};

function setStudent(mentor, dataObj) {
  return getStudent(mentor, dataObj).map(studentName => (
    <td className="studentName cell" key={studentName}>
      <a
        className="link"
        rel="noopener noreferrer"
        target="_blank"
        href={getStudenName(studentName, getCurrentMentor(mentor), dataObj)}
      >
        {studentName}
      </a>
    </td>
  ));
}

function setScore(mentor, name, dataObj) {
  return getStudent(mentor, dataObj).map(studentName => (
    <td
      style={{ textAlign: "center" }}
      className={
        !getScore(studentName, getCurrentMentor(mentor), name, dataObj) &&
        getTaskStatus(name, dataObj) === "Checked"
          ? "failed"
          : getTaskStatus(name, dataObj)
      }
      key={studentName}
    >
      <a
        className="link"
        rel="noopener noreferrer"
        target="_blank"
        href={getPrTask(studentName, getCurrentMentor(mentor), name, dataObj)}
      >
        {getScore(studentName, getCurrentMentor(mentor), name, dataObj)}
      </a>
    </td>
  ));
}

function setTask(mentor, dataObj) {
  const tasks = Object.keys(dataObj.tasksStatus);
  return tasks.map(name => (
    <tr key={name}>
      <td className={getTaskStatus(name, dataObj)}>
        <a
          className="link taskname"
          rel="noopener noreferrer"
          target="_blank"
          href={getTaskName(name, dataObj)}
        >
          {name}
        </a>
      </td>
      <td className={getTaskStatus(name, dataObj)} style={{ textAlign: "center" }}>
        {getStatistics(name, dataObj)}
      </td>
      {setScore(mentor, name, dataObj)}
    </tr>
  ));
}

function getMentorForm() {
  const form = MentorForm();
  return form;
}

class App extends React.Component {
  constructor() {
    super();

    this.database = firebase.database().ref().child('JSONData');

    this.state = {
      selectedOption: null,
      database: null,
    };
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    localStorage.setItem("currentMentor", selectedOption.value);
  };

  componentDidMount = () => {
    this.database.on('value', (snap) => {
      this.setState({
        database: snap.val(),
      });
    });
  }

  render() {

    if (window.location.pathname.includes('mentor-form')) {
      return getMentorForm();
    }

    const { selectedOption, database } = this.state;
    return (
      <Fragment>
      {database? <div className="App">
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
          </tbody>
        </table>
      </div> : null}
      </Fragment>
    );
  }
}

export default App;
