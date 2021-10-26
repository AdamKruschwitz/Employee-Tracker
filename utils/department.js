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
        message: `Are you sure you'd like to delete department ${department_name} and all included roles?`
    });

    if(confirmed) {
        let department_id = departmentsMap.get(department_name);
        await db.query('DELETE FROM department WHERE id=?', [department_id]);
        await db.query('DELETE FROM role WHERE department_id=?', [department_id]);
    }

    return;
}

async function viewBudget(db) {
    // TODO
}

module.exports = {
    viewAll,
    add,
    remove,
    viewBudget
};