const {getTableMap} = require('./utils');

// Views all employees
async function viewAll(db) {
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

// Prompts a user to add a new employee
async function add(db) {
    let rolesMap = await getTableMap('title', 'role', db);
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
        await add(db);
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

async function update(db) {
    // TODO
}

async function remove(db) {
    // TODO
}

async function viewByManager(db) {
    // TODO
}

async function viewByDepartment(db) {
    // TODO
}

module.exports = {
    viewAll,
    add,
    update,
    viewByManager,
    viewByDepartment,
    remove
}