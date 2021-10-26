const inquirer = require('inquirer');
const { getTableMap } = require('./utils');



async function viewAll(db) {
    // console.log('viewing all departments');
    // console.log(db);
    let [rows] = await db.query('SELECT name FROM department;');
    for(row of rows)
        console.log(row.name);
    return;
}

async function add(db) {
    let {name} = await inquirer.prompt({
        name: "name",
        message: "Input the new department's name."
    });

    if(!name) {
        console.log('Please enter a department name: ');
        await add(db); // Awaiting and returning to avoid duplicate queries without an else statement.
        return;
    }
    
    await db.query('INSERT INTO department (name) VALUES (?);', [name]);
    console.log(`Department ${name} added.`);
    return;
}

// Prompt the user to remove a department
async function remove(db) {
    console.log('Removing department');
    let departmentsMap = await getTableMap('name', 'department', db);
    let departments = Array.from(departmentsMap.keys());
    let {department_name} = await inquirer.prompt({
        name: "department_name",
        type: "list",
        message: "Select a department to delete: ",
        choices: departments
    });

    let {confirmed} = await inquirer.prompt({
        name: "confirmed",
        type: "confirm",
        message: `Are you sure you'd like to delete department ${department_name} and all included roles and employees?`
    });

    if(confirmed) {
        let department_id = departmentsMap.get(department_name);
        await db.query('DELETE FROM department WHERE id=?;', [department_id]);
        // await db.query('DELETE FROM role WHERE department_id=?;', [department_id]);
        console.log('department deleted successfully')
    }

    return;
}

async function viewBudget(db) {
    const departmentMap = await getTableMap('name', 'department', db);
    const departments = Array.from(departmentMap.keys());
    const {department_name} = await inquirer.prompt({
        name: "department_name",
        type:"list",
        message: "Choose a department to see the total budget",
        choices: departments
    });

    let department_id = departmentMap.get(department_name);
    const [[{sum}]] = await db.query('SELECT SUM(salary) AS sum FROM employee JOIN role ON employee.role_id=role.id WHERE role.department_id=?;', [department_id]);
    
    console.log(`The budget for ${department_name} is $${sum}`);
    return;
}

module.exports = {
    viewAll,
    add,
    remove,
    viewBudget
};