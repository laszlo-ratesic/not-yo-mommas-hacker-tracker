const inquirer = require("inquirer");
const Department = require("./Department");
const Employee = require("./Employee");
const Role = require("./Role");
const db = require("../db/connection");
const cTable = require("console.table");
const gradient = require("gradient-string");

function Organization() {
  this.departments = [];
  this.roles = [];
  this.employees = [];
}

Organization.prototype.showDepartments = async function () {
  console.clear();
  const getTable = await db
    .promise()
    .query(`SELECT * FROM departments`)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

Organization.prototype.addDepartment = function() {

}

Organization.prototype.showRoles = async function () {
  console.clear();
  const getTable = await db
    .promise()
    .query(`SELECT roles.id, title, salary, departments.name
            AS department
            FROM roles
            LEFT JOIN departments
            ON roles.department_id = departments.id`)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

Organization.prototype.showEmployees = async function () {
  console.clear();
  const getTable = await db
    .promise()
    .query(`SELECT e.id,
            e.first_name,
            e.last_name,
            roles.title AS job_title,
            departments.name AS department,
            roles.salary AS salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employees e
            INNER JOIN roles ON e.role_id = roles.id
            INNER JOIN departments ON roles.department_id = departments.id
            LEFT JOIN employees m ON m.id = e.manager_id
            ORDER BY id`)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

Organization.prototype.displayOptions = function (table) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["Return to bridge", `Update ${table}s`, `Add ${table}`, "Exit Reaver CMS"],
      },
    ])
    .then((menu) => {
      console.clear();
      if (menu.choice === "Return to bridge") {
        this.mainMenu();
      }
      if (menu.choice === `Update ${table}s`) {
        this.mainMenu();
      }
      if (menu.choice === `Add ${table}`) {
        if (table === 'department') {
          console.log('Add a department here');
        }
        if (table === 'role') {
          console.log('Add a role here');
        }
        if (table === 'employee') {
          console.log('Add an employee here');
        }
      }
      if (menu.choice === "Exit Reaver CMS") {
        this.exitProgram();
      }
    });
};

Organization.prototype.exitProgram = function () {
  console.log(gradient("gold", "red")("Farewell, Captain! Until next time..."));
  process.exit();
};

Organization.prototype.mainMenu = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Welcome to the bridge, captain. What would you like to do?",
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
        this.showDepartments().then(() => {
          this.displayOptions("department");
        });
      } else if (menu.choice === "View all roles") {
        this.showRoles().then(() => {
          this.displayOptions("role");
        });
      } else if (menu.choice === "View all employees") {
        this.showEmployees().then(() => {
          this.displayOptions("employee");
        });
      }
    });
};

module.exports = Organization;
