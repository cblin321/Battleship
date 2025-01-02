//observer class; handles notifies observers of events emitted by GC
class GameObserver {

    #observers = []

    constructor(observers) {
        this.#observers = observers
    }

    notifyObservers(event) {
        this.#observers.forEach(x => x.notify(event))
    }

    playerShot(player, event) {
        event.result = player.recieveAttack(event.coords)
        this.notifyObservers(event) 
    }

    changeTurn(turn) {

    }

    addObserver(observer) {
        this.#observers = [...this.#observers, observer]
    }

    handleUpdates(event) {
        this.#observers.forEach(x => x.update(event))
    }
    
}

export default UIBoard