/* eslint-disable */

import { Tab, Tabs } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/index';

import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography/index';
import TextField from '@material-ui/core/TextField/index';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';

// import Grid from '@material-ui/core/Grid/index';
// import FormControlLabel from '@material-ui/core/FormControlLabel/index';
// import Checkbox from '@material-ui/core/Checkbox/index';
// import Paper from '@material-ui/core/Paper/index';

import { Formik } from 'formik/dist/index';
import { getSelectOptions, tasks } from './utils';
import * as Yup from 'yup';

import PaperSheet from './PaperSheet';

import Button from '@material-ui/core/Button';
import FromAppBar from './AppBar';

// need to make conditions for different actions
// need to create config for the form action
// implement score validation and submit


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

const initFormValues = {
  mentorGithub: 'https://github.com/',
  studentGithub: 'https://github.com/',
  prGithub: '',
  mark: 0,
  comment: '',
  task: '',
};


// center the paper sheets
// add menu with links to timetable
const FormSubmit = ({ children }) => <div>
    <h1>Student evaluation</h1>
    <Formik
      initialValues={initFormValues}
      validationSchema={Yup.object().shape({
        studentGithub: Yup.string()
          .url()
          .required('Required'),
        mentorGithub: Yup.string()
          .url()
          .required('Required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log('test ', values);

        const g = document.createElement('div');
        g.setAttribute('id', 'test');

        document.body.appendChild(g);
        document.getElementById('test').innerHTML = `
        <form style="display: none;" id="custom_form" action="https://docs.google.com/forms/d/e/1FAIpQLSfrZbkG-7DoCRNqKgv4yif-okXUpE48cl5u_mm9liVojss0fg/formResponse"
      method="post" target="hidden_iframe" class="form-container js-feedback-form">
    <input type="text" name="entry.607635829" data-text="task" value='${values.task}' class="input bold js-input js-input-plain-text">
    <input type="text" name="entry.105639297" data-text="action" value='Выставить оценку'>
    <input type="text" name="entry.1124799417" data-text="student" value='${values.studentGithub}'>
    <input type="text" name="entry.1551603391" data-text="mentor" value='${values.mentorGithub}'>
    <input type="text" name="entry.2068938522" data-text="pr" value='${values.prGithub}'>
    <input type="text" name="entry.429903389" data-text="mark" value="${values.mark}">
    <input type="text" name="entry.307148344" data-text="comment" value='${values.comment}'>
    <button type="submit" id="submit" class="btn btn-primary js-btn-submit">submit</button>
</form>

<iframe name="hidden_iframe" id="hidden_iframe" style="display: none;"></iframe>
        
        
        `;


        window.submitForm = () => {
          document.getElementById('custom_form').submit.click();
        };

        window.submitForm();

        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => {
        const tasksSelectOptions = getSelectOptions(tasks);

        const evaluation = <React.Fragment>
          <TextField
            id="task"
            select

            // className={classes.textField}
            // value={this.state.currency}
            // onChange={this.handleChange('currency')}
            SelectProps={{
              native: true,
            }}
            helperText="Выберете название таска"
            margin="normal"
            onChange={(...args) => {
              console.log('change select', args);
              handleChange(...args);
            }}
            onBlur={handleBlur}
            value={values.task}
          >
            <option value="" label="Выберете название таска" />
            {tasksSelectOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <TextField
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.prGithub} required id="prGithub" label="Ссылка на проверенный пул реквест" fullWidth />
          <TextField
            onChange={handleChange}
            onBlur={handleBlur}
            required value={values.mark} id="mark" label="Оценка" fullWidth />
          <TextField
            onChange={handleChange}
            onBlur={handleBlur}
            id="comment" value={values.comment} label="Комментарий" fullWidth />

        </React.Fragment>;

        const currencies = [
          {
            value: 'no_connection',
            label: 'Перестал выходить на связь',
          },
          {
            value: 'work',
            label: 'Нашел работу и не хочет дальше учиться',
          },
          {
            value: 'plagiat',
            label: 'Cдает не свои работы',
          },
          {
            value: 'other',
            label: 'Другое',
          },
        ];


        const expel = <React.Fragment>
          Отчислить

          <TextField
            id="standard-select-currency-native"
            select
            label="Причина отчисления"
            // className={classes.textField}
            // value={this.state.currency}
            // onChange={this.handleChange('currency')}
            SelectProps={{
              native: true,
            }}
            helperText="Выберете причину отчисления"
            margin="normal"
          >
            {currencies.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </React.Fragment>;

        return <form onSubmit={handleSubmit}>
          {errors.mentorGithub && touched.mentorGithub && errors.mentorGithub}
          {errors.studentGithub && touched.studentGithub && errors.studentGithub}
          {errors.prGithub && touched.prGithub && errors.prGithub}
          {errors.mark && touched.mark && errors.mark}
          {errors.task && touched.task && errors.task}
          <TextField required id="mentorGithub" label="Ссылка на GitHub ментора в формате: https://github.com/nickname" fullWidth onChange={handleChange}
                     onBlur={handleBlur}
                     value={values.mentorGithub}/>
          <TextField required id="studentGithub" style={{ paddingBottom: 20 }} label="Ссылка на GitHub студента в формате: https://github.com/nickname" fullWidth onChange={handleChange}
                     onBlur={handleBlur}
                     value={values.studentGithub}/>
          {/* {JSON.stringify(children, 0, 2)} */}
          <SimpleTabs classes={{ root: 'tab-root' }}
                      item1={evaluation}
                      item2={expel}
                      item3="оставить фидбек"
          />


          {/* <input */}
          {/*  type="url" */}
          {/*  name="studentGithub" */}
          {/*  onChange={handleChange} */}
          {/*  onBlur={handleBlur} */}
          {/*  value={values.studentGithub} */}
          {/* /> */}


          <Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
            Submit
          </Button>
        </form>;
      }}
    </Formik>
  </div>;


class SimpleTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      classes, item1, item2, item3,
    } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root} style={{ height: 400 }}>
        <AppBar position="static">
          <Tabs style={{}} value={value} onChange={this.handleChange}>
            <Tab label="Выставить оценку" />
            {/*<Tab label="Отчислить" />*/}
            {/*<Tab label="Оставить фидбек" />*/}
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>{item1}</TabContainer>}
        {value === 1 && <TabContainer>{item2}</TabContainer>}
        {value === 2 && <TabContainer>{item3}</TabContainer>}
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  item1: PropTypes.node,
  item2: PropTypes.node,
  item3: PropTypes.node,
};

// export default withStyles(styles)(SimpleTabs);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fff176',
    },
    secondary: pink,
  },
});

function MentorForm() {
  //
  return (
    <MuiThemeProvider
      theme={
        theme
      }
    >
      <React.Fragment>
        <FromAppBar/>

        <PaperSheet>
          <Typography variant="h5" gutterBottom>
            Score RSSchool 2019Q1
          </Typography>

          <FormSubmit>

          </FormSubmit>
        </PaperSheet>

      </React.Fragment>
    </MuiThemeProvider>

  );
}

export default MentorForm;
