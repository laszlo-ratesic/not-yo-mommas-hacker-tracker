const db = require("../db/connection");

class Department {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

module.exports = Department;
