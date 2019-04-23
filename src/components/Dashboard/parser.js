import React from 'react';

let currentMentor = '';

function getMentorList(dataObj) {
  const mentorsList = [];
  const dataFile = Object.keys(dataObj.mentors);

  dataFile.forEach((item) => {
    mentorsList.push({ value: item, label: item });
  });

  return mentorsList;
}

function getTaskURL(name, dataObj) {
  return dataObj.tasksStatus[name].taskLink;
}

function getStatistics(name, dataObj) {
  const commonCountTask = dataObj.taskCount;
  const countCurrentTask = dataObj.tasksStatus[name].taskCount;
  const percent = (countCurrentTask / commonCountTask) * 100;

  return percent > 0 ? `${Math.round(percent)} %` : null;
}

function getTaskStatus(name, dataObj) {
  const getStatus = dataObj.tasksStatus[name].taskStatus;
  return getStatus.replace(/\s+/g, '');
}

function getStudenName(studentName, mentor, dataObj) {
  return dataObj.mentors[mentor].mentorStudents[studentName].studentGithub;
}

function getScore(studentName, mentor, currentTaskName, dataObj) {
  const studentsStatus = dataObj;
  const score = dataObj.mentors[mentor].mentorStudents[studentName].tasks[currentTaskName];

  if (score) {
    return `✅ ${score}`;
  }
  if (score && getTaskStatus(currentTaskName, dataObj) === 'Checking') {
    return `🕓 ${score}`;
  }
  if (!score && getTaskStatus(currentTaskName, dataObj) === 'Checking') {
    return '🕓 ';
  }
  if (!score && getTaskStatus(currentTaskName, dataObj) === 'InProgress') {
    return '🔨 ';
  }
  if (score && getTaskStatus(currentTaskName, dataObj) === 'InProgress') {
    return `🔨 ${score}`;
  }
  if (score && getTaskStatus(currentTaskName, dataObj) === 'ToDo') {
    return `🔜 ${score}`;
  }
  if (!score && getTaskStatus(currentTaskName, dataObj) === 'ToDo') {
    return '🔜 ';
  }
  if (
    getTaskStatus(currentTaskName, dataObj) === 'Checked'
    && studentsStatus !== 'dismissed'
  ) {
    return '⛔ ';
  }

  return null;
}

function setTooltip(mentor, studentName, dataObj) {
  const studentsStatus = dataObj.mentors[mentor].mentorStudents[studentName].studentStatus;
  const { reasonDismiss } = dataObj.mentors[mentor].mentorStudents[studentName];
  return studentsStatus === 'dismissed' ? reasonDismiss : null;
}

function getPrTask(studentName, mentor, currentTaskName, dataObj) {
  const pr = dataObj.mentors[mentor].mentorStudents[studentName].prLinks[currentTaskName];
  const score = dataObj.mentors[mentor].mentorStudents[studentName].tasks[currentTaskName];
  if (getTaskStatus(currentTaskName, dataObj) === 'Checking' && (score <= 0 || !score)) {
    return '#';
  }
  return pr;
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

const getStudent = (mentor, dataObj) => {
  let students = [];
  if (localStorage.getItem('currentMentor')) {
    currentMentor = localStorage.getItem('currentMentor');
    if (dataObj.mentors[currentMentor].mentorStudents) {
      students = Object.keys(dataObj.mentors[currentMentor].mentorStudents);
    }
  }
  if (mentor) {
    currentMentor = mentor.value;
    if (dataObj.mentors[currentMentor].mentorStudents) {
      students = Object.keys(dataObj.mentors[currentMentor].mentorStudents);
    }
  }
  return students;
};

function setClass(studentName, mentor, name, dataObj) {
  const studentsStatus = dataObj.mentors[getCurrentMentor(mentor)].mentorStudents[studentName]
    .studentStatus;

  if (
    getScore(studentName, getCurrentMentor(mentor), name, dataObj) === '⛔ '
    && getTaskStatus(name, dataObj) === 'Checked'
    && studentsStatus !== 'dismissed'
  ) {
    return 'failed';
  }
  if (
    getScore(studentName, getCurrentMentor(mentor), name, dataObj) === '⛔ '
    && getTaskStatus(name, dataObj) === 'Checked'
    && studentsStatus === 'dismissed'
  ) {
    return 'failed dismissed';
  }
  if (getTaskStatus(name, dataObj) && studentsStatus === 'dismissed') {
    return `${getTaskStatus(name, dataObj)} dismissed`;
  }
  return getTaskStatus(name, dataObj);
}

function setStudent(mentor, dataObj) {
  return getStudent(mentor, dataObj).map(studentName => (
    <td
      className="studentName cell"
      key={studentName}
      tooltip={setTooltip(getCurrentMentor(mentor), studentName, dataObj)}
    >
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

function getMentorGithub(mentor, dataObj) {
  const githubMentor = dataObj.mentors[mentor].Github;
  return githubMentor;
}

function AlertUserData(mentor, studentName, name, score, prTask, studentsStatus) {
  function onClick(e) {
    e.preventDefault();
    alert(
      `github mentor: ${mentor}\ngithub student: ${studentName}\ntask name: ${name}`,
    );
  }
  if (+score.replace(/\D+/g, '') > 0 && !studentsStatus.includes('dismissed')) {
    return (
      <a className="link"
        rel="noopener noreferrer"
        target="_blank"
        href={prTask}
      >
        {score}
      </a>
    );
  }
  if (studentsStatus.includes('dismissed')) {
    return (
      <span style={{ cursor: 'default' }}
      >
        {score}
      </span>
    );
  }
  return (
    <a href="onClick" className="link" onClick={onClick} rel="noopener noreferrer">
      {score}
    </a>
  );
}

function setScore(mentor, name, dataObj) {
  return getStudent(mentor, dataObj).map(studentName => (
    <td
      style={{ textAlign: 'center' }}
      className={setClass(studentName, mentor, name, dataObj)}
      key={studentName}
    >
       {AlertUserData(
         getMentorGithub(getCurrentMentor(mentor), dataObj),
         getStudenName(studentName, getCurrentMentor(mentor), dataObj),
         name,
         getScore(studentName, getCurrentMentor(mentor), name, dataObj),
         getPrTask(studentName, getCurrentMentor(mentor), name, dataObj),
         setClass(studentName, mentor, name, dataObj),
       )}
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
          href={getTaskURL(name, dataObj)}
        >
          {name}
        </a>
      </td>
      <td
        className={getTaskStatus(name, dataObj)}
        style={{ textAlign: 'center' }}
      >
        {getStatistics(name, dataObj)}
      </td>
      {setScore(mentor, name, dataObj)}
    </tr>
  ));
}

export {
  getMentorList, getCurrentMentor, setStudent, setTask,
};
