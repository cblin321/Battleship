import Gameboard from "../game_logic/Gameboard"
import Player from "../game_logic/Player"
import Ship from "../game_logic/Ship"
import GameObserver from "./GameObserver"

class GameCoordinator {

    BOARD_SIZE = 10
    
    #currentTurn
    
    #player = new Player("p", BOARD_SIZE)
    #computer = new Player("c", BOARD_SIZE)
    
    #playerShips = [new Ship(5), 
        new Ship(4), new Ship(3), 
        new Ship(3), new Ship(2),
    ]
    
    #computerShips = [new Ship(5), 
        new Ship(4), new Ship(3), 
        new Ship(3), new Ship(2),
    ]
    
    #playerUIBoard = document.createElement("div")
    #computerUIBoard = document.createElement("div") 

    #observer

    constructor() {
        this.#createUIBoardElement()
        this.#observer = new GameObserver([this.#player, this.#computer, this])
    }

    #playerShot = (e) => {
        if (turn) {
            const x = e.target.x   
            const y = e.target.y   
            
            const event = {
                event_type: "attack",
                currentTurn: this.#currentTurn,
                coords: [x, y],
                result: undefined
            } 


            this.#observer.playerShot(this.#computer, event)

        }

        e.target.removeEventListener("click", this.#playerShot)
    }
    
    /**
     * Initialize the HTML board elements
     */
    #createUIBoardElement() {
        for (let i = 0; i < this.BOARD_SIZE; i++)
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                const playerCell = document.createElement("div")
                const computerCell = document.createElement("div")
                
                computerCell.classList.add("computer-cell")
                playerCell.classList.add("player-cell")

                playerCell.addEventListener("click", )

                computerCell.x = j
                computerCell.y = i
                playerCell.x = j
                playerCell.y = i

                
                this.#playerUIBoard.appendChild(playerCell)
                this.#computerUIBoard.appendChild(computerCell)
            }
    }
}



export default {playerBoard, computerBoard};