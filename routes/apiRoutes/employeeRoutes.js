const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

// GET a list of all departments
router.get("/employees", (req, res) => {
  const sql = `SELECT employees.*
                FROM employees`;

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

module.exports = router;
