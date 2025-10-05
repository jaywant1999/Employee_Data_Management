const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sqlite3 = require("sqlite3");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./employeedb.db", (err) => {
  if (err) {
    console.log("database connection failed... " + err.message);
  } else {
    console.log("Database connected successfully....");
  }
});

db.run(`
    create table if not exists employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName varchar(100) NOT NULL,
        lastName varchar(100) NOT NULL,
        email varchar(100) UNIQUE NOT NULL,
        designation varchar(100) NOT NULL,
        department varchar(100),
        salary INTEGER NOT NULL
        )
    `);

app.post("/api/employees", (req, res) => {
  const { firstName, lastName, email, designation, department, salary } =
    req.body;
  const sql = `INSERT into employees (firstName,lastName,email, designation, department, salary) values (?,?,?,?,?,?)`;
  db.run(
    sql,
    [firstName, lastName, email, designation, department, salary],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, ...req.body });
    }
  );
});

app.get("/api/employees", (req, res) => {
  db.all("select * from employees", [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get("/api/employees/:id", (req, res) => {
  const sql = "select * from employees where id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(row);
  });
});

app.put("/api/employees/:id", (req, res) => {
  const { firstName, lastName, email, designation, department, salary } =
    req.body;
  const sql = `Update employees set firstName=?,lastName=?,email=?,designation=?,department=?,salary=? where id=?`;
  db.run(
    sql,
    [
      firstName,
      lastName,
      email,
      designation,
      department,
      salary,
      req.params.id,
    ],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

app.delete("/api/employees/:id", (req, res) => {
  const sql = "Delete from employees where id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  });
});

const PORT = process.env.PORT || 2825;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});