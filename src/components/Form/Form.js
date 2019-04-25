import React from 'react';
import Select from 'react-select';
import './Form.scss';

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
