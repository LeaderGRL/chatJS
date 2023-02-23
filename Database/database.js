const mysql = require('mysql2');
let db = null;

class database
{
    constructor()
    {
        // Create connection to database
        db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'chatJS'
        });
        db.connect(function(err) {
            if (err) throw err; // If error, throw error
            console.log("Connected!"); // If no error, log "Connected!"
        });
    }

    // Function to add a new user to the database
    AddUser(data) {
        return new Promise(async(resolve, reject) => { // Return a promise to handle the result of the function (success or error) 
            if (await this.IsUserExist(data)) { // If the user already exist, reject the promise and return an error
                reject("User already exist");
            } else {
                db.execute('INSERT INTO users (id, username, password) VALUES (?, ?, ?)', [0, data.name], (err, result) => {
                    if (err) reject(err);
                    resolve(result); // If no error, resolve the promise and return the result
                });
            }
        });
    }

    // Function to check if a user already exist in the database
    IsUserExist(data) {
        return new Promise((resolve, reject) => {
            db.execute('SELECT * FROM users WHERE username = ?', [data.username], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    FetchUsersMessage(data) {
        const messages = [];
        return new Promise((resolve, reject) => {
            db.execute('SELECT * FROM messages WHERE name = ?', [data.username], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Function to add a new message to the database
    StoreUserMessage(data) {
        return new Promise((resolve, reject) => {
            db.execute('INSERT INTO messages (messageId, userId, name, message) VALUES (?, ?, ?, ?)', [0, data.userId, data.name, data.message], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = database; // Export the class to be used in other files
