import React from "react";
import "./Home.css";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

function Home() {
  return (
    <div className="maindiv">
      <div className="header">
        <h1>DASHBOARD</h1>
      </div>

      <div>
        <h2>Total Employees : </h2>
        <input id="search" />
      </div>

      <div className="emplist">
        <table className="emptable">
          <tr>
            <th>Employee_Id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>E-mail</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>

          <tr>
            <td>1</td>
            <td>Jaywant</td>
            <td>Belkhede</td>
            <td>jaywant@gmail.com</td>
            <td>Associate Developer</td>
            <td>Development</td>
            <td>450000</td>
            <td className="actionbtn">
              <button id="editbtn">
                <FaEdit />
              </button>
              <button id="delbtn">
                <MdDeleteOutline />
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Home;
