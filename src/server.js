import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';

const server = http.createServer(async (req, resp) => {
    const { method, url } = req;

    await json(req, resp);

    const route = routes.find(route => {
        return route.method === method && route.path.test(url);
    });

    if (route) {
        const { groups } = url.match(route.path);

        req.params = { ...groups };

        return route.handler(req, resp);
    }

    return resp.writeHead(404).end('Not Found')
})

server.listen(3333)