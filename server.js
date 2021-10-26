require('dotenv').config();
const inquirer = require('inquirer');
const db = require('./utils/connection');
const department = require('./utils/department');
const role = require('./utils/role');
const employee = require('./utils/employee');


async function presentOptions() {
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
            "Update employee",
            "View employees by manager",
            "View employees by department",
            "Delete department",
            "Delete role",
            "Delete employee",
            "View department budget"
        ],
        message: "Choose an option: "
    });

    switch(response.selected) {
        case "View all departments":
            await department.viewAll();
            break;

        case "View all roles":
            await role.viewAll();
            break;

        case "View all employees":
            await employee.viewAll();
            break;

        case "Add department":
            await department.add();
            break;

        case "Add role":
            await role.add();
            break;

        case "Add employee":
            await employee.add();
            break;

        case "Update role":
            await role.update();
            break;

        case "Update employee":
            await employee.update();
            break;

        case "View employees by manager":
            await employee.viewByManager();
            break;

        case "View employees by department":
            await employee.viewByDepartment();
            break;

        case "Delete department":
            await department.remove();
            break;

        case "Delete role":
            await role.remove();
            break;

        case "Delete employee":
            await employee.remove();
            break;

        case "View department budget":
            await department.viewBudget();
    }

    presentOptions();
}

presentOptions();
