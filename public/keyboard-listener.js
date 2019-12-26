export default function createKeyboardListener(document){
    const state={
        observers: [],
    };
    function subscribe(observerFunction){
        state.observers.push(observerFunction);
    }
    function notifyAll(command){
        for(const observerFunction of state.observers){
            observerFunction(command);
        }
    }
    document.addEventListener('keydown',handleKeydown);
    function handleKeydown(event){
        // event.preventDefault();
        const pressedKey=event.key;
        const command={
            playerId: 'player1',
            pressedKey,
        };
        notifyAll(command);
    }
    return {
        subscribe,
    }
}
