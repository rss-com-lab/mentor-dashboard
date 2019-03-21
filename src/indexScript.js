/* eslint-disable no-console */
const fs = require("fs");

// eslint-disable-next-line
if (typeof require !== "undefined") XLSX = require("xlsx");

// eslint-disable-next-line
const studentMentorPair = XLSX.readFile(
  "./src/data/Mentor-students pairs.xlsx"
);
const sheetPairs = studentMentorPair.Sheets.pairs;
const sheetMentors = studentMentorPair.Sheets["second_name-to_github_account"];

// eslint-disable-next-line
const studentList = XLSX.readFile("./src/data/Score RSSchool 2018Q3 (Responses) 2019-03-11.xlsx");
const sheetScore = studentList.Sheets["Form Responses 1"];

// eslint-disable-next-line
const taskStatus = XLSX.readFile("./src/data/Tasks.xlsx");
const sheetStatus = taskStatus.Sheets.Sheet1;

const mentorsList = new Map();
const studentsList = new Map();
const mentorsResult = {};
const statusResult = {};
const finalStructure = {};
let dismissedStudents = [];
let countStudent = 0;
// const tasksCount = {};

let taskCount = 0;

const fieldMappingPairs = {
  mentorName: "A",
  studentName: "B"
};

const fieldMappingMentor = {
  name: "A",
  Surname: "B",
  Github: "E"
};

const fieldMappingScore = {
  mentorGithub: "B",
  studentGithub: "C",
  task: "D",
  score: "F",
  pr: "E",
  action: "H",
  reasonDismiss: "I",
};

const fieldMappingStatus = {
  taskName: "A",
  taskStatus: "C",
  taskLink: "B",
  checkTaskTime: "D"
};

// eslint-disable-next-line
const loginPattern = /\/([^\/]+)\/?$/;

const getMentor = (sheet, currentRow) => {
  const mentorData = {
    name: sheet[fieldMappingMentor.name + currentRow].v,
    Surname: sheet[fieldMappingMentor.Surname + currentRow].v,
    ID: `${sheet[fieldMappingMentor.name + currentRow].v} ${
      sheet[fieldMappingMentor.Surname + currentRow].v
      }`,
    Github: sheet[fieldMappingMentor.Github + currentRow].v,
    GithubLogin: sheet[fieldMappingMentor.Github + currentRow].v.split(
      loginPattern
    )[1],
    mentorStudents: {}
  };
  return mentorData;
};

const getMentors = sheet => {
  let count = 2;
  while (sheet[fieldMappingMentor.Github + count]) {
    const mentor = getMentor(sheet, count);

    mentorsList.set(mentor.ID, mentor);
    // eslint-disable-next-line
    count++;
  }
};

const getScore = (sheet, currentRow) => {

  let studentData = {
    mentorGithub: sheet[fieldMappingScore.mentorGithub + currentRow].v,
    studentGithub: sheet[fieldMappingScore.studentGithub + currentRow].v,
    studentName: sheet[fieldMappingScore.studentGithub + currentRow].v
      .split(loginPattern)[1]
      ? sheet[fieldMappingScore.studentGithub + currentRow].v
        .split(loginPattern)[1]
        .toLowerCase()
      : sheet[fieldMappingScore.studentGithub + currentRow].v
        .split(loginPattern)[0],
    tasks: sheet[fieldMappingScore.task + currentRow]
      ? {
        [sheet[fieldMappingScore.task + currentRow].v]:
          sheet[fieldMappingScore.score + currentRow].v
      }
      : { "task failed": "task failed" },
    prLinks: sheet[fieldMappingScore.task + currentRow]
      ? {
        [sheet[fieldMappingScore.task + currentRow].v]:
          sheet[fieldMappingScore.pr + currentRow].v
      }
      : { "task failed": "task failed" },
    studentStatus: '',
  };
  if
    (sheet[fieldMappingScore.action + currentRow] && sheet[fieldMappingScore.action + currentRow].v === "Отчислить студента") {
      dismissedStudents.push(studentData.studentName)
  };
  return studentData;
};

