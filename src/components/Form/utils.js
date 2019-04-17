
export const tasks = {
  HTML_CSS_TEST: {
    title: 'HTML/CSS Test',
    gFormId: '',
  },
  JS_TEST: {
    title: 'CoreJS/Arrays Test',
    gFormId: '',
  },
  CODE_JAM_CV: {
    title: 'CJ "CV"',
    gFormId: '',
  },
  CODE_JAM_CORE_JS: {
    title: 'CJ "CoreJS"',
    gFormId: 'Code Jam "CoreJS"',
  },
  CODE_JAM_DOM: {
    title: 'CJ "DOM, DOM Events"',
    gFormId: 'Code Jam "DOM, DOM Events"',
  },
  MARKUP_1: {
    title: 'Markup #1',
    gFormId: 'Task Markup Neutron Mail',
  },
  YOUTUBE: {
    title: 'YouTube',
    gFormId: 'Task YouTube',
  },
  RS_ACTIVIST: {
    title: 'RS Activist',
    gFormId: '',
  },
  PRESENTATION: {
    title: 'Presentation',
    gFormId: 'Task Presentation',
  },
  PRESENTATION_OFFLINE: {
    title: 'Offline Presentation',
    gFormId: '',
  },
  WEBSOCKET_CHALLENGE: {
    title: 'WebSocket Challenge',
    gFormId: '',
  },
  SCOREBOARD: {
    title: 'CJ "Scoreboard"',
    gFormId: 'Code Jam "Scoreboard"',
  },
  CSS_QD: {
    title: 'CJ "CSS QD"',
    gFormId: '',
  },
  FINAL_TASK: {
    title: 'Final Task',
    gFormId: 'Course work (Editor)',
  },
  DREAM_TEAM: {
    title: 'DreamTeam',
    gFormId: '',
  },
  MENTOR_DASHBOARD: {
    title: 'Mentor Dashboard',
    gFormId: '',
  },
};

export // console.log(entry[0], entry[1])
const getSelectOptions = tasksToProcess => Object.entries(tasksToProcess)
  .filter(e => e[1].gFormId)

  .map(entry => ({ label: entry[1].title, value: entry[1].gFormId }));
