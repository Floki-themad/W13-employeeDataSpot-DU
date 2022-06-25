require("console.table")
const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jenny@1060!',
    database: 'company_db',
    //port: 3306
})
db.connect(function(err){
    if (err) throw err;
    console.log(`Connected to the company_db database.`)
    callDepts()
    callRoles()
    callManagers()
    callEmployees()
    startMenu()
})
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
function callDepts(){
    db.query('SELECT * FROM departments;', function(err, data){
        for(let i = 0; i < data.length; i++) {
            let objects = data[i];
            deptArray.push(objects.department_name)
        }
    })
}

let addRoleQuestions =[{
    type: 'input',
    message: "what is the name of this new role?",
    name: "RoleName"
},{
    type: "input",
    message: "what is the salary of the new role?",
    name: "RoleSalary"
},{
    type: "list",
    message: "what department is this role in?",
    name: "RoleDept",
    choices: deptArray
}]

let rolesArray = []
function callRoles(){
    db.query('SELECT * FROM roles', function(err, data){
        for(let i = 0; i< data.length; i++){
            let objects = data[i];
            rolesArray.push(objects.title)
        }
    })
}

let managerArray = []
function callManagers(){
    db.query("SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS fullName FROM employees WHERE manager_id IS NULL;", 
    function(err, data){
        for(let i = 0; i < data.length; i++){
            let objects = data[i];
            managerArray.push(objects.fullName)
        }
    })
}

let addEmployeeQuestions =[{
    type: "input",
    message: "what is the new employee's first name?",
    name: "firstName"
},{
    type: "input",
    message: "what is the new employee's last name?",
    name: "lastName"
},{
    type: "list",
    message: "what is their role?",
    name: "empRole",
    choices: rolesArray
},{
    type: 'list',
    message: "who is their manager?",
    name: "empManager",
    choices: managerArray
}]

let employeeArray = []
function callEmployees(){
    db.query("SELECT employees.first_name AS name FROM employees;", function(err, data){
        if(err)throw err;
        for(let i = 0; i < data.length; i++){
            let empObjects = data[i];
            employeeArray.push(empObjects.Name)
        }
    })
}

let updateEmployeeQuestions = [{
    type: "list",
    message: "which employee are you updating?",
    name: "Updatee",
    choices: employeeArray
},{
    type: "list",
    message: "What is their new role?",
    name: "newRole",
    choices: rolesArray
}]

function startMenu(){
    inquirer.prompt(interfaceQuestion)
    .then(function(response){
        switch(response.choice){
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

function viewAllEmp(){
    db.query("SELECT employees.first_name AS Fname, employees.last_name AS Lname, roles.title AS role, employees.id, CONCAT(manager.first_name, ' ', manager.last_Name) AS manager From employees LEFT JOIN employees manager ON manager.id = employees.manager_id JOIN roles on roles.id = employees.roles_id;", 
    function(err,data){
       if(err)throw err
       console.table(data)
       //startMenu() 
    })
};

function viewAllRoles(){
    db.query("SELECT departments.department_name, roles.title, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id;", function(err,data){
        if(err) throw err
        console.table(data)
        startMenu()
    })
};

function viewAllDepartments(){
    db.query("SELECT * FROM departments;", function(err,data){
        if(err) throw err
        console.table(data)
        startMenu()
    })
};

function addDepartment(){
    inquirer.prompt(addDepartmentQuestion)
    .then(function(response){
        db.query("INSERT INTO departments (department_name) VALUES (?);",
        response.DeptName,
        function(err,data){
            if(err) throw err
            startMenu()
        })
    })
};

function addRole(){
    callDepts()
    inquirer.prompt(addRoleQuestions)
    .then(function(response){
        let deptID = deptArray.indexOf(response.RoleDept) + 1;
        db.query("INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);",
        [response.RoleName,
        response.RoleSalary,
         deptID],
         function(err,data){
             if(err) throw err
             startMenu()
         })
    })
}

function addEmp(){
    callRoles()
    callManagers()
    inquirer.prompt(addEmployeeQuestions)
    .then(function(response){
        let roleID = rolesArray.indexOf(response.empRole) + 1;
        let managerID = managerArray.indexOf(response.empManager) + 1;
        db.query("INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?);",
        [response.firstName,
        response.lastName,
        roleID,
        managerID],
        function(err,data){
            if(err) throw err
            startMenu()
        })
    })
}

function updateEmpRole(){
    callRoles()
    callEmployees()
    inquirer.prompt(updateEmployeeQuestions)
    .then(function(response){
        console.log(response.newRole)
        console.log(response.Updatee)
        let roleID = rolesArray.indexOf(response.newRole) +1;
        console.log(roleID)
        db.query(`UPDATE employees SET roles_id = ${roleID} WHERE employees.first_name = "${response.Updatee}"`, 
        function(err,data){
            if(err) throw err
            startMenu()
        })
    })
}