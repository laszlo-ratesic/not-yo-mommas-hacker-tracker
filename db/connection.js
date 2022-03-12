const mysql = require('mysql2');
const gradient = require('gradient-string');

// Connect to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'hackers_db'
    },
    console.clear(),
    console.log(
        gradient('silver', 'silver', 'red', 'red', 'gold')(`
        ██▀███  ▓█████ ▄▄▄    ██▒   █▓▓█████  ██▀███      ▄████▄   ███▄ ▄███▓  ██████
        ▓██ ▒ ██▒▓█   ▀▒████▄ ▓██░   █▒▓█   ▀ ▓██ ▒ ██▒   ▒██▀ ▀█  ▓██▒▀█▀ ██▒▒██    ▒
        ▓██ ░▄█ ▒▒███  ▒██  ▀█▄▓██  █▒░▒███   ▓██ ░▄█ ▒   ▒▓█    ▄ ▓██    ▓██░░ ▓██▄
        ▒██▀▀█▄  ▒▓█  ▄░██▄▄▄▄██▒██ █░░▒▓█  ▄ ▒██▀▀█▄     ▒▓▓▄ ▄██▒▒██    ▒██   ▒   ██▒
        ░██▓ ▒██▒░▒████▒▓█   ▓██▒▒▀█░  ░▒████▒░██▓ ▒██▒   ▒ ▓███▀ ░▒██▒   ░██▒▒██████▒▒
        ░ ▒▓ ░▒▓░░░ ▒░ ░▒▒   ▓▒█░░ ▐░  ░░ ▒░ ░░ ▒▓ ░▒▓░   ░ ░▒ ▒  ░░ ▒░   ░  ░▒ ▒▓▒ ▒ ░
          ░▒ ░ ▒░ ░ ░  ░ ▒   ▒▒ ░░ ░░   ░ ░  ░  ░▒ ░ ▒░     ░  ▒   ░  ░      ░░ ░▒  ░ ░
          ░░   ░    ░    ░   ▒     ░░     ░     ░░   ░    ░        ░      ░   ░  ░  ░
           ░        ░  ░     ░  ░   ░     ░  ░   ░        ░ ░             ░         ░
                                   ░                      ░
        Connected to hacker_db.`)
    )
);

module.exports = db;