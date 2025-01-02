class Player {
    playerType
    #gameBoard
    constructor(type, sideLength) {
        this.playerType = type
        this.#gameBoard = new Gameboard(sideLength)
    }

    update(event) {

    }

    placeShip() {
        
    }

    recieveAttack(coords) {

    }


}

export default Player;