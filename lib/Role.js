const db = require('../db/connection');

class Role {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    async getRoles() {
        const [rows, fields] = await db
            .promise()
            .query(`SELECT * FROM roles`);
        return rows;
    }
}

module.exports = Role;