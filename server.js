const express=require('express');
const http=require('http');
const createGame=require('./public/game');
const socketio=require('socket.io');

const app=express();
const server=http.createServer(app);
const sockets=socketio(server);

app.use(express.static('public'));

const game=createGame();
// game.addPlayer({playerId: 'player1',playerX:0,playerY:0});
// game.addFruit({fruitId: 'fruit1',fruitX:3,fruitY:3});
// console.log(game.state);

sockets.on('connection',(socket)=>{
    const playerId=socket.id;
    console.log('servidor id: ',playerId);
    socket.emit('setup',game.state);
});

server.listen(3000,()=>{
    console.log('ok');
});