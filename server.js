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

    // Returns a map of a given column to that entries id.
    async function getTableMap(column, table) {
        let out = new Map();
        let [rows] = await db.query(`SELECT id, ${column} FROM ${table};`);
        for(row of rows) {
            out.set(row[column], row.id);
        }

        return out;
    }

    async function viewAllDepartments() {
        // console.log('viewing all departments');
        let [rows] = await db.query('SELECT name FROM department;');
        for(row of rows)
            console.log(row.name);
        return;
    }

    async function viewAllRoles() {
        let [rows] = await db.query('SELECT title, salary FROM role;');
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
            ON e.role_id=r.id;`);
        
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
        
        await db.query('INSERT INTO department (name) VALUES (?);', [name]);
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

        await db.query(
            'INSERT INTO role (title, salary) VALUES (?, ?);', 
            [title, salary]);
        console.log(`Role ${title} with salary ${salary} added.`);
        return;
    }

    async function addEmployee() {
        let rolesMap = await getTableMap('title', 'role');
        let roles = Array.from(rolesMap.keys()); // .keys returns an iterable, inquirer choices wants an array

        [response] = await db.query('SELECT id, first_name, last_name FROM employee;');
        let employees = [];
        let employeesMap = new Map();
        for(row of response) {
            let fullName = `${row.first_name} ${row.last_name}`;
            employees.push(fullName);
            employeesMap.set(fullName, row.id);
        }

        let {first_name, last_name, role_name, manager_name} = await inquirer.prompt([
            {
                name: "first_name",
                message: "Please enter the new employee's first name: "
            },
            {
                name: "last_name",
                message: "Please enter the new employee's last name: "
            },
            {
                name: "role_name",
                type: "list",
                message: "Please choose a role for this employee: ",
                choices: roles
            },
            {
                name: "manager_name",
                type: "list",
                message: "Please choose a manager for this employee: ",
                choices: employees
            }
        ]);

        if(!first_name || !last_name) {
            console.log('Must include a first name and last name.');
            await addEmployee();
            return;
        }

        let role_id = rolesMap.get(role_name);
        let manager_id = employeesMap.get(manager_name);

        await db.query(
            `INSERT INTO employee 
            (first_name, last_name, role_id, manager_id) 
            VALUES (?, ?, ?, ?)`,
            [first_name, last_name, role_id, manager_id]);
        
        console.log(`New employee ${first_name} ${last_name} added.`);
        return;
    }

    async function updateRole() {
        let rolesMap = await getTableMap('title', 'role');
        let roles = Array.from(rolesMap.keys());

        let {role_name, title, salary} = await inquirer.prompt([
            {
                name: "role_name",
                type: "list",
                message: "Please choose a role to update: ",
                choices: roles
            },
            {
                name: "title",
                message: "Please enter the updated title: "
            },
            {
                name: "salary",
                message: "Please enter the updated salary: "
            }
        ]);

        let role_id = rolesMap.get(role_name);
        console.log([title, salary, role_id]);
        if(!title || !salary) { 
            console.log("Must include a title and a salary");
            await updateRole();
            return;
        }

        await db.query('UPDATE role SET title=?, salary=? WHERE id=?', [title, parseInt(salary), role_id]);
        return;
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