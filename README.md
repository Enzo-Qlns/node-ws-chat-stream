# Node.js WebSocket Chat Application

A real-time chat application built with Node.js and WebSocket, featuring file transformation capabilities.

## Features

- Real-time chat with WebSocket
- Hot reload for development
- File transformation using Node.js Streams
- Modern and responsive UI
- User name customization
- System notifications for user join/leave

## Prerequisites

- Node.js (v14 or higher)
- pnpm (v10.7.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Enzo-Qlns/node-ws-chat-stream.git
cd node-ws-chat-stream
```

2. Install dependencies:
```bash
pnpm install
```

## Usage

### Starting the Chat Server

Development mode (with hot reload):
```bash
pnpm run dev
```

Production mode:
```bash
pnpm start
```

The server will start on port 3000. Access the chat interface at `http://localhost:3000`.

### File Transformation

To transform a text file to uppercase:
```bash
pnpm run stream
```

This will:
1. Read the `input.txt` file
2. Transform all text to uppercase
3. Save the result to `output.txt`

## Project Structure

```
node-ws-chat/
├── server.js         # WebSocket server implementation
├── index.html        # Chat interface
├── stream.js         # File transformation script
├── package.json      # Project configuration
└── nodemon.json      # Development server configuration
```

## API Documentation

### WebSocket Server

The server implements the following message types:

- `system`: System notifications (welcome, user join/leave)
- `message`: Chat messages
- `reload`: Hot reload notifications

Message format:
```javascript
{
    type: 'message' | 'system' | 'reload',
    username?: string,  // For message type
    message: string
}
```

### File Transformation

The `stream.js` script provides a file transformation pipeline using Node.js Streams:

1. Reads the source file in chunks
2. Transforms each chunk to uppercase
3. Writes the result to the destination file

## Development

The project uses:
- `nodemon` for development with hot reload
- `ws` for WebSocket implementation
- Native Node.js `fs` and `stream` modules