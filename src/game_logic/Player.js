import Gameboard from "./Gameboard"
class Player {
    playerType
    gameBoard
    sideLength
    constructor(type, sideLength) {
        this.playerType = type
        this.sideLength = sideLength
        this.gameBoard = new Gameboard(sideLength)
    }

    update(event) {
        //reset in event of game end
        console.log(event)
        if (event.event_type === "reset") {
            console.log("reset")
            this.reset()  
            console.log(this.gameBoard)
        } 
    }

    placeShip(event) {

            return this.gameBoard.placeShip(event.ship["game_logic"], event.coords, event.orientation)
    }

    recieveAttack(coords) {
            return this.gameBoard.recieveAttack(coords)
    }

    reset() {
        this.gameBoard = new Gameboard(this.sideLength)
    }


}

export default Player;