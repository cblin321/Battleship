import Gameboard from "./Gameboard"
class Player {
    playerType
    gameBoard
    constructor(type, sideLength) {
        this.playerType = type
        this.gameBoard = new Gameboard(sideLength)
    }

    update(event) {
        //reset in event of game end
        //recieve attack
        if (event.eventType === "game_win") {
            
        }
    }

    placeShip(event) {

            return this.gameBoard.placeShip(event.ship["game_logic"], event.coords, event.orientation)
    }

    recieveAttack(coords) {

    }

    reset() {
        this.gameBoard = new Gameboard(sideLength)
    }


}

export default Player;