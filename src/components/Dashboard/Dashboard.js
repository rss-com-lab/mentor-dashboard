import "./Dashboard.scss";
import React from "react";
import Select from "react-select";
import { mentorsList, getCurrentMentor, setStudent, setTask } from './parser';

class Dashboard extends React.Component {
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

export default Dashboard;
