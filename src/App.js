/* eslint-disable no-console */
// import React, { Component } from 'react';
import './App.scss';
import React from 'react';
import Select from 'react-select';
import data from './data.json';

const mentorsList = [];
const dataFile = Object.keys(data.mentors);
let currentMentor = '';

// eslint-disable-next-line
for (let i = 0; i < dataFile.length; i++) {
  const mentorLogin = dataFile[i];
  const mentorObject = {};

  mentorObject.value = mentorLogin;
  mentorObject.label = mentorLogin;
  mentorsList.push(mentorObject);
}

const task = Object.keys(data.tasksStatus);

const taskName = Object.entries(data)[1][1];

function getTaskName(name) {
  const getUrl = Object.values(taskName[name]);
  return getUrl[2];
}

function getTaskStatus(name) {
  const getStatus = Object.values(taskName[name]);
  return getStatus[1].replace(/\s+/g, '');
}

function getStudenName(studentName, mentor) {
  const getStudentUrl = Object.values(
    data.mentors[mentor].mentorStudents[studentName],
  );
  const studentGithubUrl = Object.entries(getStudentUrl)[1][1];
  return studentGithubUrl;
}

function getScore(studentName, mentor, currentTaskName) {
  const getStudentUrl = Object.values(
    data.mentors[mentor].mentorStudents[studentName],
  );
  const score = Object.entries(getStudentUrl)[3][1][currentTaskName];
  if (!score) {
    return ' ';
  }
  return score;
}

function getCurrentMentor(mentor) {
  if (localStorage.getItem('currentMentor')) {
    currentMentor = localStorage.getItem('currentMentor');
  }
  if (mentor) {
    currentMentor = mentor.value;
  }
  return currentMentor;
}

const getStudent = (mentor) => {
  let students = [];
  if (localStorage.getItem('currentMentor')) {
    currentMentor = localStorage.getItem('currentMentor');
    students = Object.keys(data.mentors[currentMentor].mentorStudents);
  }
  if (mentor) {
    currentMentor = mentor.value;
    students = Object.keys(data.mentors[currentMentor].mentorStudents);
  }
  return students;
};

function setStudent(mentor) {
  return getStudent(mentor).map(studentName => (
    <td className="studentName cell" key={studentName}>
      <a
        className="link"
        href={getStudenName(studentName, getCurrentMentor(mentor))}
      >
        {studentName}
      </a>
    </td>
  ));
}

function setScore(mentor, name) {
  return getStudent(mentor).map(studentName => (
    <td style={{ minWidth: '100px', textAlign: 'center' }} className={getScore(studentName, getCurrentMentor(mentor), name) <= 0 && getTaskStatus(name) === 'Checked' ? 'failed' : getTaskStatus(name)} key={studentName}>
      {getScore(studentName, getCurrentMentor(mentor), name)}
    </td>
  ));
}

function setTask(mentor) {
  return task.map(name => (
    <tr key={name}>
      <td style={{ minWidth: '280px' }} className={getTaskStatus(name)}>
        <a className="link" href={getTaskName(name)}>
          {name}
        </a>
      </td>
      {setScore(mentor, name)}
    </tr>
  ));
}

class App extends React.Component {
  state = {
    selectedOption: null,
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    localStorage.setItem('currentMentor', selectedOption.value);
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <div className="App">
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={mentorsList}
        />

        <table className="table mentor-table">
          <thead className="thead">
            <tr>
              <td className="mentorTitle">Ментор</td>
              <td className="mentorName">{getCurrentMentor(selectedOption)}</td>
            </tr>
          </thead>
        </table>

        <table className="table task-table">
          <thead>
            <tr>
              <td />
              {setStudent(selectedOption)}
            </tr>
          </thead>
          <tbody>
            {setTask(selectedOption)}
          </tbody>
        </table>

        <table className="table description-table">
          <tbody className="tbody">
            <tr>
              <td className="Checked description-table__cell"></td>
              <td className="description-table__cell">Checked by mentor</td>
            </tr>
            <tr>
              <td className="Checking description-table__cell"></td>
              <td className="description-table__cell">Checking by mentor</td>
            </tr>
            <tr>
              <td className="InProgress description-table__cell"></td>
              <td className="description-table__cell">In Progress</td>
            </tr>
            <tr>
              <td className="ToDo description-table__cell"></td>
              <td className="description-table__cell">ToDo</td>
            </tr>
            <tr>
              <td className="failed description-table__cell"></td>
              <td className="description-table__cell">No solution</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
