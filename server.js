const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8765 });
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Broadcast to all clients
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

console.log('WebSocket server running on ws://localhost:8765');