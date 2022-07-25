const express = require("express");
const db = require("../db/connection");
const router = express.Router();

//get all departments
router.get("/departments", (req, res) => {
  const sql = `SELECT * FROM departments`;

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

// get department by id
router.get("/department/:id", (req, res) => {
  const sql = `SELECT * FROM departments WHERE id =?`;
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

// post new department
router.post("/department", ({ body }, res) => {
  const sql = `INSERT INTO departments(name) VALUES (?)`;
  const params = [body.name];
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

//update department
router.put("/department/:id", (req, res) => {
  const sql = `UPDATE departments SET name = ? WHERE id = ?`;
  const params = [req.body.name, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "department not found",
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

//delete department
router.delete("/department/:id", (req, res) => {
  const sql = `DELETE FROM departments WHERE id = ?`;
  //const params = [req.body.id];
  db.query(sql,req.params.id,(err,result)=>{
    if(err){
      res.status(400).json({error:err.message});
    } else if (!result.affectedRows) {
      res.json({
        message: "department not found"
      });
    } else {
      res.json({
        message: 'success',
        data: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

module.exports = router;