const getTasks = sheet => {
  let count = 2;
  while (sheet[fieldMappingScore.mentorGithub + count]) {
    const student = getScore(sheet, count);

    if (!studentsList.get(student.studentName)) {
      studentsList.set(student.studentName, student);
      countStudent++
    } else {
      const key = Object.keys(student.tasks)[0];
      studentsList.get(student.studentName).tasks[key] = student.tasks[key];
      const keyPr = Object.keys(student.prLinks)[0];
      studentsList.get(student.studentName).prLinks[keyPr] =
        student.prLinks[key];
    }
    if (dismissedStudents.indexOf(studentsList.get(student.studentName).studentName) !== -1) {
      studentsList.get(student.studentName).studentStatus = 'dismissed';
      if (sheet[fieldMappingScore.reasonDismiss + count]) { studentsList.get(student.studentName).reasonDismiss = sheet[fieldMappingScore.reasonDismiss + count].v };
    }
    else { studentsList.get(student.studentName).studentStatus = 'active' };
    // eslint-disable-next-line
    count++;
  }
};

const getCountTask = (sheet, nameTask) => {
  let count = 2;
  let countTask = 0;
  while (sheet[fieldMappingScore.mentorGithub + count]) {
    if (sheet[fieldMappingScore.task + count] && sheet[fieldMappingScore.task + count].v === nameTask) {
      countTask++;
    }
    // else {
    //   continue
    // }
    // eslint-disable-next-line
    count++;
  }
  return countTask;
};

const getStatusTask = (sheet, currentRow, sheetStudent) => {
  const taskData = {
    taskName: sheet[fieldMappingStatus.taskName + currentRow].v.trim(),
    taskStatus: sheet[fieldMappingStatus.taskStatus + currentRow].v,
    taskLink: sheet[fieldMappingStatus.taskLink + currentRow]
      ? sheet[fieldMappingStatus.taskLink + currentRow].v
      : "no link",
    taskCount: getCountTask(
      sheetStudent,
      sheet[fieldMappingStatus.taskName + currentRow].v.trim(),
    ),
    checkTaskTime: sheet[fieldMappingStatus.checkTaskTime + currentRow] ? sheet[fieldMappingStatus.checkTaskTime + currentRow].v : '',
  };
  return taskData;
};

const getStatus = (sheet, sheetStudent) => {
  let count = 2;
  while (sheet[fieldMappingStatus.taskName + count]) {
    const status = getStatusTask(sheet, count, sheetStudent);

    statusResult[status.taskName] = status;
    // eslint-disable-next-line
    count++;
  }
};

const getPair = (sheet, currentRow) => {
  const pair = {
    mentorName: sheet[fieldMappingPairs.mentorName + currentRow].v,
    studentName: sheet[fieldMappingPairs.studentName + currentRow].v
  };

  return pair;
};

const getPairs = sheet => {
  let count = 2;
  while (sheet[fieldMappingPairs.mentorName + count]) {
    const pair = getPair(sheet, count);
    const mentor = mentorsList.get(pair.mentorName);
    const student = studentsList.get(pair.studentName);

    if (student) {
      mentor.mentorStudents[student.studentName] = student;
      taskCount++;
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
getStatus(sheetStatus, sheetScore);
getPairs(sheetPairs);

// console.log('countStudent', countStudent);
// console.log('dismissedStudents', dismissedStudents);
// console.log('lenght', dismissedStudents.length);

// FINAL RESULT **********************

finalStructure.mentors = mentorsResult;
finalStructure.tasksStatus = statusResult;
finalStructure.taskCount = taskCount;

// +++++++++++++++++++++++++++++++++

const json = JSON.stringify(finalStructure, 0, 2);

fs.writeFile("./src/data.json", json, "utf8", () => {
  console.log("JSON is done!");
});
