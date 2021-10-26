
const {getTableMap} = require('./utils');
const inquirer = require('inquirer');

// View all roles
async function viewAll(db) {
    let [rows] = await db.query('SELECT * FROM role;');
    // console.log(response);
    console.log('Title, Salary, department');
    const [departments] = await db.query('SELECT * FROM department;');
    const idToName = new Map();
    for(department of departments) {
        idToName.set(department.id, department.name);
    }

    
    for(row of rows) {
        let department = idToName.get(row.department_id)
        console.log(`${row.title}, ${row.salary}, ${department}`);
    }
    return;
}

// Prompts the user to add a new role
async function add(db) {
    const departmentsMap = await getTableMap('name', 'department', db);
    const departments = Array.from(departmentsMap.keys());
    let {title, salary, department} = await inquirer.prompt([
        {
            name: "title",
            message: "Please ender the new role's title: "
        },
        {
            name: "salary",
            message: "Please enter the new role's salary: "
        },
        {
            name: "department",
            type: "list",
            message: "Please choose a department for this role to be in.",
            choices: departments
        }
    ]);
    if(!title || !salary) {
        console.log("You must enter a title and a salary");
        await add();
        return;
    }
    const department_id = departmentsMap.get(department);
    await db.query(
        'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', 
        [title, salary, department_id]);
    console.log(`Role ${title} with salary ${salary} added.`);
    return;
}

// Prompts the user to update a role.
async function update(db) {
    let rolesMap = await getTableMap('title', 'role', db);
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
    // console.log([title, salary, role_id]);
    if(!title || !salary) { 
        console.log("Must include a title and a salary");
        await update(db);
        return;
    }

    await db.query('UPDATE role SET title=?, salary=? WHERE id=?', [title, parseInt(salary), role_id]);
    return;
}

async function remove(db) {
    console.log('Removing role');
    let rolesMap = await getTableMap('title', 'role', db);
    let roles = Array.from(rolesMap.keys());
    let {role_name} = await inquirer.prompt({
        name: "role_name",
        type: "list",
        message: "Select a role to delete: ",
        choices: roles
    });
    let role_id = rolesMap.get(role_name);
    let [employees] = await db.query('SELECT first_name, last_name FROM employee WHERE role_id=?', [role_id]);
    let employees_list = "";
    for(employee of employees)
        employees_list += employee.first_name + " " + employee.last_name + "\n";

    let {confirmed} = await inquirer.prompt({
        name: "confirmed",
        type: "confirm",
        message: `Are you sure you'd like to delete role ${role_name}? The following users will be deleted: \n${employees_list}` 
    });

    if(confirmed) {
        await db.query('DELETE FROM role WHERE id=?', [role_id]);
        console.log(`Role ${role_name} deleted successfully.`);
    }

    return;
}

module.exports = {
    viewAll,
    add,
    update,
    remove
}