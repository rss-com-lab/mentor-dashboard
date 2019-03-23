import "./Form.scss";
import React from "react";
import Select from "react-select";
class Form extends React.Component {
  render() {
    return (
      <div className="App">
        <Select />

        <table className="table mentor-table">
          <thead className="thead">
            <tr>
              <td className="mentorTitle">Заглушка</td>
              <td className="mentorTitle">формы</td>
            </tr>
          </thead>
        </table>
      </div>
    );
  }
}

export default Form;
