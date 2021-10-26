

// Returns a map of a given column to that entries id.
async function getTableMap(column, table, db) {
    let out = new Map();
    let [rows] = await db.query(`SELECT id, ${column} FROM ${table};`);
    for(row of rows) {
        out.set(row[column], row.id);
    }

    return out;
}

module.exports = {
    getTableMap
}