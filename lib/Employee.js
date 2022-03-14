const db = require('../db/connection');

class Employee {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    async getEmployees() {
        const [rows, fields] = await db
            .promise()
            .query(`SELECT * FROM employees`);
        return rows;
    }
}

module.exports = Employee;