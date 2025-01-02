//observer class; handles notifies observers of events emitted by GC
class GameObserver {

    #observers = []

    constructor(observers) {
        this.#observers = observers
    }

    notifyObservers(event) {
        this.#observers.forEach(x => x.update(event))
    }

    playerShot(player, event) {
        event.result = player.recieveAttack(event.coords)
        this.notifyObservers(event) 
    }

    placeShip(player, event) {
        player.placeShip(event.coords)
        this.notifyObservers(event)
    }

    addObserver(observer) {
        this.#observers = [...this.#observers, observer]
    }
    
}

export default UIBoard