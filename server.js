require('dotenv').config();
const inquirer = require('inquirer');
const mysql2 = require('mysql2/promise');

const department = require('./utils/department');
const role = require('./utils/role');
const employee = require('./utils/employee');

// console.log(department, role, employee);
// console.log(connect);

const dbPromise = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: 'employees_db',
    password: process.env.DB_PASS
});

async function presentOptions(db) {
    let {response} = await inquirer.prompt({
        type: "list",
        name: "response",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add department",
            "Add role",
            "Add employee",
            "Update role",
            "Update employee manager",
            "View employees by manager",
            "View employees by department",
            "Delete department",
            "Delete role",
            "Delete employee",
            "View department budget"
        ],
        message: "Choose an option: "
    });

    switch(response) {
        case "View all departments":
            await department.viewAll(db);
            break;

        case "View all roles":
            await role.viewAll(db);
            break;

        case "View all employees":
            await employee.viewAll(db);
            break;

        case "Add department":
            await department.add(db);
            break;

        case "Add role":
            await role.add(db);
            break;

        case "Add employee":
            await employee.add(db);
            break;

        case "Update role":
            await role.update(db);
            break;

        case "Update employee manager":
            await employee.update(db);
            break;

        case "View employees by manager":
            await employee.viewByManager(db);
            break;

        case "View employees by department":
            await employee.viewByDepartment(db);
            break;

        case "Delete department":
            await department.remove(db);
            break;

        case "Delete role":
            await role.remove(db);
            break;

        case "Delete employee":
            await employee.remove(db);
            break;

        case "View department budget":
            await department.viewBudget(db);
    }

    presentOptions(db);
}



dbPromise.then(function(db) {
    presentOptions(db);
});

