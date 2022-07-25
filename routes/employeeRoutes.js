const express = require("express");
const db = require("../db/connection");
const router = express.Router();

//joins tables to see all employees with their roles and departments
// select employees.*, roles.title as role_function, departments.name as department from employees left join roles on employees.role_id = roles.id left join departments on roles.department_id=departments.id;

//get all employees
router.get("/employees", (req, res) => {
  const sql = `SELECT * FROM employees`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// get employee by id
router.get("/employee/:id", (req, res) => {
  const sql = `SELECT * FROM employees WHERE id =?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

// post new employee
router.post("/employee", ({ body }, res) => {
  const sql = `INSERT INTO employees(first_name, last_name,role_id,manager_id) VALUES (?,?,?,?)`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
});

//update employee
router.put("/employee/:id", (req, res) => {
  const sql = `UPDATE employees SET first_name=?, last_name=?, role_id=?, manager_id = ? WHERE id = ?`;
  const params = [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "employee not found",
      });
    } else {
      res.json({
        message: "success",
        data: req.body,
        changes: result.affectedRows,
      });
    }
  });
});

//delete employee
router.delete("/employee/:id", (req, res) => {
  const sql = `DELETE FROM employees WHERE id = ?`;
  //const params = [req.body.id];
  db.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "employee not found",
      });
    } else {
      res.json({
        message: "success",
        data: result.affectedRows,
        id: req.params.id,
      });
    }
  });
});

module.exports = router;