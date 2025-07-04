const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');

    hej();
});

function hej() {
    console.log('UPDATE channels...');
    const sql = "UPDATE channels SET hidden = 1";
    db.run(sql, (err) => {
        if (err) {
            return console.error(err.message);
        }
        closeDb()
    })
}

function closeDb() {
    console.log('db.close...');
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
    });

}
