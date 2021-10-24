const inquirer = require('inquirer');
const mysql2 = require('mysql2/promise');

async function init() {
    const db = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'employees_db'
    });

    async function viewAllDepartments() {
        // TODO
    }

    async function viewAllRoles() {
        // TODO
    }

    async function viewAllEmployees() {
        // TODO
    }

    async function addDepartment() {
        // TODO
    }

    async function addRole() {
        // TODO
    }

    async function addEmployee() {
        // TODO
    }

    async function updateRole() {
        // TODO
    }

    async function presentOptions() {
        let choice = await inquirer.prompt({
            type: "list",
            name: "option",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add department",
                "Add role",
                "Add employee",
                "Update role"
            ],
            message: "Choose an option: "
        });

        switch(choice) {
            case "View all departments":
                viewAllDepartments();
                break;

            case "View all roles":
                viewAllRoles();
                break;

            case "View all employees":
                viewAllEmployees();
                break;

            case "Add department":
                addDepartment();
                break;

            case "Add role":
                addRole();
                break;

            case "Add employee":
                addEmployee();
                break;

            case "Update role":
                updateRole();
                break;
        }
    }
    
}