const db = require("../db/connection");

class Department {
  constructor() {
    this.departments = departments;
    db.promise().query(`SELECT * FROM departments`)
    .then((results) => {
      this.departments = results[0];
    })
  }
}

module.exports = Department;
