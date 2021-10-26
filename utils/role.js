
const {getTableMap} = require('./utils');

// View all roles
async function viewAll(db) {
    let [rows] = await db.query('SELECT title, salary FROM role;');
    // console.log(response);
    console.log('Title, Salary');
    for(row of rows)
        console.log(`${row.title}, ${row.salary}`);
    return;
}

// Prompts the user to add a new role
async function add(db) {
    // TODO: get department ID.
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
        await add();
        return;
    }

    await db.query(
        'INSERT INTO role (title, salary) VALUES (?, ?);', 
        [title, salary]);
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
    console.log([title, salary, role_id]);
    if(!title || !salary) { 
        console.log("Must include a title and a salary");
        await update(db);
        return;
    }

    await db.query('UPDATE role SET title=?, salary=? WHERE id=?', [title, parseInt(salary), role_id]);
    return;
}

async function remove(db) {
    // TODO
}

module.exports = {
    viewAll,
    add,
    update,
    remove
}