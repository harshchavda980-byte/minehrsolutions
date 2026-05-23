const jwt = require('jsonwebtoken');

let clients = [];

/**
 * Register a client for live Server-Sent Events (SSE)
 */
exports.addClient = (req, res) => {
    // Enable Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.push(res);
    // Keep connection alive with a 15-second heartbeat ping
    const heartbeat = setInterval(() => {
        try {
            res.write(': heartbeat\n\n');
            if (typeof res.flush === 'function') res.flush();
        } catch (e) {}
    }, 15000);

    req.on('close', () => {
        clearInterval(heartbeat);
        clients = clients.filter(c => c !== res);
    });
};

/**
 * Broadcast an activity notification to all connected clients
 */
exports.broadcast = (data) => {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach(client => {
        try {
            client.write(message);
            if (typeof client.flush === 'function') client.flush();
        } catch (err) {
            // Connection might already be closed
        }
    });
};
