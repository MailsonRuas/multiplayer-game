// exports=module.exports=createGame;
module.exports=function createGame(){
    const state={
        players: {
            // 'player1': {},
            // 'player2': {},
        },
        fruits: {
            // 'fruit1': {},
        },
        screen: {
            width: 10,
            height: 10,
        },
    };

    function addPlayer(command){
        const playerId=command.playerId;
        const playerX=command.playerX;
        const playerY=command.playerY;
        state.players[playerId]={
            x: playerX,
            y: playerY,
        }
    }
    function removePlayer(command){
        const playerId=command.playerId;
        delete state.players[playerId];
    }

    function addFruit(command){
        const fruitId=command.fruitId;
        const fruitX=command.fruitX;
        const fruitY=command.fruitY;
        state.fruits[fruitId]={
            x: fruitX,
            y: fruitY,
        }
    }
    function removeFruit(command){
        const fruitId=command.fruitId;
        delete state.fruits[fruitId];
    }

    function movePlayer(command){
        const acceptedMoves={
            ArrowDown(player){
                if(player.y+1<state.screen.height){
                    player.y++;
                    return;
                }
            },
            ArrowUp(player){
                if(player.y-1>=0){
                    player.y--;
                    return;
                }
            },
            ArrowLeft(player){
                if(player.x-1>=0){
                    player.x--;
                    return;
                }
            },
            ArrowRight(player){
                if(player.x+1<state.screen.width){
                    player.x++;
                    return;
                }
            },
        };
        const pressedKey=command.pressedKey;
        const playerId=command.playerId;
        const player=state.players[command.playerId];
        const moveFunction=acceptedMoves[pressedKey];
        if(player&&moveFunction){
            moveFunction(player);
            checkForFruitCollision(playerId);
        }
    }

    function checkForFruitCollision(playerId){
        const player=state.players[playerId];
        for(const fruitId in state.fruits){
            const fruit=state.fruits[fruitId];
            console.log(`checando ${playerId} e ${fruitId}`);
            if(player.x===fruit.x&player.y===fruit.y){
                console.log('colisão');
                removeFruit({fruitId:fruitId});
            }
        }
    }

    return {
        addFruit,
        removeFruit,
        addPlayer,
        removePlayer,
        movePlayer,
        state,
    };
}
