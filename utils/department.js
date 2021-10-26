const db = require('./connection');

async function viewAll() {
    // console.log('viewing all departments');
    let [rows] = await db.query('SELECT name FROM department;');
    for(row of rows)
        console.log(row.name);
    return;
}

async function add() {
    let {name} = await inquirer.prompt({
        name: "name",
        message: "Input the new department's name."
    });

    if(!name) {
        console.log('Please enter a department name: ');
        await add(); // Awaiting and returning to avoid duplicate queries without an else statement.
        return;
    }
    
    await db.query('INSERT INTO department (name) VALUES (?);', [name]);
    console.log(`Department ${name} added.`);
    return;
}

async function remove() {
    // TODO
}

async function viewBudget() {

}

module.exports = {
    viewAll,
    add,
    remove,
    viewBudget
};