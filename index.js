const express = require('express');
const app = express();
const server = require('http').Server(app);
const PORT = process.env.PORT || 3001
const io = require('socket.io')(server, {
  cors: {
    methods: ['GET', 'POST'],
  }})

  io.on('connection', (socket) => {
    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
      socket.broadcast.emit('callEnded')
    })

    socket.on('call', ({userToCall, from, name, signalData}) => {
      io.to(userToCall).emit('call', {from, name, signal: signalData})
    })

    socket.on('answer', (data) => {
      io.to(data.to).emit('callAnswer', data.signal)
    })
  })

  server.listen(PORT, () => {console.log('server is running on port')});