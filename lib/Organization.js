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

Organization.prototype.seedDatabase = async function () {
  const getDepartments = await db
    .promise()
    .query(`SELECT * FROM departments`)
    .then((results) => {
      this.departments = results[0];
    });

  const getRoles = await db
    .promise()
    .query(`SELECT * FROM roles`)
    .then((results) => {
      this.roles = results[0];
    });

  const getEmployees = await db
    .promise()
    .query(`SELECT * FROM employees`)
    .then((results) => {
      this.employees = results[0];
    });

  this.mainMenu();
};

Organization.prototype.showDepartments = async function () {
  console.clear();
  const getTable = await db
    .promise()
    .query(`SELECT * FROM departments`)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

Organization.prototype.addDepartment = async function () {
  const prompt = await inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Enter the name of the department:",
      },
    ])
    .then((data) => {
      db.query(`INSERT INTO departments (name)
              VALUE
                ('${data.department}')`);
      return data;
    })
    .then((data) => {
      console.log(`Added ${data.department} to the database`);
    });
};

Organization.prototype.showRoles = async function () {
  console.clear();
  const getTable = await db
    .promise()
    .query(
      `SELECT roles.id, title, salary, departments.name
  AS department
  FROM roles
  LEFT JOIN departments
  ON roles.department_id = departments.id`
    )
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

Organization.prototype.addRole = async function () {
  const prompt = await inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "Enter the name of the role:",
      },
      {
        type: "number",
        name: "salary",
        message: "Enter the salary for this role:",
      },
      {
        type: "list",
        name: "department",
        message: "Which department does this role belong to?",
        choices: this.departments,
      },
    ])
    .then((data) => {
      const deptArr = this.departments.map((department) => {
        return department.name;
      });
      db.query(`INSERT INTO roles (title, salary, department_id)
              VALUE
                ('${data.role}', '${data.salary}', '${
        deptArr.indexOf(data.department) + 1
      }')`);
      return data;
    })
    .then((data) => {
      console.log(`Added ${data.role} to the database`);
    });
};

Organization.prototype.showEmployees = async function () {
  console.clear();
  const getTable = await db
    .promise()
    .query(
      `SELECT e.id,
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
  ORDER BY id`
    )
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

Organization.prototype.addEmployee = async function () {
  const jobTitles = this.roles.map((role) => {
    return role.title;
  });

  const managers = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });

  const prompt = await inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's job title?",
        choices: jobTitles,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managers,
      },
    ])
    .then((data) => {
      db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUE
                  ('${data.firstName}', '${data.lastName}', '${
        jobTitles.indexOf(data.role) + 1
      }', '${managers.indexOf(data.manager) + 1}')`);
      return data;
    })
    .then((data) => {
      console.log(`Added ${data.firstName} to the database.`);
    });
};

Organization.prototype.updateEmployeeRole = async function () {
  const emplArr = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });
  const jobTitles = this.roles.map((role) => {
    return role.title;
  });

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Select an employee to update",
        choices: emplArr,
      },
      {
        type: "list",
        name: "role",
        message: "Select the employee's new role",
        choices: jobTitles,
      },
    ])
    .then((data) => {
      db.query(`UPDATE employees
                SET role_id = ${jobTitles.indexOf(data.role) + 1}
                WHERE id = ${emplArr.indexOf(data.employee) + 1}`);
      return data;
    })
    .then((data) => {
      console.log(`Updated ${data.employee}'s role.`);
    });
};

Organization.prototype.updateEmployeeManager = async function () {
  const emplArr = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });
  const managers = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Select an employee to update",
        choices: emplArr,
      },
      {
        type: "list",
        name: "manager",
        message: "Select the employee's new manager",
        choices: managers,
      },
    ])
    .then((data) => {
      db.query(`UPDATE employees
                SET manager_id = ${managers.indexOf(data.manager) + 1}
                WHERE id = ${emplArr.indexOf(data.employee) + 1}`);
      return data;
    })
    .then((data) => {
      console.log(`Updated ${data.employee}'s manager.`);
    });
};

