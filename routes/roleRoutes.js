const express = require("express");
const db = require("../db/connection");
const router = express.Router();

//get all roles
router.get("/roles", (req, res) => {
  const sql = `SELECT * FROM roles`;

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

// get role by id
router.get("/role/:id", (req, res) => {
  const sql = `SELECT * FROM roles WHERE id =?`;
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

// post new role
router.post("/role", ({ body }, res) => {
  const sql = `INSERT INTO roles(title, salary,department_id) VALUES (?,?,?)`;
  const params = [body.title, body.salary, body.department_id];
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

//update role
router.put("/role/:id", (req, res) => {
  const sql = `UPDATE roles SET title=?, salary=?, department_id = ? WHERE id = ?`;
  const params = [req.body.title, req.body.salary, req.body.department_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "role not found",
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

//delete role
router.delete("/role/:id", (req, res) => {
  const sql = `DELETE FROM roles WHERE id = ?`;
  //const params = [req.body.id];
  db.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "role not found",
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