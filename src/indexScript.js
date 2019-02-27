/* eslint-disable no-console */
const fs = require('fs');

// eslint-disable-next-line
if (typeof require !== 'undefined') XLSX = require('xlsx');

// eslint-disable-next-line
const studentMentorPair = XLSX.readFile('./src/data/Mentor-students pairs.xlsx');
const sheetPairs = studentMentorPair.Sheets.pairs;
const sheetMentors = studentMentorPair.Sheets['second_name-to_github_account'];

// eslint-disable-next-line
const studentList = XLSX.readFile('./src/data/Mentor score.xlsx');
const sheetScore = studentList.Sheets['Form Responses 1'];

// eslint-disable-next-line
const taskStatus = XLSX.readFile('./src/data/Tasks.xlsx');
const sheetStatus = taskStatus.Sheets.Sheet1;

const mentorsList = new Map();
const studentsList = new Map();
const mentorsResult = {};
const statusResult = {};
const finalStructure = {};

const fieldMappingPairs = {
  mentorName: 'A',
  studentName: 'B',
};

const fieldMappingMentor = {
  name: 'A',
  Surname: 'B',
  Github: 'E',
};

const fieldMappingScore = {
  mentorGithub: 'B',
  studentGithub: 'C',
  task: 'D',
  score: 'F',
};

const fieldMappingStatus = {
  taskName: 'A',
  taskStatus: 'C',
  taskLink: 'B',
};

// eslint-disable-next-line
const loginPattern = /\/([^\/]+)\/?$/;

const getMentor = (sheet, currentRow) => {
  const mentorData = {
    name: sheet[fieldMappingMentor.name + currentRow].v,
    Surname: sheet[fieldMappingMentor.Surname + currentRow].v,
    ID: `${sheet[fieldMappingMentor.name + currentRow].v} ${sheet[fieldMappingMentor.Surname + currentRow].v}`,
    Github: sheet[fieldMappingMentor.Github + currentRow].v,
    GithubLogin: sheet[fieldMappingMentor.Github + currentRow].v.split(loginPattern)[1],
    mentorStudents: {},
  };

  return mentorData;
};

const getMentors = (sheet) => {
  let count = 2;
  while (sheet[fieldMappingMentor.Github + count]) {
    const mentor = getMentor(sheet, count);

    mentorsList.set(mentor.ID, mentor);
    // eslint-disable-next-line
    count++;
  }
};

const getScore = (sheet, currentRow) => {
  const studentData = {
    mentorGithub: sheet[fieldMappingScore.mentorGithub + currentRow].v,
    studentGithub: sheet[fieldMappingScore.studentGithub + currentRow].v,
    studentName: sheet[fieldMappingScore.studentGithub + currentRow].v.split(loginPattern)[1].toLowerCase(),
    tasks: {
      [sheet[fieldMappingScore.task + currentRow].v]: sheet[fieldMappingScore.score + currentRow].v,
    },
  };
  return studentData;
};

const getTasks = (sheet) => {
  let count = 2;
  while (sheet[fieldMappingScore.mentorGithub + count]) {
    const student = getScore(sheet, count);

    if (!studentsList.get(student.studentName)) {
      studentsList.set(student.studentName, student);
    } else {
      const key = Object.keys(student.tasks)[0];
      studentsList.get(student.studentName).tasks[key] = student.tasks[key];
    }

    // eslint-disable-next-line
    count++;
  }
};

const getStatusTask = (sheet, currentRow) => {
  const taskData = {
    taskName: sheet[fieldMappingStatus.taskName + currentRow].v.trim(),
    taskStatus: sheet[fieldMappingStatus.taskStatus + currentRow].v,
    taskLink: sheet[fieldMappingStatus.taskLink + currentRow] ? sheet[fieldMappingStatus.taskLink + currentRow].v : 'no link',
  };
  return taskData;
};

const getStatus = (sheet) => {
  let count = 2;
  while (sheet[fieldMappingStatus.taskName + count]) {
    const status = getStatusTask(sheet, count);

    statusResult[status.taskName] = status;
    // eslint-disable-next-line
    count++;
  }
};

const getPair = (sheet, currentRow) => {
  const pair = {
    mentorName: sheet[fieldMappingPairs.mentorName + currentRow].v,
    studentName: sheet[fieldMappingPairs.studentName + currentRow].v,
  };

  return pair;
};

const getPairs = (sheet) => {
  let count = 2;
  while (sheet[fieldMappingPairs.mentorName + count]) {
    const pair = getPair(sheet, count);
    const mentor = mentorsList.get(pair.mentorName);
    const student = studentsList.get(pair.studentName);

    if (student) {
      mentor.mentorStudents[student.studentName] = student;
    // } else {
    //   mentor.mentorStudents[pair.studentName] = {
    //     studentName: pair.studentName,
    //     tasks: {},
    //   };
    }

    mentorsResult[mentor.GithubLogin] = mentor;
    // eslint-disable-next-line
    count++;
  }
};

getMentors(sheetMentors);
getTasks(sheetScore);
getStatus(sheetStatus);
getPairs(sheetPairs);

// FINAL RESULT **********************

finalStructure.mentors = mentorsResult;
finalStructure.tasksStatus = statusResult;

// +++++++++++++++++++++++++++++++++

const json = JSON.stringify(finalStructure, 0, 2);

fs.writeFile('./src/data.json', json, 'utf8', () => {
  console.log('JSON is done!');
});
