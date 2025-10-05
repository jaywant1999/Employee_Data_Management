import React, { useEffect, useState } from "react";
import "./Home.css";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [searchEmployee, setSearchEmployee] = useState("");

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      designation: "",
      department: "",
      salary: "",
    });
    setEditEmployee(null);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    designation: "",
    department: "",
    salary: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://192.168.1.103:2825/api/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editEmployee ? "PUT" : "POST";
      const url = editEmployee
        ? `http://192.168.1.103:2825/api/employees/${editEmployee.id}`
        : "http://192.168.1.103:2825/api/employees";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          editEmployee
            ? "Employee updated successfully"
            : "Employee added successfully"
        );
        closeModal();

        fetchEmployees();
        setEditEmployee(null);
      } else {
        alert("Errorin in adding employee");
      }
    } catch (error) {
      console.log("Eror in adding :", error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(`Are you sure you want to delete employee with id ${id}`)
    );
    try {
      const response = await fetch(
        `http://localhost:2825/api/employees/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        alert(`Employee with id ${id} delete successfully`);
        fetchEmployees();
      } else {
        alert("Error in deleting employee!");
      }
    } catch (error) {
      console.log("Error in delete ", error);
      alert("Something went wrong");
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      designation: employee.designation,
      department: employee.department,
      salary: employee.salary,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="maindiv">
      <div className="header">
        <h1>DASHBOARD</h1>
      </div>

      <div id="totalemp">
        <h2>Total Employees : {employees.length} </h2>
      </div>

      <div className="subdiv">
        <div id="search">
          <CiSearch id="sicon" />
          <input
            placeholder="search..."
            value={searchEmployee}
            onChange={(e) => {
              setSearchEmployee(e.target.value);
            }}
          />
        </div>
        <button id="addbtn" onClick={openModal}>
          Add
        </button>
      </div>

      <div className="emplist">
        <table className="emptable">
          <thead>
            <tr>
              <th>Employee Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>E-mail</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Salary (LPA)</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees
              .filter((emp) => {
                const term = searchEmployee.toLowerCase();
                return (
                  emp.firstName.toLowerCase().includes(term) ||
                  emp.lastName.toLowerCase().includes(term)
                );
              })
              .map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.firstName}</td>
                  <td>{emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.department}</td>
                  <td>{emp.salary}</td>
                  <td className="actionbtn">
                    <button id="editbtn" onClick={() => handleEdit(emp)}>
                      <FaEdit id="edit" />
                    </button>
                    <button id="delbtn" onClick={() => handleDelete(emp.id)}>
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editEmployee ? "Update Employee" : "Add Employee"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label hrmlfor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label hrmlfor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="designation">Designation</label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  placeholder="Salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="submit">
                  {editEmployee ? "Update" : "Save"}
                </button>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
