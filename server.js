// calling inquire/ mysql2/ console.table
const dataTable = require("console.table")
const mysql = require('mysql2');
const inquirer = require('inquirer');
//const db = require('./db');
// db connection
const dbconnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jenny@1060!',
    database: 'company_db',
    //port: 3306
})
dbconnection.connect(function (err) {
    if (err) throw err;
    console.log(`Connected to the  database.`)
    callDepts()
    callRoles()
    callManagers()
    callEmployees()
    startMenu()
})

// start menu questions
const interfaceQuestion = [{
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: ["View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit"]
}]

const addDepartmentQuestion = [{
    type: "input",
    message: "what is the name of this new department?",
    name: "DeptName"
}]
let deptArray = []
function callDepts() {
    dbconnection.query('SELECT * FROM departments;', function (err, data) {
        for (let i = 0; i < data.length; i++) {
            let objects = data[i];
            deptArray.push(objects.department_name)
        }
    })
}
// role questions
let addRoleQuestions = [{
    type: 'input',
    message: "what is the name of this new role?",
    name: "RoleName"
}, {
    type: "input",
    message: "what is the salary of the new role?",
    name: "RoleSalary"
}, {
    type: "list",
    message: "what department is this role in?",
    name: "RoleDept",
    choices: deptArray
}]

let rolesArray = []
function callRoles() {
    dbconnection.query('SELECT * FROM roles', function (err, data) {
        for (let i = 0; i < data.length; i++) {
            let objects = data[i];
            rolesArray.push(objects.title)
        }
    })
}

let managerArray = []
function callManagers() {
    dbconnection.query("SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS fullName FROM employees WHERE manager_id IS NULL;",
        function (err, data) {
            for (let i = 0; i < data.length; i++) {
                let objects = data[i];
                managerArray.push(objects.fullName)
            }
        })
}
// questions for adding a new employee
let addEmployeeQuestions = [{
    type: "input",
    message: "what is the new employee's first name?",
    name: "firstName"
}, {
    type: "input",
    message: "what is the new employee's last name?",
    name: "lastName"
}, {
    type: "list",
    message: "what is their role?",
    name: "empRole",
    choices: rolesArray
}, {
    type: 'list',
    message: "who is their manager?",
    name: "empManager",
    choices: managerArray
}]

let employeeArray = []
function callEmployees() {
    dbconnection.query("SELECT employees.first_name AS name FROM employees;", function (err, data) {
        if (err) throw err;
        for (let i = 0; i < data.length; i++) {
            let empObjects = data[i];
            employeeArray.push(empObjects.Name)
        }
    })
}
// questions to update an exsiting employee
let updateEmployeeQuestions = [{
    type: "list",
    message: "which employee are you updating?",
    name: "Updatee",
    choices: employeeArray
}, {
    type: "list",
    message: "What is their new role?",
    name: "newRole",
    choices: rolesArray
}]
// starmenu function 
function startMenu() {
    inquirer.prompt(interfaceQuestion)
        .then(function (response) {
            switch (response.choice) {
                case "View Employees":
                    viewAllEmp()
                    break;
                case "Add Employee":
                    addEmp()
                    break;
                case "Update employee role":
                    updateEmpRole()
                    break;
                case "View all roles":
                    viewAllRoles()
                    break;
                case "Add role":
                    addRole()
                    break;
                case "View all departments":
                    viewAllDepartments()
                    break;
                case "Add department":
                    addDepartment()
                    break;
                default:
                    db.end()
                //process.exit(0)
            }
        })
}
// function to view all employees in a console table. 
function viewAllEmp() {
    dbconnection.query("SELECT employees.first_name AS Fname, employees.last_name AS Lname, roles.title AS role, employees.id, CONCAT(manager.first_name, ' ', manager.last_Name) AS manager From employees LEFT JOIN employees manager ON manager.id = employees.manager_id JOIN roles on roles.id = employees.roles_id;", function (err, data) {
            if (err)throw err
            console.table(data)
            startMenu() 
        })
};
// function to view all roles in a console table. 
function viewAllRoles() {
    dbconnection.query("SELECT departments.department_name, roles.title, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id;", function (err, data) {
        if (err)throw err
        console.table(data)
        startMenu()
    })
};
// function to view all departments
function viewAllDepartments() {
    dbconnection.query("SELECT * FROM departments;", function (err, data) {
        if (err)throw err
        console.table(data)
        startMenu()
    })
};
// function to add a department 
function addDepartment() {
    inquirer.prompt(addDepartmentQuestion)
        .then(function (response) {
            dbconnection.query("INSERT INTO departments (department_name) VALUES (?);",
                response.DeptName,
                function (err, data) {
                    if (err)throw err
                    startMenu()
                })
        })
};

function addRole() {
    callDepts()
    inquirer.prompt(addRoleQuestions)
        .then(function (response) {
            let deptID = deptArray.indexOf(response.RoleDept) + 1;
            dbconnection.query("INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);",
                [response.RoleName,
                response.RoleSalary,
                    deptID],
                function (err, data) {
                    if (err)throw err
                    startMenu()
                })
        })
}
// function to add an employee 
// function addEmp() {
//     callRoles()
//     callManagers()
//     inquirer.prompt(addEmployeeQuestions)
//         .then(function (response) {
//             let roleID = rolesArray.indexOf(response.empRole) + 1;
//             let managerID = managerArray.indexOf(response.empManager) + 1;
//             dbconnection.query("INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?);",
//                 [response.firstName,
//                 response.lastName,
//                     roleID,
//                     managerID],
//                 function (err, data) {
//                     if (err)throw err
//                     startMenu()
//                 })
//         })
// }
// function to update an employee role. 
function updateEmpRole() {
    callRoles()
    callEmployees()
    inquirer.prompt(updateEmployeeQuestions)
        .then(function (response) {
            console.log(response.newRole)
            console.log(response.Updatee)
            let roleID = rolesArray.indexOf(response.newRole) + 1;
            console.log(roleID)
            dbconnection.query(`UPDATE employees SET roles_id = ${roleID} WHERE employees.first_name = "${response.Updatee}"`,
                function (err, data) {
                    if (err)throw err
                    startMenu()
                })
        })
}
