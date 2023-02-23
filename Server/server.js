const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const database = require(__dirname + '/../Database/database.js');
const port = 3000;

// Create a new instance of the database class
const db = new database();

app.use(express.static(path.join(__dirname, '/../Client'))); // Serve the client folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../Client/index.html')); // Send the index.html file to the client
});

io.on('connection', (socket) => {
    console.log('User : ' + socket.id + ' connected');

    socket.on('disconnect', () => {
        console.log('User : ' + socket.id + ' disconnected'); 
    });

    if (io.sockets.connected)
    {
        socket.emit("connections", Object.keys(io.sockets.connected).length); // Send the number of connections to the client
    } 
    else {
        socket.emit("connections", 0); 
    }

    socket.on('message', async (msg) => {
        console.log("MSG : " + msg.name + " : " + msg.message);
        const data = {
            message: msg.message,
            userId: socket.id,
            name: msg.user,
        }
        await db.StoreUserMessage(data); // Store the message in the database
        socket.broadcast.emit('message', msg); // Send the message to all the clients except the sender

    });

    socket.on("Typing", (data) => {
        socket.broadcast.emit("Typing", data); // Send the typing event to all the clients except the sender
    });

    socket.on("StopTyping", (data) => {
        socket.broadcast.emit("StopTyping", data); // Send the stop typing event to all the clients except the sender
    });

    socket.on("Joined", async (name) => {
        let messageData = null;
        const Data = {
            name,
            userId: socket.id,
        }
        const user = await db.AddUser(data); // Add the user to the database
        if (user) {
            messageData = await db.FetchUsersMessage(Data); // Fetch the user's messages from the database
        }
        socket.broadcast.emit("Joined", messageData); // Send the user's messages to all the clients except the sender
    });

    socket.on("Left", (data) => {
        socket.broadcast.emit("Left", data); 
    });
});

http.listen(port, () => { // Start the server
    console.log('listening on *:' + port);
});