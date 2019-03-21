/* eslint-disable no-console */
// import React, { Component } from 'react';
import "./App.scss";
import React from "react";
import Select from "react-select";
import data from "./data.json";

const mentorsList = [];
const dataFile = Object.keys(data.mentors);
let currentMentor = "";

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
  if (getUrl[2] !== "no link")
  { return getUrl[2] };
}

function getCheckTaskTime(name) {
  const CheckTaskTime = Object.values(taskName[name])[4];
  return CheckTaskTime;
}

function getStatistics(name) {
  const commonCountTask = Object.entries(data)[2][1];
  const countCurrentTask = Object.values(taskName[name]);
  const percent = (countCurrentTask[3] / commonCountTask) * 100;
  if (percent > 0) {
    return Math.round(percent) + " %";
  }
}

function getTaskStatus(name) {
  const getStatus = Object.values(taskName[name]);
  return getStatus[1].replace(/\s+/g, "");
}

function getStudenName(studentName, mentor) {
  const getStudentUrl = Object.values(
    data.mentors[mentor].mentorStudents[studentName]
  );
  const studentGithubUrl = Object.entries(getStudentUrl)[1][1];
  return studentGithubUrl;
}

function getScore(studentName, mentor, currentTaskName) {
  const getStudentUrl = Object.values(
    data.mentors[mentor].mentorStudents[studentName]
  );
  const score = Object.entries(getStudentUrl)[3][1][currentTaskName];
  if (score) {
    return score;
  }
}

// function getStudentStatus(mentor, studentName) {
//   const studentsStatus = Object.values(
//     data.mentors[mentor].mentorStudents[studentName]
//   )[5];
//   if (studentsStatus === "dismissed") {
//     return studentsStatus + " studentName cell";
//   }
//   return "studentName cell";
// }

function setTooltip(mentor, studentName) {
  const studentsStatus = Object.values(
    data.mentors[mentor].mentorStudents[studentName]
  )[5];
  const reasonDismiss = Object.values(
    data.mentors[mentor].mentorStudents[studentName]
  )[6];
  if (studentsStatus === "dismissed") {
    return reasonDismiss;
  }
}

function getPrTask(studentName, mentor, currentTaskName) {
  const getStudentUrl = Object.values(
    data.mentors[mentor].mentorStudents[studentName]
  );
  const pr = Object.entries(getStudentUrl)[4][1][currentTaskName];
  const score = Object.entries(getStudentUrl)[3][1][currentTaskName];
  if (getTaskStatus(currentTaskName) === "Checking" && (score <= 0 || !score)) {
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

const getStudent = mentor => {
  let students = [];
  if (localStorage.getItem("currentMentor")) {
    currentMentor = localStorage.getItem("currentMentor");
    students = Object.keys(data.mentors[currentMentor].mentorStudents);
  }
  if (mentor) {
    currentMentor = mentor.value;
    students = Object.keys(data.mentors[currentMentor].mentorStudents);
  }
  return students;
};

function setClass(studentName, mentor, name) {
  const studentsStatus = Object.values(
    data.mentors[getCurrentMentor(mentor)].mentorStudents[studentName]
  )[5];
  if (
    !getScore(studentName, getCurrentMentor(mentor), name) &&
    getTaskStatus(name) === "Checked" &&
    studentsStatus !== "dismissed"
  ) {
    return "failed";
  } else if (
    !getScore(studentName, getCurrentMentor(mentor), name) &&
    getTaskStatus(name) === "Checked" &&
    studentsStatus === "dismissed"
  ) {
    return "failed dismissed";
  } else if (
    getTaskStatus(name) &&
    studentsStatus === "dismissed"
  ) {
    return getTaskStatus(name) + " dismissed";
  } else {
    return getTaskStatus(name);
  }
}

function setStudent(mentor) {
  return getStudent(mentor).map(studentName => (
    <td
      className='studentName cell'
      key={studentName}
      tooltip={setTooltip(getCurrentMentor(mentor), studentName)}

    >
      <a
        className="link"
        rel="noopener noreferrer"
        target="_blank"
        href={getStudenName(studentName, getCurrentMentor(mentor))}
      >
        {studentName}
      </a>
    </td>
  ));
}

function setScore(mentor, name) {
  return getStudent(mentor).map(studentName => (
    <td
      style={{ textAlign: "center" }}
      className={setClass(studentName, mentor, name)}
      key={studentName}
    >
      <a
        className="link"
        rel="noopener noreferrer"
        target="_blank"
        href={getPrTask(studentName, getCurrentMentor(mentor), name)}
      >
        {getScore(studentName, getCurrentMentor(mentor), name)}
      </a>
    </td>
  ));
}

function setTask(mentor) {
  return task.map(name => (
    <tr key={name}>
      <td className={getTaskStatus(name)}>
        <a
          className="link taskname"
          rel="noopener noreferrer"
          target="_blank"
          href={getTaskName(name)}
        >
          {name}
        </a>
      </td>
      <td className={getTaskStatus(name)} style={{ textAlign: "center" }}>
      {getCheckTaskTime(name)}
      </td>
      <td className={getTaskStatus(name)} style={{ textAlign: "center" }}>
        {getStatistics(name)}
      </td>
      {setScore(mentor, name)}
    </tr>
  ));
}

class App extends React.Component {
  state = {
    selectedOption: null
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    localStorage.setItem("currentMentor", selectedOption.value);
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
        <div className="wrapper">
          <table align="center" className="table task-table">
            <thead>
              <tr>
                <td />
                <td className="check_time cell ">check time</td>
                <td className="statistics cell">statistics</td>
                {setStudent(selectedOption)}
              </tr>
            </thead>
            <tbody>{setTask(selectedOption)}</tbody>
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
                semitransparent student -{" "}
              </td>
              <td className="description-table__cell"> student dismissed</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
