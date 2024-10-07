const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname)); // Statik dosyaları sunma

io.on('connection', (socket) => {
    console.log('Yeni bir kullanıcı bağlandı:', socket.id);

    // Kullanıcıdan gelen mesajları diğer kullanıcılara ilet
    socket.on('signal', (data) => {
        console.log('Signal alındı:', data);
        socket.broadcast.emit('signal', data); // Diğer kullanıcılara ilet
    });

    socket.on('disconnect', () => {
        console.log('Kullanıcı ayrıldı:', socket.id);
    });
});

// Sunucu dinleme
server.listen(5000, () => {
    console.log('Socket.IO sunucusu 5000 portunda çalışıyor.');
});
