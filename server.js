import express from 'express';
import http from 'http';
import createGame from './public/game.js';
import socketio from 'socket.io';

const app=express();
const server=http.createServer(app);
const sockets=socketio(server);

app.use(express.static('public'));

const game=createGame();
game.start();

game.subscribe((comand)=>{
    sockets.emit(comand.type,comand);
});

sockets.on('connection',(socket)=>{
    console.log('connection');
    const playerId=socket.id;
    game.addPlayer({playerId: playerId});
    socket.emit('setup',game.state);
    socket.on('disconnect',()=>{
        game.removePlayer({playerId: playerId});
    });
    socket.on('move-player',(comand)=>{
        comand.playerId=playerId;
        comand.type='move-player';
        game.movePlayer(comand);
    });
});

server.listen(3000,()=>{
    console.log('escutando');
});
