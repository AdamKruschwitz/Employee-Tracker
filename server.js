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
        let [rows] = await db.query('SELECT name FROM department');
        for(row of rows)
            console.log(row.name);
        return;
    }

    async function viewAllRoles() {
        let [rows] = await db.query('SELECT title, salary FROM role');
        // console.log(response);
        console.log('Title, Salary');
        for(row of rows)
            console.log(`${row.title}, ${row.salary}`);
        return;
    }

    async function viewAllEmployees() {
        let [rows] = await db.query(
            `SELECT e.first_name, e.last_name, r.title 
            FROM employee AS e 
            JOIN role AS r 
            ON e.role_id=r.id`);
        
        console.log('Name, Title');
        for(row of rows) 
            console.log(`${row.first_name} ${row.last_name}, ${row.title}`);
        return;
    }

    async function addDepartment() {
        let {name} = await inquirer.prompt({
            name: "name",
            message: "Input the new department's name."
        });

        if(!name) {
            console.log('Please enter a department name: ');
            await addDepartment(); // Awaiting and returning to avoid duplicate queries without an else statement.
            return;
        }
        
        await db.query('INSERT INTO department (name) VALUES (?)', [name]);
        console.log(`Department ${name} added.`);
        return;
    }

    async function addRole() {
        let {title, salary} = await inquirer.prompt([
            {
                name: "title",
                message: "Please ender the new role's title: "
            },
            {
                name: "salary",
                message: "Please enter the new role's salary: "
            }
        ]);
        if(!title || !salary) {
            console.log("You must enter a title and a salary");
            await addRole();
            return;
        }

        await db.query('INSERT INTO role (title, salary) VALUES (?, ?)', [title, salary]);
        console.log(`Role ${title} with salary ${salary} added.`);
        return;
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
        presentOptions();
    }
    
    presentOptions();
}

init();