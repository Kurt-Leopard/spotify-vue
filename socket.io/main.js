const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: "*"
    }
});

// MySQL connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'mysql',
    password: 'mysql1016!',
    database: 'chatDB'
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

app.get('/', (req, res) => {
    res.sendFile(__dirname, '/index.html');
});

// Handle GET request to fetch messages
app.get('/messages', (req, res) => {
    // Retrieve messages from the database
    pool.query('SELECT * FROM messages', (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            res.status(500).send('Error fetching messages');
            return;
        }
        res.json(results);
    });
});

// Handle POST request to save new message
app.post('/messages', (req, res) => {
    const message = req.body;
    // Respond with a success status
    res.status(200).send('Message saved successfully');
    
    // Broadcast the message to all connected clients
    io.emit('message', message);

    // Save the message to the database
    pool.query('INSERT INTO messages (username, text) VALUES (?, ?)', [message.username, message.text], (err, result) => {
        if (err) {
            console.error('Error saving message:', err);
            return;
        }
        console.log('Message saved to the database');
    });
});

// Handle incoming messages
io.on('connection', (socket) => {
    socket.on('message', (message) => {
        // Broadcast the message to all connected clients
        io.emit('message', message);
    });
});

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
