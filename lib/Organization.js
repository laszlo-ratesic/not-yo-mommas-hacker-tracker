const inquirer = require("inquirer");
const Department = require("./Department");
const Employee = require("./Employee");
const Role = require("./Role");
const db = require("../db/connection");
const cTable = require("console.table");

function Organization() {
  this.departments = [];
  this.roles = [];
  this.employees = [];
}

Organization.prototype.showDepartments = function () {
  db.query(`SELECT * FROM departments`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(rows);
  });
};

Organization.prototype.showRoles = function () {
  db.query(`SELECT * FROM roles`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(rows);
  });
};

Organization.prototype.showEmployees = function () {
  db.query(`SELECT * FROM employees`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(rows);
  });
};

Organization.prototype.mainMenu = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((menu) => {
      if (menu.choice === "View all departments") {
        this.showDepartments();
      } else if (menu.choice === "View all roles") {
        this.showRoles();
      } else if (menu.choice === "View all employees") {
        this.showEmployees();
      }
    });
};

module.exports = Organization;
