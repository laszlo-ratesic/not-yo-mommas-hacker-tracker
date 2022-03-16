const inquirer = require("inquirer");
const db = require("../db/connection");
const cTable = require("console.table");
const gradient = require("gradient-string");

class Organization {
  constructor() {
    this.departments = [];
    this.roles = [];
    this.employees = [];
  }
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
  const departments = this.departments.map((department) => {
    return department.name;
  })

  const prompt = await inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Enter the name of the department:",
        validate: function(input) {
          if (departments.includes(input)) {
            console.log('That department already exists.');
            return false;
          }
          return true;
        }
      },
    ])
    .then((data) => {
      db.query(`INSERT INTO departments (name)
              VALUE
                ('${data.department}')`);
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const msg = `◣ ◢ Added the ${data.department} department to the database`;
      this.mainMenu(msg);
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
  const departments = this.departments.map((department) => {
    return department.name;
  });
  const deptIds = this.departments.map((department) => {
    return department.id;
  });

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
        choices: departments,
      },
    ])
    .then(async (data) => {
      await db.promise().query(`INSERT INTO roles (title, salary, department_id)
              VALUE
                ('${data.role}', '${data.salary}', '${
        deptIds[departments.indexOf(data.department)]
      }')`);
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const msg = `◣ ◢ Added the role of ${data.role} to the database`;
      this.mainMenu(msg);
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

Organization.prototype.showEmployeesByManager = async function () {
  const managers = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });
  const managerIds = this.employees.map((employee) => {
    return employee.id;
  });

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "manager",
        message: "Choose a manager",
        choices: managers,
      },
    ])
    .then(async (response) => {
      console.clear();
      const prompt = await db
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
            RIGHT JOIN employees m ON m.id = e.manager_id
            WHERE m.id = ${managerIds[managers.indexOf(response.manager)]}
            ORDER BY id`
        )
        .then(([rows, fields]) => {
          console.table(rows);
        })
        .catch((err) => console.log(err));
    });
};

Organization.prototype.showEmployeesByDepartment = async function () {
  const departments = this.departments.map((department) => {
    return department.name;
  });
  const deptIds = this.departments.map((department) => {
    return department.id;
  });

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Choose a department",
        choices: departments,
      },
    ])
    .then(async (response) => {
      console.clear();
      const prompt = await db
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
            WHERE roles.department_id = ${
              deptIds[departments.indexOf(response.department)]
            }
            ORDER BY id`
        )
        .then(([rows, fields]) => {
          console.table(rows);
        })
        .catch((err) => console.log(err));
    });
};

Organization.prototype.showBudgetByDepartment = async function () {
  const departments = this.departments.map((department) => {
    return department.name;
  });
  const deptIds = this.departments.map((department) => {
    return department.id;
  })

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Choose a department",
        choices: departments,
      },
    ])
    .then(async (response) => {
      console.clear();
      const prompt = await db
        .promise()
        .query(
          `SELECT 		e.id,
        departments.name AS department,
        SUM(salary) AS budget
        FROM employees e
        INNER JOIN roles ON e.role_id = roles.id
        INNER JOIN departments ON roles.department_id = departments.id
        RIGHT JOIN employees m ON m.id = e.manager_id
        WHERE roles.department_id = ${
          deptIds[departments.indexOf(response.department)]
        }`
        )
        .then(([rows, fields]) => {
          console.table(rows);
        })
        .catch((err) => console.log(err));
    });
};

Organization.prototype.addEmployee = async function () {
  const roleTitles = this.roles.map((role) => {
    return role.title;
  });
  const roleIds = this.roles.map((role) => {
    return role.id;
  });
  const managers = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });
  const managerIds = this.employees.map((employee) => {
    return employee.id;
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
        choices: roleTitles,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managers,
      },
    ])
    .then(async (data) => {
      await db.promise()
        .query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUE
                  ('${data.firstName}', '${data.lastName}', '${
        roleIds[roleTitles.indexOf(data.role)]
      }', '${managerIds[managers.indexOf(data.manager)]}')`);
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const msg = `◣ ◢ Added ${data.firstName} ${data.lastName} to the database`;
      this.mainMenu(msg);
    });
};

Organization.prototype.updateEmployeeRole = async function () {
  const emplArr = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });
  const employeeIds = this.employees.map((employee) => {
    return employee.id;
  });
  const roleTitles = this.roles.map((role) => {
    return role.title;
  });
  const roleIds = this.roles.map((role) => {
    return role.id;
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
        choices: roleTitles,
      },
    ])
    .then((data) => {
      db.query(`UPDATE employees
                SET role_id = ${roleIds[roleTitles.indexOf(data.role)]}
                WHERE id = ${employeeIds[emplArr.indexOf(data.employee)]}`);
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const msg = `◣ ◢ Updated ${data.employee}'s role to ${data.role} in the database.`;
      this.mainMenu(msg);
    });
};

