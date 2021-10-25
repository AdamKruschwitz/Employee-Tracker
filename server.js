const inquirer = require('inquirer');
const mysql2 = require('mysql2/promise');
require('dotenv').config();

async function init() {
    const db = await mysql2.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: 'employees_db',
        password: process.env.DB_PASS
    });

    async function viewAllDepartments() {
        // console.log('viewing all departments');
        let response = await db.query('SELECT name FROM department');
        console.log(response);
        for(row of response[0])
            console.log(row.name);

        presentOptions();
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
        let response = await inquirer.prompt({
            type: "list",
            name: "selected",
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

        let promise;
        switch(response.selected) {
            case "View all departments":
                await viewAllDepartments();
                break;

            case "View all roles":
                await viewAllRoles();
                break;

            case "View all employees":
                await viewAllEmployees();
                break;

            case "Add department":
                await addDepartment();
                break;

            case "Add role":
                await addRole();
                break;

            case "Add employee":
                await addEmployee();
                break;

            case "Update role":
                await updateRole();
                break;
        }
    }
    
    presentOptions();
}

init();