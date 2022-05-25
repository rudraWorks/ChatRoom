const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const { join } = require('path')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')
const {generateMessage} = require('./utils/generateMessage')

const app = express()
const port = process.env.PORT || 3000 

const server = http.createServer(app)
const io = socketio(server) 

app.use(express.json())
app.use(express.static(join(__dirname,'../public')))

io.set('transports', ['websocket']);
io.on('connection',(socket)=>{
    console.log('connected to '+socket.id)

    

    socket.on('join',({username,room},callback)=>{
        
        username=username.trim()
        room=room.trim()

        const isAdded = addUser(socket.id,username,room)
        if(isAdded==0)
        {
            return callback({error:'username already occupied'})
        }

        socket.join(room)
        console.log(username+" "+room)
        socket.emit('message',generateMessage(`welcome ${getUser(socket.id).username}`,'Admin'))
        socket.broadcast.to(room).emit('message',generateMessage(`${username} joined the chat`,'Admin'))
        io.to(room).emit('roomInformation',{room:room,allUsers:getUsersInRoom(room)})
        socket.emit('setCurrentUser',username)
        callback()
    })

    socket.on('messageFromUser',(message)=>{
        io.to(getUser(socket.id).room).emit('message',generateMessage(message,getUser(socket.id).username))
    })

    socket.on('disconnect',()=>{
        let user = removeUser(socket.id)
 
        if(user != -1)
        {
            io.to(user.room).emit('message',generateMessage(`${user.username} left the chat`,'Admin'))
            io.to(user.room).emit('roomInformation',{room:user.room,allUsers:getUsersInRoom(user.room)})
        }
    })
})

server.listen(port,()=>{
    console.log('up on port '+port)
})