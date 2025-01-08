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
        playerShipContainer.classList.add("ship-container")
        computerShipContainer.classList.add("ship-container")
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
                    console.log(event.result)
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
            let unplaced = [...this.#playerShips]
            this.#playerShipPlacement(unplaced)
            
        }
        
    async #playerShipPlacement(unselectedShips) {        
        this.#isActiveShipSelection = true
        if (!unselectedShips)
            return
        //TODO notify the user to select a ship
        unselectedShips.forEach((x) => {
            x["ui"].container.classList.remove("selected")
        })
        
        let xPos = 0  
        let yPos = 0  
        let xVel = 0  
        let yVel = 0  
        const acceleration = 1.5 
        const selectElement = (ele) => {
            return new Promise((resolve) => {
                ele.addEventListener("click", () => resolve(ele))
                
            })
            
        }
        
        //TODO finish
        const deselectShip =  (e) => {
            if (e.key === "d" || e.key === "D") {
                //event listener cleanup
                document.removeEventListener("mousedown", rightClickListener)
                selectedShip.classList.remove("selected")
                document.removeEventListener("keydown", deselectShip)
                e.removeEventListener("click", clickHandler) // Remove listener after selection
                
                //restart playerSelection Process
                this.#isActiveShipSelection = true
                this.#playerShipPlacement(unselectedShips)
            }
        }
        
        
        
        //wait until the user selects a ship
        //get 1st ship to be clicked
        
        const shipPromiseList = unselectedShips.map((x) => selectElement(x["ui"].container))
        
        let rotation_count = 0
        
        const selectedShip = await Promise.race(shipPromiseList)
        let orientation = "down"

        const orientationMapping = {
            1: "down",
            2: "left",
            3: "up",
            4: "right"
        } 
        const rightClickListener =  (event) => {
            if (event.button === 2) {  
                rotation_count++
                selectedShip.style.transition = "transform 0.1s ease"
                selectedShip.style.transformOrigin = 'calc(var(--cell-size) / 2) calc(var(--cell-size) / 2)'
                selectedShip.style.transform = `rotate(${90 * rotation_count}deg)`
                orientation = orientationMapping[(rotation_count % 4) + 1]
            }
        }
        
        const wrapper = (ele) => {
            const followMouse = (event) => {
                const mouseX = event.clientX
                const mouseY = event.clientY
                
                const dx = mouseX - xPos
                const dy = mouseY - yPos
                
                xVel += dx * acceleration
                yVel += dy * acceleration
                
                xPos += xVel
                yPos += yVel
                ele.style.position = "absolute"
                ele.style.pointerEvents = 'none'
                ele.style.left = `${mouseX - ele.offsetWidth / 2}px`
                ele.style.top = `${mouseY - ele.offsetWidth / 2}px`
                
            }
            document.addEventListener('mousemove', followMouse)
            return followMouse
        }
        const followingFunc = wrapper(selectedShip)
        selectedShip.classList.add("selected")
        document.addEventListener("mousedown", rightClickListener)
        //TODO event listener cleanup
        //TODO notify user to ship selection controls:
        //TODO right clicking to rotate ship
        //TODO press d to selected current ship, restart selection (recursion)
        
        const preventDefault = (event) => {
            event.preventDefault()         

        }

        document.addEventListener('contextmenu', preventDefault)
        
       
        
        document.addEventListener("keydown", (e) => deselectShip(e))
        //ship selection is over for current ship
        if (!this.#isActiveShipSelection)
            return
        //TODO notify the user to select a cell
        
        //selected ship will be placed on the cell the mouse is over and if the cell is clicked
        
        //TODO have a silhouette of where the ship will be
        const cellPromiseList = [...this.playerUIBoard.children].map((x) => selectElement(x))
        const selectedCell = await Promise.race(cellPromiseList)
        console.log(selectedCell)

        this.#placeShip(this.#player, selectedShip, [selectedCell.dataset.x, selectedCell.dataset.y], orientation)
        //ship placement success
        document.removeEventListener("contextmenu", preventDefault)
        document.removeEventListener("mousedown", rightClickListener)
        document.removeEventListener("keydown", deselectShip)
        unselectedShips = unselectedShips.filter((x) => x["ui"].container != selectedShip)
        selectedShip.classList.remove("selected")
        this.#isActiveShipSelection = false
        console.log(unselectedShips)
        this.#playerShipPlacement(unselectedShips)
    }
    
    #popup() {

    }


    #placeShip(player, ship, coords, orientation) {
        if (player === "p") {
            const event = {
                "player": player, 
                "ship": ship,
                "coords": coords,
                "orientation": orientation
            }
            console.log(event)
            this.#observer.placeShip(event)
        }
        const event = {
            "player": player, 
            "ship": ship,
            "coords": coords,
            "orientation": orientation
        }
        console.log(event)
    
    }
    
}




export default GameCoordinator;