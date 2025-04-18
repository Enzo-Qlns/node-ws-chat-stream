const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Creates and configures the HTTP server
 * @description The HTTP server serves the chat interface (index.html) and handles WebSocket upgrades
 */
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('WebSocket server is running');
    }
});

/**
 * WebSocket server instance
 * @type {WebSocket.Server}
 * @description Handles WebSocket connections and message broadcasting
 */
const wss = new WebSocket.Server({ server });

/**
 * Set of connected WebSocket clients
 * @type {Set<WebSocket>}
 */
const clients = new Set();

/**
 * Watches for changes in the index.html file and notifies clients to reload
 * @description When the HTML file is modified, all connected clients are notified to reload their page
 */
fs.watch('index.html', (eventType, filename) => {
    if (eventType === 'change') {
        broadcast(JSON.stringify({
            type: 'reload',
            message: 'Page needs reload'
        }));
    }
});

/**
 * Handles new WebSocket connections
 * @param {WebSocket} ws - The WebSocket connection instance
 * @description Sets up event listeners for new connections, including:
 * - Welcome message
 * - Message handling
 * - Disconnection handling
 */
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    // Send welcome message to the new client
    ws.send(JSON.stringify({
        type: 'system',
        message: 'Welcome to the chat!'
    }));

    // Handle incoming messages
    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        try {
            const data = JSON.parse(message.toString());
            // Broadcast the message to all clients
            broadcast(JSON.stringify({
                type: 'message',
                username: data.username,
                message: data.message
            }));
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
        // Broadcast to all clients when someone leaves
        broadcast(JSON.stringify({
            type: 'system',
            message: 'A user has left the chat'
        }));
    });
});

/**
 * Broadcasts a message to all connected clients
 * @param {string} message - The message to broadcast
 * @description Sends the message to all connected WebSocket clients
 */
function broadcast(message) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 