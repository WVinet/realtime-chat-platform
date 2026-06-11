const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Conectado:', socket.id);

  socket.emit('send_message', 'Hola desde cliente Node');
});

socket.on('new_message', (message) => {
  console.log('Mensaje recibido:', message);
});

socket.on('disconnect', () => {
  console.log('Desconectado');
});