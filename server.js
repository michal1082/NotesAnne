// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Array to store notes
let notes = [];

// Socket.io connection
io.on('connection', socket => {
    console.log('A user connected');

    // Send existing notes to the newly connected client
    socket.emit('existingNotes', notes);

    // Handle note addition
    socket.on('addNote', note => {
        notes.push(note);
        // Broadcast the new note to all connected clients
        io.emit('newNote', note);
    });

    // Handle note position update
    socket.on('updateNotePosition', updatedNote => {
        // Find the note in the notes array and update its position
        const index = notes.findIndex(note => note.id === updatedNote.id);
        if (index !== -1) {
            notes[index].x = updatedNote.x;
            notes[index].y = updatedNote.y;
        }
        // Broadcast the updated note position to all connected clients
        io.emit('updateNotePosition', updatedNote);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
