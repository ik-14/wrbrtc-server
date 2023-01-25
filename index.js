const express = require('express');
const app = express();
const server = require('http').Server(app);
const PORT = process.env.PORT || 3001
const io = require('socket.io')(server, {
  cors: {
    methods: ['GET', 'POST'],
  }})

  app.get('/', (req, res) => {
    res.send('hi')
  })

  io.on('connection', (socket) => {
    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
      socket.broadcast.emit('callEnded')
    })

    socket.on('call', (data) => {
      io.to(data.userToCall).emit('call', {from: data.from, name: data.name, signal: data.signalData})
    })

    socket.on('answer', (data) => {
      io.to(data.to).emit('callAnswer', data.signal)
    })
  })

  server.listen(PORT, () => {console.log('server is running on port')});