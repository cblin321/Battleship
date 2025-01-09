//mediator class - mediates actions that happen on the frontend with the backend
class GameMediator {

    #observers = []

    constructor(observers) {
        this.#observers = observers
    }

    notifyObservers(event) {
        this.#observers.forEach(x => {
            // console.log(x)
            // console.log(x.update)
            x.update(event)
        })
    }

    playerShot(player, event) {
        event.result = player.recieveAttack(event.coords)
        this.notifyObservers(event) 
    }

    placeShip(player, event) {
        event.result = player.placeShip(event.coords)
        this.notifyObservers(event)
    }

    addObserver(observer) {
        this.#observers = [...this.#observers, observer]
    }
    
}

export default GameMediator