Organization.prototype.updateEmployeeManager = async function () {
  const emplArr = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });
  const employeeIds = this.employees.map((employee) => {
    return employee.id;
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
        choices: emplArr,
      },
    ])
    .then((data) => {
      db.query(`UPDATE employees
                SET manager_id = ${employeeIds[emplArr.indexOf(data.manager)]}
                WHERE id = ${employeeIds[emplArr.indexOf(data.employee)]}`);
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const msg = `◣ ◢ Updated ${data.employee}'s manager to ${data.manager} in the database.`;
      this.mainMenu(msg);
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
          `Add ${table}`,
          `Delete ${table}`,
          "Exit Reaver CMS",
        ],
      },
    ])
    .then((menu) => {
      console.clear();
      if (menu.choice === "Return to bridge") {
        this.mainMenu();
      }
      if (menu.choice === `Add ${table}`) {
        if (table === "department") {
          this.addDepartment();
        }
        if (table === "role") {
          this.addRole();
        }
        if (table === "employee") {
          this.addEmployee();
        }
      }
      if (menu.choice === `Delete ${table}`) {
        if (table === "department") {
          this.deleteDepartment();
        }
        if (table === "role") {
          this.deleteRole();
        }
        if (table === "employee") {
          this.deleteEmployee();
        }
      }
      if (menu.choice === "Exit Reaver CMS") {
        this.exitProgram();
      }
    });
};

Organization.prototype.deleteDepartment = async function () {
  const departments = this.departments.map((department) => {
    return department.name;
  });
  const deptIds = this.departments.map((department) => {
    return department.id;
  })

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Which department would you like to delete?",
        choices: departments,
      },
    ])
    .then(async (deleting) => {
      await inquirer
        .prompt([
          {
            type: "confirm",
            name: "confirmDelete",
            message: `Are you sure you would like to delete the ${deleting.department} department?`,
            default: false,
          },
        ])
        .then(async (response) => {
          if (!response.confirmDelete) {
            this.deleteStuff();
          }
        });

      return deleting;
    })
    .then(async (deleted) => {
      await db.promise().query(`DELETE FROM departments
      WHERE id = ${deptIds[departments.indexOf(deleted.department)]}`);
      this.seedDatabase();
      const msg = `◣ ◢ Deleted the ${deleted.department} department from the database.`;
      this.mainMenu(msg);
    });
};
Organization.prototype.deleteRole = async function () {
  const roles = this.roles.map((role) => {
    return role.title;
  });
  const roleIds = this.roles.map((role) => {
    return role.id;
  })

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "Which role would you like to delete?",
        choices: roles,
      },
    ])
    .then(async (deleting) => {
      await inquirer
        .prompt([
          {
            type: "confirm",
            name: "confirmDelete",
            message: `Are you sure you would like to delete the ${deleting.role} role?`,
            default: false,
          },
        ])
        .then(async (response) => {
          if (!response.confirmDelete) {
            this.deleteStuff();
          }
        });

      return deleting;
    })
    .then(async (deleted) => {
      await db.promise().query(`DELETE FROM roles
      WHERE id = ${roleIds[roles.indexOf(deleted.role)]}`);
      this.seedDatabase();
      const msg = `◣ ◢ Deleted the ${deleted.role} role from the database.`;
      this.mainMenu(msg);
    });
};

Organization.prototype.deleteEmployee = async function () {
  const employees = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });
  const employeeIds = this.employees.map((employee) => {
    return employee.id;
  })

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to delete?",
        choices: employees,
      },
    ])
    .then(async (deleting) => {
      await inquirer
        .prompt([
          {
            type: "confirm",
            name: "confirmDelete",
            message: `Are you sure you would like to delete ${deleting.employee} from the database?`,
            default: false,
          },
        ])
        .then(async (response) => {
          if (!response.confirmDelete) {
            this.deleteStuff();
          }
        });

      return deleting;
    })
    .then(async (deleted) => {
      await db.promise().query(`DELETE FROM employees
      WHERE id = ${employeeIds[employees.indexOf(deleted.employee)]}`);
      this.seedDatabase();
      const msg = `◣ ◢ Deleted ${deleted.employee} from the database.`;
      this.mainMenu(msg);
    });
};

Organization.prototype.deleteStuff = async function () {
  const prompt = await inquirer
    .prompt([
      {
        type: "confirm",
        name: "confirmDelete",
        message: "Are you sure you wanna delete stuff?",
        default: false,
      },
    ])
    .then(async (response) => {
      if (!response.confirmDelete) {
        return;
      }
      await inquirer
        .prompt([
          {
            type: "list",
            name: "stuff",
            message: "What would you like to delete?",
            choices: [
              "Delete a department",
              "Delete a role",
              "Delete an employee",
            ],
          },
        ])
        .then((response) => {
          if (response.stuff === "Delete a department") {
            this.deleteDepartment();
          }
          if (response.stuff === "Delete a role") {
            this.deleteRole();
          }
          if (response.stuff === "Delete an employee") {
            this.deleteEmployee();
          }
        });
    });
};

Organization.prototype.exitProgram = function () {
  console.log(gradient("gold", "red")("Farewell, Captain. Until next time..."));
  process.exit();
};

Organization.prototype.mainMenu = async function (msg) {
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
  (msg) ? console.log(gradient.summer(msg)) : '';
  const prompt = await inquirer
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
        this.addDepartment();
      } else if (menu.choice === "Add a role") {
        this.addRole();
      } else if (menu.choice === "Add an employee") {
        this.addEmployee();
      } else if (menu.choice === "Update an employee role") {
        this.updateEmployeeRole();
      } else if (menu.choice === "Update an employee manager") {
        this.updateEmployeeManager();
      } else if (menu.choice === "View employees by manager") {
        this.showEmployeesByManager().then(() => {
          this.displayOptions("employee");
        });
      } else if (menu.choice === "View employees by department") {
        this.showEmployeesByDepartment().then(() => {
          this.displayOptions("employee");
        });
      } else if (menu.choice === "View totalized budget by department") {
        this.showBudgetByDepartment().then(() => {
          this.displayOptions("department");
        });
      } else if (menu.choice === "Delete stuff") {
        this.deleteStuff();
      }
    });
};

module.exports = Organization;