Organization.prototype.displayOptions = function (table) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "Return to bridge",
          `Update ${table}s`,
          `Add ${table}`,
          "Exit Reaver CMS",
        ],
      },
    ])
    .then((menu) => {
      console.clear();
      if (menu.choice === "Return to bridge") {
        this.mainMenu();
      }
      if (menu.choice === `Update ${table}s`) {
        if (table === "employee") {
          inquirer
            .prompt([
              {
                type: "list",
                name: "field",
                message: "Which field would you like to update?",
                choices: ["Employee role", "Employee manager"],
              },
            ])
            .then((answer) => {
              if (answer.field === "Employee role") {
                this.updateEmployeeRole().then(() => {
                  this.showEmployees().then(() => {
                    this.displayOptions(table);
                  });
                });
              } else {
                this.updateEmployeeManager().then(() => {
                  this.showEmployees().then(() => {
                    this.displayOptions(table);
                  })
                })
              }
            });
        }
      }
      if (menu.choice === `Add ${table}`) {
        if (table === "department") {
          this.addDepartment().then(() => {
            this.showDepartments().then(() => {
              this.displayOptions(table);
            });
          });
        }
        if (table === "role") {
          this.addRole().then(() => {
            this.showRoles().then(() => {
              this.displayOptions(table);
            });
          });
        }
        if (table === "employee") {
          this.addEmployee().then(() => {
            this.showEmployees().then(() => {
              this.displayOptions(table);
            });
          });
        }
      }
      if (menu.choice === "Exit Reaver CMS") {
        this.exitProgram();
      }
    });
};

Organization.prototype.exitProgram = function () {
  console.log(gradient("gold", "red")("Farewell, Captain. Until next time..."));
  process.exit();
};

Organization.prototype.mainMenu = function () {
  console.clear();
  console.log(
    gradient(
      "silver",
      "silver",
      "red",
      "red",
      "gold"
    )(`
    ██▀███  ▓█████ ▄▄▄    ██▒   █▓▓█████  ██▀███      ▄████▄   ███▄ ▄███▓  ██████
    ▓██ ▒ ██▒▓█   ▀▒████▄ ▓██░   █▒▓█   ▀ ▓██ ▒ ██▒   ▒██▀ ▀█  ▓██▒▀█▀ ██▒▒██    ▒
    ▓██ ░▄█ ▒▒███  ▒██  ▀█▄▓██  █▒░▒███   ▓██ ░▄█ ▒   ▒▓█    ▄ ▓██    ▓██░░ ▓██▄
    ▒██▀▀█▄  ▒▓█  ▄░██▄▄▄▄██▒██ █░░▒▓█  ▄ ▒██▀▀█▄     ▒▓▓▄ ▄██▒▒██    ▒██   ▒   ██▒
    ░██▓ ▒██▒░▒████▒▓█   ▓██▒▒▀█░  ░▒████▒░██▓ ▒██▒   ▒ ▓███▀ ░▒██▒   ░██▒▒██████▒▒
    ░ ▒▓ ░▒▓░░░ ▒░ ░▒▒   ▓▒█░░ ▐░  ░░ ▒░ ░░ ▒▓ ░▒▓░   ░ ░▒ ▒  ░░ ▒░   ░  ░▒ ▒▓▒ ▒ ░
      ░▒ ░ ▒░ ░ ░  ░ ▒   ▒▒ ░░ ░░   ░ ░  ░  ░▒ ░ ▒░     ░  ▒   ░  ░      ░░ ░▒  ░ ░
      ░░   ░    ░    ░   ▒     ░░     ░     ░░   ░    ░        ░      ░   ░  ░  ░
       ░        ░  ░     ░  ░   ░     ░  ░   ░        ░ ░             ░         ░
                               ░                      ░
    Connected to hacker_db.`)
  );

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
          "Update an employee manager",
          "View employees by manager",
          "View employees by department",
          "View totalized budget by department",
          "Delete stuff",
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
      } else if (menu.choice === "Add a department") {
        this.addDepartment().then(() => {
          this.mainMenu();
        });
      } else if (menu.choice === "Add a role") {
        this.addRole().then(() => {
          this.mainMenu();
        });
      } else if (menu.choice === "Add an employee") {
        this.addEmployee().then(() => {
          this.mainMenu();
        });
      } else if (menu.choice === "Update an employee role") {
        this.updateEmployeeRole().then(() => {
          this.mainMenu();
        });
      } else if (menu.choice === "Update an employee manager") {
        this.updateEmployeeManager().then(() => {
          this.mainMenu();
        });
      } else if (menu.choice === "View employees by manager") {
        this.showEmployees
      }
    });
};

module.exports = Organization;
