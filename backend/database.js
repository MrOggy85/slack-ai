const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS channels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            channel_id TEXT NOT NULL UNIQUE,
            color TEXT NOT NULL,
            hidden INTEGER NOT NULL DEFAULT 0,
            active INTEGER NOT NULL DEFAULT 0
        )`, (err) => {
            if (err) {
                // Table already created or other error
                console.error("Error creating channels table:", err.message);
            } else {
                // Table just created, or it already existed.
                console.log("Channels table is ready.");
            }
        });
    }
});

function getAllChannels() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM channels";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

function createChannel(channel) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO channels (channel_id, color, hidden, active) VALUES (?,?,?,?)";
        const params = [channel.channel_id, channel.color, channel.hidden, channel.active];
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            }
            resolve({ id: this.lastID, ...channel });
        });
    });
}

function updateChannelActive(channelId, isActive) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE channels SET active = ? WHERE channel_id = ?";
        db.run(sql, [isActive, channelId], function(err) {
            if (err) {
                reject(err);
            }
            resolve({ changes: this.changes });
        });
    });
}

function updateChannelHidden(channelId, isHidden) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE channels SET hidden = ? WHERE channel_id = ?";
        db.run(sql, [isHidden, channelId], function(err) {
            if (err) {
                reject(err);
            }
            resolve({ changes: this.changes });
        });
    });
}

module.exports = { db, getAllChannels, createChannel, updateChannelActive, updateChannelHidden };
