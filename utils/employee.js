const inquirer = require('inquirer');
const {getTableMap} = require('./utils');

async function getEmployeesMap(db) {
    const [response] = await db.query('SELECT id, first_name, last_name FROM employee;');
    let employeesMap = new Map();
    for(row of response) {
        let fullName = `${row.first_name} ${row.last_name}`;
        employeesMap.set(fullName, row.id);
    }

    return employeesMap;
}

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

    const employeesMap = await getEmployeesMap(db);
    let employees = Array.from(employeesMap.keys());

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
    const employeesMap = await getEmployeesMap(db);
    const employees = Array.from(employeesMap.keys());

    const {employeeToEdit, newManager} = await inquirer.prompt([
        {
            name: "employeeToEdit",
            type: "list",
            message: "Choose an employee to edit",
            choices: employees
        },
        {
            name: "newManager",
            type: "list",
            message: "Choose a new manager for this employee",
            choices: employees
        }
    ]);
    let employee_id = employeesMap.get(employeeToEdit);
    let manager_id = employeesMap.get(newManager);
    await db.query('UPDATE employee SET manager_id=? WHERE id=?', [manager_id, employee_id]);
    console.log(`Employee ${employeeToEdit} updated with new manager ${newManager}`);
    return;
}

async function remove(db) {
    const employeesMap = await getEmployeesMap(db);
    const employees = Array.from(employeesMap.keys());

    let {employee} = await inquirer.prompt({
        name: "employee",
        type: "list",
        message: "Choose an employee to delete: ",
        choices: employees
    });

    let {confirm} = await inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: `Are you sure you want to delete ${employee}?`
    });

    if(confirm) {
        let employee_id = employeesMap.get(employee);
        db.query("DELETE FROM employee WHERE id=?", [employee_id]);
        console.log(`Employee ${employee} deleted successfully.`);
    }
    return;
}

async function viewByManager(db) {
    const employeesMap = await getEmployeesMap(db);
    const employees = Array.from(employeesMap.keys());

    const {manager} = await inquirer.prompt({
        name: "manager",
        type: "list",
        message: "Choose an employee to see who they manage: ",
        choices: employees
    });

    const manager_id = employeesMap.get(manager);
    const [managed_employees] = await db.query('SELECT first_name, last_name FROM employee WHERE manager_id=?', [manager_id]);
    let employees_list = "";
    for(managed_employee of managed_employees) {
        employees_list += "\n" + managed_employee.first_name + " " + managed_employee.last_name 
    }
    // If there are no managed employees
    if(!employees_list) employees_list = "nobody";

    console.log(`Employee ${manager} manages ${employees_list}`);
    return;
}

async function viewByDepartment(db) {
    const departmentsMap = await getTableMap('name', 'department', db);
    const departments = Array.from(departmentsMap.keys());

    const {department} = await inquirer.prompt({
        name: "department",
        type: "list",
        message: "Choose a department to filter employees by: ",
        choices: departments
    });

    const department_id = departmentsMap.get(department);
    const [employees] = await db.query('SELECT employee.first_name, employee.last_name FROM employee JOIN role ON employee.role_id=role.id WHERE department_id=?', [department_id]);
    console.log(`Employees of ${department}: `);
    for(employee of employees) {
        console.log(employee.first_name + " " + employee.last_name);
    }
    return;
}

module.exports = {
    viewAll,
    add,
    update,
    viewByManager,
    viewByDepartment,
    remove
}