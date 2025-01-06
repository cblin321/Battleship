import Player from "../game_logic/Player"
import Ship from "../game_logic/Ship"
import GameObserver from "./GameObserver"
import UIShip from "./UIShip"
class GameCoordinator {

    BOARD_SIZE = 10
    
    #isPlayerTurn
    #isActiveShipSelection
    
    #player = new Player("p", this.BOARD_SIZE)
    #computer = new Player("c", this.BOARD_SIZE)
    
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
    
    playerUIBoard
    computerUIBoard 

    #observer = new GameObserver([this.#player, this.#computer, this])

    constructor(playerShipContainer, computerShipContainer) {
        this.#createUIBoardElement()
        this.#computerShips.forEach(x => computerShipContainer.appendChild(x["ui"].container))
        this.#playerShips.forEach(x => playerShipContainer.appendChild(x["ui"].container))
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
        this.playerUIBoard = document.createElement("div")
        this.computerUIBoard = document.createElement("div") 
        for (let i = 0; i < this.BOARD_SIZE; i++)
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                const playerCell = document.createElement("div")
                const computerCell = document.createElement("div")
                
                computerCell.classList.add("computer-cell")
                playerCell.classList.add("player-cell")

                playerCell.addEventListener("click", () => {

                })

                computerCell.dataset.x = j
                computerCell.dataset.y = i
                playerCell.dataset.x = j
                playerCell.dataset.y = i

                
                this.playerUIBoard.appendChild(playerCell)
                this.computerUIBoard.appendChild(computerCell)
            }
        this.playerUIBoard.classList.add("ui-board")
        this.computerUIBoard.classList.add("ui-board")
        
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
                    //TODO display placed ship
                } else {
                    //TODO notify the user of error
                    //TODO deselect ship
                }
            }
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
        //ship placement process
            //while there are unplaced ships, continue prompting the user to place them
        let unplaced = JSON.parse(JSON.stringify(this.#playerShips))
        while (unplaced) {
            this.#playerShipPlacement(unplaced)
        }
        
    }
    
    async #playerShipPlacement() {
        
        //TODO notify the user to select a ship
        this.#playerShips.forEach((x) => x.classList.remove("selected"))
        
        
        const selectElement = (ele) => {
            return new Promise((resolve) => {
                const clickHandler = () => {
                    resolve(ele); // Resolve with the clicked element
                    ele.removeEventListener("click", clickHandler); // Remove listener after selection
                }
                ele.addEventListener("click", clickHandler)
            })
        }

        const deselectShip =  (e) => {
            if (e.key === "d" || e.key === "D") {
                //event listener cleanup
                document.removeEventListener("mousedown", rightClickListener);
                // this.#playerShips.forEach((x) => x["ui"].remove("click", selectElement))
                document.removeEventListener("keydown", deselectShip);
                //restart playerSelection Process
                this.#isActiveShipSelection = true
                this.#playerShipPlacement()
            }
        }
        
        
        
        //wait until the user selects a ship
        //get 1st ship to be clicked
        const shipPromiseList = this.#playerShips.map((x) => selectElement(x["ui"]))
        
        let ORIENTATIONS = [0, 90, 180, 270]
        let orientation_index = 1
        
        const selectedShip = await Promise.race(shipPromiseList)
        selectedShip["ui"].classList.add("selected")
        //TODO notify user to ship selection controls:
        //right clicking to rotate ship
        //presss d to selected current ship, restart selection (recursion)
        
        document.addEventListener("mousedown", (event) => {
            if (event.button === 2) {  
                orientation_index = (orientation_index + 1) % ORIENTATIONS.length
                selectedShip["ui"].style.transform = `rotate(${ORIENTATIONS[orientation_index]}deg)`
            }
        });
        
        document.addEventListener("keydown", (e) => deselectShip(e))
        
        //ship selection is over for current ship
        if (!this.#isActiveShipSelection)
            return
        
        //TODO notify the user to select a cell
        
        //selected ship will be placed on the cell the mouse is over and if the cell is clicked
        
        //TODO have a silhouette of where the ship will be
        const cellPromiseList = [...this.playerUIBoard.children].map((x) => selectElement(x))
        const selectedCell = await Promise.race(cellPromiseList)
        
        this.#placeShip(this.#player, selectedShip, [selectedCell["ui"].x, selectedCell["ui"].y])
        
        //ship placement success
        document.removeEventListener("keydown", deselectShip);
        this.#isActiveShipSelection = false
        
    }
    
    #placeShip(player, ship, coords, orientation) {
        if (player === "p") {
            const event = {
                "player": player, 
                "ship": ship,
                "coords": coords,
                "orientation": orientation
            }
            this.#observer.placeShip(event)
        }
    
    }
    
}




export default GameCoordinator;