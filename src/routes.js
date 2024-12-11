import { randomUUID } from 'node:crypto';
import { Database } from './database.js';

import { buildRoutePath } from './utils/buildRoutePah.js'

const database = new Database();

export const routes = [
    {
        "method": "GET",
        "path": buildRoutePath("/task"),
        "handler": (req, resp) => {
            const tasks = database.select('tasks');

            return resp.writeHead(200).end(JSON.stringify(tasks));
        }
    },
    {
        "method": "POST",
        "path": buildRoutePath("/task"),
        "handler": (req, resp) => {
            const { body } = req;

            const { title, description } = body;

            if (!title || !description) {
                let message = 'propertie ';

                switch (true) {
                    case !title && !description:
                        message += 'title and description';
                        break;

                    case !title:
                        message += 'title';
                        break;
                    
                        case !description:
                        message += 'description';
                        break;
                };

                message += ' is missing';

                return resp.writeHead(400).end(message);
            };

            const task = {
                id: randomUUID(),
                ...body,
                "completed_at": "",
                "created_at": new Date().toISOString(),
                "updated_at": ""
            };

            database.insert('tasks', task);

            return resp.writeHead(201).end();
        }
    },
    {
        "method": "PUT",
        "path": buildRoutePath("/task/:id"),
        "handler": (req, resp) => {
            const { body, params } = req;

            const { title, description } = body;
            const { id } = params;

            if (!title || !description) {
                let message = 'propertie ';

                switch (true) {
                    case !title && !description:
                        message += 'title and description';
                        break;

                    case !title:
                        message += 'title';
                        break;
                    
                        case !description:
                        message += 'description';
                        break;
                };

                message += ' is missing';

                return resp.writeHead(400).end(message);
            };

            const successfullAction = database.update('tasks', id, {
                title,
                description,
                updated_at: new Date().toISOString()
            });

            if (successfullAction > -1) {
                return resp.writeHead(204).end();
            };

            return resp.writeHead(404).end('User not found');
        }
    },
    {
        "method": "DELETE",
        "path": buildRoutePath("/task/:id"),
        "handler": (req, resp) => {
            const { params } = req;

            const { id } = params;

            const successfullAction = database.delete('tasks', id);

            if (successfullAction > -1) {
                return resp.writeHead(204).end();
            };

            return resp.writeHead(404).end('User not found');
        }
    },
    {
        "method": "PATCH",
        "path": buildRoutePath("/task/:id"),
        "handler": (req, resp) => {
            const { params, body } = req;

            const { completed } = body;
            const { id } = params;

            if (completed !== true) {
                return resp.writeHead(400).end('wrong propertie completed');
            }

            const successfullAction = database.patch('tasks', id, {
                completed
            });

            switch (successfullAction) {
                case -1:
                    return resp.writeHead(404).end('user not found');
                
                case "propertie already was completed":
                    return resp.writeHead(400).end(successfullAction);
                
                default:
                    return resp.writeHead(204).end();
            };
        }
    }
]