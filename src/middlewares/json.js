export async function json(req, resp) {
    const buffers = [];

    for await (const chuck of req) {
        buffers.push(chuck);
    };

    const fullReqContent = Buffer.concat(buffers).toString();

    try {
        req.body = JSON.parse(fullReqContent);
    } catch {
        req.body = null;
    }
    
    resp.setHeader('Content-Type', 'application/json');
} 