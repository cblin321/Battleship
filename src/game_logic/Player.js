class Player {
    playerType
    #gameBoard
    constructor(type, sideLength) {
        this.playerType = type
        this.#gameBoard = new Gameboard(sideLength)
    }

    update(event) {
        //reset in event of game end
        //recieve attack
    }

    placeShip(coords) {
        return this.#gameBoard.placeShip(coords)
    }

    recieveAttack(coords) {

    }


}

export default Player;