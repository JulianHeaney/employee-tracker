const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");
const { promise } = require("./db/connection");

const promptMenu = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "Please choose what you would like to do",
        choices: [
          "View all Departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
          "Quit",
        ],
      },
    ])
    .then((selectedChoice) => {
      switch (selectedChoice.menu) {
        case "View all Departments":
          selectDepartments();
          break;
        case "View all roles":
          selectRoles();
          break;
        case "View all employees":
          selectEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update employee role":
          updateEmployee();
          break;
        default:
          process.exit();
      }
    });
};

const selectDepartments = () => {
  db.query(`SELECT * FROM departments`, (err, results) => {
    console.table(results);
    promptMenu();
  });
};

const selectRoles = () => {
  db.query(
    `SELECT roles.id, roles.title, roles.salary, departments.name AS department 
    FROM roles 
    LEFT JOIN departments
    ON roles.department_id=departments.id`,
    (err, results) => {
      console.table(results);
      promptMenu();
    }
  );
};

const selectEmployees = () => {
  db.query(
    `SELECT e.id, e.first_name, e.last_name, 
     r.title AS role,
     r.salary AS salary,
     d.name AS department,
     CONCAT(m.first_name," ",m.last_name) AS manager
     FROM employees e
     LEFT JOIN roles r
     ON e.role_id = r.id
     LEFT JOIN departments d
     ON r.department_id = d.id
     LEFT JOIN employees m
     ON e.manager_id = m.id`,
    (err, results) => {
      console.log("error", err);
      console.table(results);
      promptMenu();
    }
  );
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the new department's name?",
        validate: (name) => {
          if (name) {
            return true;
          } else {
            console.log("please enter a name for the department");
            return false;
          }
        },
      },
    ])
    .then((departmentName) => {
      db.query(
        `INSERT INTO departments (name) VALUES (?)`,
        departmentName.name,
        (err, rows) => {
          if (err) {
            console.log("error in department name", err.message);
          }
          console.log("Added Department");
          return promptMenu();
        }
      );
    });
};

const addRole = () => {
  db.query(`SELECT * FROM departments`, function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is title of the new role?",
          validate: (title) => {
            if (title) {
              return true;
            } else {
              console.log("please enther the title of the new role");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "salary",
          message: "what is the salary for the new role?",
          validate: (salary) => {
            if (salary) {
              return true;
            } else {
              console.log("enter the salary for the role");
              return false;
            }
          },
        },
        {
          type: "list",
          name: "department",
          message: "What department is this new role for?",
          //makes new array of department names for choices, including any recently created
          choices: () => {
            const departmentNameArr = [];
            for (let i = 0; i < res.length; i++) {
              departmentNameArr.push(res[i].name);
            }
            return departmentNameArr;
          },
        },
      ])
      .then((answer) => {
        let departmentId;
        for (let index = 0; index < res.length; index++) {
          if (res[index].name == answer.department) {
            departmentId = res[index].id;
          }
        }

        db.query(
          `INSERT INTO roles SET ?`,
          {
            title: answer.title,
            salary: answer.salary,
            department_id: departmentId,
          },
          (err, res) => {
            if (err) throw err;
            console.log("role has been added");
            promptMenu();
          }
        );
      });
  });
};

const addEmployee = () => {
  db.query(`SELECT * FROM roles`, (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee last name?",
        },
        {
          type: "list",
          name: "title",
          message: "what is the employee's role?",
          choices: () => {
            let roleArr = [];
            for (let i = 0; i < res.length; i++) {
              roleArr.push(res[i].title);
            }
            return roleArr;
          },
        },
        {
          type: "input",
          name: "manager",
          message: "enter manager's id",
        },
      ])
      .then((answer) => {
        let roleId;
        for (let index = 0; index < res.length; index++) {
          if (res[index].title == answer.title) {
            roleId = res[index].id;
          }
        }
        db.query(
          `INSERT INTO employees SET ?`,
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: roleId,
            manager_id: answer.manager,
          },
          (err) => {
            if (err) throw err;
            promptMenu();
          }
        );
      });
  });
};

// Concatenates employee first and last names
function getEmployeeFirstAndLast() {
  return new Promise((resolve) => {
    db.query(`SELECT first_name, last_name FROM employees`, (err, rows) => {
      if (err) throw err;
      let employee = [];
      for (i = 0; i < rows.length; i++) {
        employee.push({
          id: i,
          name: rows[i].first_name + " " + rows[i].last_name,
        });
      }
      resolve(employee);
    });
  });
}

// returns an array of the concatenation of employee's first and last names asynchronously
async function asyncEmployee() {
  const result = await getEmployeeFirstAndLast();
  return result;
}

//get array of roles
function getRoleOptions() {
  return new Promise((resolve) => {
    db.query(`SELECT title FROM roles`, (err, rows) => {
      if (err) throw err;
      let rolesArr = [];
      for (i = 0; i < rows.length; i++) {
        rolesArr.push(rows[i].title);
      }
      resolve(rolesArr);
    });
  });
}

// asynchronously returns an array of available roles
async function asyncRole() {
  const result = await getRoleOptions();
  return result;
}

const updateEmployee = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        id: "id",
        message: "choose the employee",
        choices: () => {
          return asyncEmployee();
        },
      },
    ])
    .then((name) => {
      db.query(
        `SELECT * FROM employees WHERE CONCAT(first_name," ",last_name) = ?`,
        name.employee,
        (err, res) => {
          if (err) throw err;
          let employeeId = res[0].id;
          inquirer
            .prompt([
              {
                type: "list",
                name: "title",
                message: "what is the employee's new role",
                choices: () => {
                  return asyncRole();
                },
              },
            ])
            .then((data) => {
              db.query(
                `SELECT * FROM roles WHERE title =?`,
                data.title,
                (err, res) => {
                  if (err) throw err;
                  let roleId = res[0].id;

                  db.query(
                    `UPDATE employees SET role_id = ? WHERE id = ?`,
                    [roleId, employeeId],
                    (err, res) => {
                      if (err) throw err;
                      console.log("employee role updated");
                      promptMenu();
                    }
                  );
                }
              );
            });
        }
      );
    });
};

promptMenu();