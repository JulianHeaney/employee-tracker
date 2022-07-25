const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const db = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "Test1!",
   database: "human_resources",
},
   console.log('Connected to HR database.')
);

db.connect(function (err) {
   if (err) throw err;
   hr_menu();
});

// HUMAN RESOURCES MENU PROMPT
function hr_menu() {
   inquirer.prompt({
      name: "select",
      type: "list",
      message: "What would you like to do?",
      choices: [
         "View All Employees",
         "Add Employee",
         "Update Employee Role",
         "View All Roles",
         "Add Role",
         "View All Departments",
         "Add Department",
         "QUIT"
      ],
   })
      .then(function (response) {
         switch (response.select) {
            case "View All Employees":
               allEmployees();
               break;
            case "Add Employee":
               addEmployee();
               break;
            case "Update Employee Role":
               updateRole();
               break;
            case "View All Roles":
               allRoles();
               break;
            case "Add Role":
               addRole();
               break;
            case "View All Departments":
               allDepartments();
               break;
            case "Add Department":
               addDepartment();
               break;
            case "QUIT":
               hrQuit();
               break;
            default:
               break;
         }
      });
}

// VIEW ALL EMPLOYEES
function allEmployees() {
   console.log('VIEW ALL EMPLOYEES');
   const query = `
   SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, e.manager_id 
   FROM employee e 
   LEFT JOIN role r ON e.role_id = r.id 
   LEFT JOIN department d ON r.department_id = d.id`;
   db.query(query, function (err, rows) {
      if (err) throw err;
      console.table(rows);
      hr_menu();
   });
}

// ADD EMPLOYEE
function addEmployee() {
   console.log('ADD AN EMPLOYEE');
   db.query("SELECT * FROM role", function (err, rows) {
      if (err) throw err;
      inquirer.prompt([
         {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
         },
         {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
         },
         {
            name: "manager_id",
            type: "input",
            message: "What is the employee's manager ID?",
         },
         {
            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: function() {
               let roleChoices = [];
               for (let i = 0; i < rows.length; i++) {
                  roleChoices.push(rows[i].title);
               }
               return roleChoices;
            }
         }
      ])
      .then(function (response) {
         let role_id;
         for (let n = 0; n < rows.length; n++) {
            if (rows[n].title == response.role) {
               role_id = rows[n].id;
            }
         }
         db.query("INSERT INTO employee SET ?", {
            first_name: response.first_name,
            last_name: response.last_name,
            manager_id: response.manager_id,
            role_id: role_id
         });
         const query = `
         SELECT e.id, e.first_name, e.last_name, r.title AS title, r.salary 
         FROM employee e 
         LEFT JOIN role r ON e.role_id = r.id`;
         db.query(query, function (err, rows) {
            if (err) throw err;
            console.log("New employee added to table!");
            console.table(rows);
            hr_menu();
         })
      })
   })
}

// UPDATE EMPLOYEE ROLE
function updateRole() {
   console.log('UPDATE AN EMPLOYEE ROLE');
   db.query("SELECT * FROM employee", function (err, rows) {
      if (err) throw err;
      inquirer.prompt([
         {
            name: "employeeName",
            type: "list",
            message: "Which employee's role do you want to update?",
            choices: function() {
               let emplChoices = [];
               rows.forEach((rows) => {
                  emplChoices.push(rows.first_name + ' ' + rows.last_name);
               });
               return emplChoices;
            }
         }
      ])
      .then(function (response) {
         const employee = response.employeeName;

         db.query("SELECT * FROM role", function (err, rows) {
            inquirer.prompt([
               {
                  name: "role",
                  type: "list",
                  message: "Which role do you want to assign the selected employee?",
                  choices: function() {
                     let roleChoices = [];
                    rows.forEach((rows) => {
                     roleChoices.push(rows.title);
                    });
                     return roleChoices;
                  }
               }
            ])
            .then(function (response) {
               const newRole = response.role;

               db.query(`
               SELECT * FROM role
               WHERE title = ?`, [newRole],
               function (err, rows) {
                  if (err) throw err;
                  let roleId = rows[0].id;

                  let query = `
                  UPDATE employee SET role_id = ?
                  WHERE CONCAT(first_name, ' ', last_name) = ?`;
                  let values = [parseInt(roleId), employee];

                  db.query(query, values, function (err, rows, fields) {
                     console.log("Employee role updated!");
                  });
                  allEmployees();
               });
            });
         });
      });
   });
}

// VIEW ALL ROLES
function allRoles() {
   console.log('VIEW ALL ROLES');
   const query = `
   SELECT r.id, r.title, d.name AS department, r.salary 
   FROM role r 
   LEFT JOIN department d ON r.department_id = d.id`;
   db.query(query, function (err, rows) {
      if (err) throw err;
      console.table(rows);
      hr_menu();
   });
}

// ADD ROLE
function addRole() {
   console.log('ADD A ROLE');
   db.query("SELECT * FROM department", function (err, rows) {
      if (err) throw err;
      inquirer.prompt([
         {
            name: "roleName",
            type: "input",
            message: "What is the name of the role?"
         },
         {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?"
         },
         {
            name: "department",
            type: "list",
            choices: function () {
               const deptChoices = [];
               for (let i = 0; i < rows.length; i++) {
                  deptChoices.push(rows[i].name);
               }
               return deptChoices;
            }
         }
      ])
         .then(function (response) {
            let department_id;
            for (let n = 0; n < rows.length; n++) {
               if (rows[n].name == response.department) {
                  department_id = rows[n].id;
               }
            }
            db.query("INSERT INTO role SET ?", {
               title: response.roleName,
               salary: response.salary,
               department_id: department_id
            });
            const query = "SELECT * FROM role";
            db.query(query, function (err, rows) {
               if (err) throw err;
               console.log("New role added to table!");
               console.table(rows);
               hr_menu();
            });
         });
   });
}

// VIEW ALL DEPARTMENTS
function allDepartments() {
   console.log('VIEW ALL DEPARTMENTS');
   const query = "SELECT * FROM department";
   db.query(query, function (err, rows) {
      if (err) throw err;
      console.table(rows);
      hr_menu();
   });
}

// ADD DEPARTMENT
function addDepartment() {
   console.log('ADD A DEPARTMENT');
   inquirer.prompt([
      {
         name: "departmentName",
         type: "input",
         message: "What is the name of the department?"
      },
   ])
      .then(function (response) {
         //console.log(response);
         db.query("INSERT INTO department SET ?", {
            name: response.departmentName,
         });
         const query = "SELECT * FROM department";
         db.query(query, function (err, rows) {
            if (err) throw err;
            console.log("New department added to table!");
            console.table(rows);
            hr_menu();
         });
      });
}

// QUIT
function hrQuit() {
   console.log('GOODBYE');
   db.end();
}