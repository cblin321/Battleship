//mediator class - mediates actions that happen on the frontend with the backend
class GameMediator {

    #observers = []

    constructor(observers) {
        this.#observers = observers
    }

    notifyObservers(event) {
        this.#observers.forEach(x => {
            x.update(event)
        })
    }

    recieveAttack(player, event) {
        event.result = player.recieveAttack(event.coords)
        this.notifyObservers(event)
    }

    placeShip(player, event) {
        event.result = player.placeShip(event)
        this.notifyObservers(event)
    }

    addObserver(observer) {
        this.#observers = [...this.#observers, observer]
    }
    
}

export default GameMediator