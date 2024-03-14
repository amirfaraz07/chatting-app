const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = 4500 || process.env.PORT;

const users = [{}];

app.use(cors());
app.get("/", (req, res) => {
    res.send("Hello it is working");
})

const server = http.createServer(app);

const io = socketIO(server);

// io is a complete circuit but sockets are different users
// 1st one is always event name like connection, Joined, Welcome
io.on("connection", (socket) => {

    console.log("New Connection");

// on means to receive data
    socket.on('Joined', ( {user} ) => {
        users[socket.id] = user;
        console.log(`${user} has joined the chat`);
        socket.broadcast.emit('userJoined', {user:"Admin", message:`${users[socket.id]} has joined`}) // broadast mean who joined except him message is went to all other users
        socket.emit('Welcome', {user:"Admin", message:`${ users[socket.id] }, Welcome to the chat`})
    })

    socket.on('message', ({message, id}) => {
        io.emit('sendMessage', { user: users[id], message, id })
    })

    socket.on('Disconnect', () => {
        socket.broadcast.emit('leave', {user:"Admin", message:`${users[socket.id]} has left the chat`})
        console.log(`User left`);
    })

})

server.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
})