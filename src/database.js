import fs from 'node:fs/promises';

const databasePath = new URL('../tasks.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then((data) => {
                this.#database = JSON.parse(data);
            })
            .catch(() => {
                this.#persist();
            })
    };

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    };

    select(table) {
        const data = this.#database[table] ?? [];

        return data;
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        };

        this.#persist();

        return data;
    }

    update(table, id, data) {
        const indexToUpdate = this.#database[table].findIndex(task => task.id === id);

        if (indexToUpdate > -1) {
            let previousData = this.#database[table][indexToUpdate];

            const updatedData = { ...previousData, ...data };

            this.#database[table][indexToUpdate] = updatedData;

            this.#persist();
        }

        return indexToUpdate;
    }

    delete(table, id) {
        const indexToUpdate = this.#database[table].findIndex(task => task.id === id);

        if (indexToUpdate > -1) {
            this.#database[table].splice(indexToUpdate, 1);

            this.#persist();
        };

        return indexToUpdate;
    }

    patch(table, id) {
        const indexToUpdate = this.#database[table].findIndex(task => task.id === id);

        if (indexToUpdate === -1) return indexToUpdate;

        if (this.#database[table][indexToUpdate].completed_at) return 'propertie already was completed';

        this.#database[table][indexToUpdate].completed_at = new Date().toISOString();

        this.#persist();
    }
}