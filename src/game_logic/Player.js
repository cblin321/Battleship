class Player {
    #playerType
    #gameBoard
    constructor(type, sideLength) {
        this.#playerType = type
        this.#gameBoard = new Gameboard(sideLength)
    }

    placeShip() {
        
    }

    recieveAttack(coords) {

    }


}

export default Player;