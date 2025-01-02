import Player from "../game_logic/Player"
import Ship from "../game_logic/Ship"
import GameObserver from "./GameObserver"
import UIShip from "./UIShip"
class GameCoordinator {

    BOARD_SIZE = 10
    
    #isPlayerTurn
    
    #player = new Player("p", BOARD_SIZE)
    #computer = new Player("c", BOARD_SIZE)
    
    #playerShips = [{"game_logic": new Ship(5), "ui": new UIShip(5)}, 
        {"game_logic": new Ship(4), "ui": new UIShip(4)}, 
        {"game_logic": new Ship(3), "ui": new UIShip(3)}, 
        {"game_logic": new Ship(3), "ui": new UIShip(3)}, 
        {"game_logic": new Ship(2), "ui": new UIShip(2)},
    ]
    #computerShips = [{"game_logic": new Ship(5), "ui": new UIShip(5)}, 
        {"game_logic": new Ship(4), "ui": new UIShip(4)}, 
        {"game_logic": new Ship(3), "ui": new UIShip(3)}, 
        {"game_logic": new Ship(3), "ui": new UIShip(3)}, 
        {"game_logic": new Ship(2), "ui": new UIShip(2)},
    ]
    
    #playerUIBoard
    #computerUIBoard 

    #observer = new GameObserver([this.#player, this.#computer, this])

    constructor() {
        this.#createUIBoardElement()
    }

    #playerShot = (e) => {
        if (turn) {
            const x = e.target.x   
            const y = e.target.y   
            
            const event = {
                event_type: "attack",
                isPlayerTurn: this.#isPlayerTurn,
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
        this.#playerUIBoard = document.createElement("div")
        this.#computerUIBoard = document.createElement("div") 
        for (let i = 0; i < this.BOARD_SIZE; i++)
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                const playerCell = document.createElement("div")
                const computerCell = document.createElement("div")
                
                computerCell.classList.add("computer-cell")
                playerCell.classList.add("player-cell")

                playerCell.addEventListener("click", () => {

                })

                computerCell.x = j
                computerCell.y = i
                playerCell.x = j
                playerCell.y = i

                
                this.#playerUIBoard.appendChild(playerCell)
                this.#computerUIBoard.appendChild(computerCell)
            }
    }

    /**
     * Updates UI based on game logic
     * @param {Object} event 
     */
    #update(event) {
        if (event.event_type === "attack") {
            if (this.#isPlayerTurn) {
                switch (event.result) {
                    case 1:
                        //player hit computer ship
                        //update UI board

                    case 2:
                        //player wins
                        
                    default:
                        //player missed
                        //update UI board
                    }

            } else {
                switch (event.result) {
                    case 1:
                        //computer hit player ship
                        //update UI board
                    case 2:
                        //computer wins

                    default:
                        //computer missed
                        //update UI board
                }
            }
        }

        if (event.event_type === "place_ship") {
            if (this.#isPlayerTurn) {
                if (event.result) {
                    //display placed ship
                } else {
                    //notify the user of error
                }
            }
        }
    }

    #placeShip(player, UIShip, coords) {
        if (player.playerType === "p") {
            //TODO notify user to place ships
            this.#observer.placeShip(player, coords)
        }

    }

    #giveWin(winner) {
        const event = {
            event_type: "game_win",
            winner: ""
        }
        this.#observer.notifyObservers()
    }
    
    gameLoop() {

    }

    async #playerShipSelection() {
        //TODO notify the user to select a ship

        const shipPromiseList = this.#playerShips.map((x) => new Promise((resolve, reject) => x["ui"].addEventListener("click", () => {
            resolve(x)
        })))
        
        
        //wait until the user selects a ship
        //get 1st ship to be clicked
        const selectedShip = await Promise.race(shipPromiseList)
        
        //TODO switching ships (recursion?)

        //notify the user to select a square
        //selected ship will be placed on the cell the mouse is over and if the cell is clicked
        const cellPromiseList = [...this.#playerUIBoard.children].map()

        //TODO if a square is selected then notify that the ship has been placed
    }
   
   //have a silhouette of where the ship will be, as well as right click while selected to rotate
   //click another hsip to select it and deselect selected ship

}




export default {playerBoard, computerBoard};