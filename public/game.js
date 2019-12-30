export default function createGame(){
    const state={
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10,
        },
    };

    const observers=[];

    function start(){
        const frequency=2000;
        setInterval(addFruit,frequency);
    }

    function subscribe(observerFunction){
        observers.push(observerFunction);
    }
    function notifyAll(command){
        for(const observerFunction of observers){
            observerFunction(command);
        }
    }

    function setState(newState){
        Object.assign(state,newState);
    }

    function addPlayer(command){
        console.log('add player');
        const playerId=command.playerId;
        const playerX='playerX' in command?command.playerX:Math.floor(Math.random()*state.screen.width);
        const playerY='playerY' in command?command.playerY:Math.floor(Math.random()*state.screen.height);
        state.players[playerId]={
            x: playerX,
            y: playerY,
        }
        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY,
        });
    }
    function removePlayer(command){
        const playerId=command.playerId;
        delete state.players[playerId];
        notifyAll({
            type: 'remove-player',
            playerId: playerId,
        });
    }

    function addFruit(command){
        console.log('function addFruit');
        const fruitId=command?command.fruitId:Math.floor(Math.random()*10000000000);
        const fruitX=command?command.fruitX:Math.floor(Math.random()*state.screen.width);
        const fruitY=command?command.fruitY:Math.floor(Math.random()*state.screen.height);
        state.fruits[fruitId]={
            x: fruitX,
            y: fruitY,
        }
        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY,
        });
    }
    function removeFruit(command){
        const fruitId=command.fruitId;
        delete state.fruits[fruitId];
        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId,
        });
    }

    function movePlayer(command){
        notifyAll(command);
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
            // console.log(`checando ${playerId} e ${fruitId}`);
            if(player.x===fruit.x&player.y===fruit.y){
                // console.log('colisão');
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
        setState,
        subscribe,
        start,
    };
}
