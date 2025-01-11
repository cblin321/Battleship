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
        this.#computerShips.forEach((x, i) => {
            x["ui"].container.dataset.index = i
            computerShipContainer.appendChild(x["ui"].container)
        }
    )
        this.#playerShips.forEach((x, i) => {
            x["ui"].container.dataset.index = i
            playerShipContainer.appendChild(x["ui"].container)
        })
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
        console.log(this.playerUIBoard.children)
    }

    /**
     * Updates UI based on game logic
     * @param {Object} event 
     */
    update(event) {
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
            if (event.player.playerType ==="p") {
                if (event.result) {
                    const clearCells = () => {
                        [...this.playerUIBoard.children].forEach(x => {
                            x.classList.remove("invalid-sillhouette")
                            x.classList.remove("valid-sillhouette")
                        })
                    }
                    //TODO display placed ship
                    console.log(event)
                    const orientation = event.orientation
                    const startCoord = orientation === "down" || orientation === "up" ? event.coords[1] : event.coords[0]   
                    const endpoint = orientation === "down" || orientation === "right" ? Math.min(this.BOARD_SIZE, startCoord + event.ship.game_logic.length) 
                    : Math.max(0, startCoord - event.ship.game_logic.length + 1) 
                    clearCells()
                    switch (orientation) {
                        // y = i, j = x
                        case "down":
                            for (let i = event.coords[1]; i < endpoint; i++) 
                                this.playerUIBoard.children[i * this.BOARD_SIZE + event.coords[0]].classList.add("placed")
                            break
                        case "up":
                            for (let i = event.coords[1]; i >= endpoint; i--)
                                this.playerUIBoard.children[i * this.BOARD_SIZE + event.coords[0]].classList.add("placed")
                            break
                        case "left":
                            for (let i = event.coords[0]; i >= endpoint; i--)
                                this.playerUIBoard.children[event.coords[1] * this.BOARD_SIZE + i].classList.add("placed")
                            break
                        case "right":
                            for (let i = event.coords[0]; i < endpoint; i++)
                                this.playerUIBoard.children[event.coords[1] * this.BOARD_SIZE + i].classList.add("placed")
                            break
                    }
                    event.ship.ui.removeBorder()

                    //TODO make sure game logic updaating appropraitely

                } else {
                    //TODO notify the user of error
                    console.log(event)
                    event.ship.ui.container.style.position = "static"
                    event.ship.ui.container.style.transition = "none"
                    event.ship.ui.container.style.transform = `rotate(0deg)`
                    event.ship.ui.container.style.pointerEvents = "auto";
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
        this.#isPlayerTurn = ""
        let unplaced = [...this.#playerShips]
        this.#playerShipPlacement(unplaced)
        
    }
    
    async #playerShipPlacement(unselectedShips) {                
        const currHoveredCell = {
            x: undefined, 
            y: undefined
        }
        const clearCells = () => {
            [...this.playerUIBoard.children].forEach(x => {
                x.classList.remove("invalid-sillhouette")
                x.classList.remove("valid-sillhouette")
            })
        }
        const preventDefault = (event) => {
            event.preventDefault()         
    
        }

        clearCells()
        
        this.#isActiveShipSelection = true
        if (!unselectedShips)
            return
        //TODO notify the user to select a ship
        let popup = this.#popup("Click on a ship to select")
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
                ele.addEventListener("click", () => {
                    console.log("fjdksafjaskl")
                    resolve(ele)
                })
                
            })
            
        }
        
        //wait until the user selects a ship
        //get 1st ship to be clicked
        const shipPromiseList = unselectedShips.map((x) => {
            
            return selectElement(x["ui"].container)
        })
        
        let rotation_count = 0
        
        const selectedShip = await Promise.race(shipPromiseList)
        let orientation = "down"
        this.#closePopup(popup)

        popup = this.#popup("Drag ship to valid cell on board and click to place \nRmb to rotate, d to deselect ship")
        const orientationMapping = {
            1: "down",
            2: "left",
            3: "up",
            4: "right"
        } 

        const rightClickListener =  (event) => {
            if (event.button === 2) {  
                rotation_count++
                selectedShip.style.transition = "transform 0.08s ease"
                selectedShip.style.transformOrigin = 'calc(var(--cell-size) / 2) calc(var(--cell-size) / 2)'
                selectedShip.style.transform = `rotate(${90 * rotation_count}deg)`
                orientation = orientationMapping[(rotation_count % 4) + 1]
                if (currHoveredCell.x === undefined || currHoveredCell.y === undefined)
                    return
                const startCoord = orientation === "down" || orientation === "up" ? currHoveredCell.y : currHoveredCell.x   
                const endpoint = orientation === "down" || orientation === "right" ? Math.min(this.BOARD_SIZE, startCoord + this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length) 
                : Math.max(0, startCoord - this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length + 1) 
                clearCells()
                let classtoApply
                if ( orientation === "down" || orientation === "right")
                    classtoApply = this.BOARD_SIZE >= startCoord + this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length ? "valid-sillhouette" : "invalid-sillhouette"
                else 
                    classtoApply = 0 <= startCoord - this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length + 1 ? "valid-sillhouette" : "invalid-sillhouette"
                switch (orientation) {
                    // y = i, j = x
                    case "down":
                        for (let i = currHoveredCell.y; i < endpoint; i++) 
                            this.playerUIBoard.children[i * this.BOARD_SIZE + currHoveredCell.x].classList.add(classtoApply)
                        
                        break
                    case "up":
                        for (let i = currHoveredCell.y; i >= endpoint; i--)
                            this.playerUIBoard.children[i * this.BOARD_SIZE + currHoveredCell.x].classList.add(classtoApply)
                        break
                    case "left":
                        for (let i = currHoveredCell.x; i >= endpoint; i--)
                            this.playerUIBoard.children[currHoveredCell.y * this.BOARD_SIZE + i].classList.add(classtoApply)
                        break
                    case "right":
                        for (let i = currHoveredCell.x; i < endpoint; i++)
                            this.playerUIBoard.children[currHoveredCell.y * this.BOARD_SIZE + i].classList.add(classtoApply)
                        break


                }
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


        const cellSillhouette = (e) => {
            //apply a class to the cells that the ship will occupy
            currHoveredCell.x = parseInt(e.target.dataset.x) 
            currHoveredCell.y = parseInt(e.target.dataset.y) 
            const startCoord = orientation === "down" || orientation === "up" ? parseInt(e.target.dataset.y) : parseInt(e.target.dataset.x)   
            const endpoint = orientation === "down" || orientation === "right" ? Math.min(this.BOARD_SIZE, startCoord + this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length) 
            : Math.max(0, startCoord - this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length + 1) 
            //TODO apply different class if in bounds or not
            let classtoApply
            if ( orientation === "down" || orientation === "right")
                classtoApply = this.BOARD_SIZE >= startCoord + this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length ? "valid-sillhouette" : "invalid-sillhouette"
            else 
                classtoApply = 0 <= startCoord - this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length + 1 ? "valid-sillhouette" : "invalid-sillhouette"
            switch (orientation) {
                // y = i, j = x
                case "down":
                    for (let i = parseInt(e.target.dataset.y); i < endpoint; i++) 
                        this.playerUIBoard.children[i * this.BOARD_SIZE + parseInt(e.target.dataset.x)].classList.add(classtoApply)
                    
                    break
                case "up":
                    for (let i = parseInt(e.target.dataset.y); i >= endpoint; i--)
                        this.playerUIBoard.children[i * this.BOARD_SIZE + parseInt(e.target.dataset.x)].classList.add(classtoApply)
                    break
                case "left":
                    for (let i = parseInt(e.target.dataset.x); i >= endpoint; i--)
                        this.playerUIBoard.children[parseInt(e.target.dataset.y) * this.BOARD_SIZE + i].classList.add(classtoApply)
                    break
                case "right":
                    for (let i = parseInt(e.target.dataset.x); i < endpoint; i++)
                        this.playerUIBoard.children[parseInt(e.target.dataset.y) * this.BOARD_SIZE + i].classList.add(classtoApply)
                    break
            }
        }

        const followingFunc = wrapper(selectedShip)
        selectedShip.classList.add("selected")
        document.addEventListener("mousedown", rightClickListener)
        const deselectShip =  (e) => {
            if (e.key === "d" || e.key === "D") {
                //event listener cleanup
                document.removeEventListener("mousedown", rightClickListener)
                selectedShip.classList.remove("selected")
                document.removeEventListener("keydown", deselectShip)
                document.removeEventListener("mousemove", followingFunc) // Remove listener after selection
                selectedShip.style.position = "static"
                document.removeEventListener("contextmenu", preventDefault)
                selectedShip.style.transform = `rotate(0deg)`
                //restart playerSelection Process
                this.#isActiveShipSelection = true
                this.#playerShipPlacement(unselectedShips)
                selectedShip.style.pointerEvents = "auto";
                [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseover", cellSillhouette));
                [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseleave", clearCells))
                this.#closePopup(popup)
            }
        }
        //TODO event listener cleanup
        

        document.addEventListener('contextmenu', preventDefault)
        
       
        
        document.addEventListener("keydown", (e) => deselectShip(e))
        //ship selection is over for current ship
        if (!this.#isActiveShipSelection)
            return
        
        //selected ship will be placed on the cell the mouse is over and if the cell is clicked
        
        [...this.playerUIBoard.children].forEach(x => x.addEventListener("mouseover", cellSillhouette));
        [...this.playerUIBoard.children].forEach(x => x.addEventListener("mouseleave", clearCells))
        const cellPromiseList = [...this.playerUIBoard.children].map((x) => selectElement(x))
        const selectedCell = await Promise.race(cellPromiseList)
        console.log(selectedCell)

        const placementSuccess = this.#placeShip(this.#player, selectedShip, [parseInt(selectedCell.dataset.x), parseInt(selectedCell.dataset.y)], orientation)
        //ship placement success
        document.removeEventListener("contextmenu", preventDefault)
        document.removeEventListener("mousedown", rightClickListener)
        document.removeEventListener("keydown", deselectShip)
        document.removeEventListener('mousemove', followingFunc);
        [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseover", cellSillhouette));
        [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseleave", clearCells))
        this.#closePopup(popup)
        if (placementSuccess)
            unselectedShips = unselectedShips.filter((x) => x["ui"].container != selectedShip)
        selectedShip.classList.remove("selected")
        this.#isActiveShipSelection = false
        console.log(unselectedShips)
        this.#playerShipPlacement(unselectedShips)
    }
    
    /**
     * Pop-up to notify the user
     * @param {String} message the message to display to user
     */
    #popup(message) {
        const popup = document.createElement("div")
        const popupText = document.createElement("p")
        
        popupText.textContent = message
        popup.appendChild(popupText)

        popup.classList.add("popup")
        popup.classList.add("active")
        document.body.appendChild(popup)
        return popup
    }

    #closePopup(popup) {
        document.body.removeChild(popup)
    }


    #placeShip(player, ship, coords, orientation) {
        if (player.playerType === "p") {
            ship = this.#playerShips[ship.dataset.index]
            const event = {
                "event_type": "place_ship",
                "player": player, 
                "ship": ship,
                "coords": coords,
                "orientation": orientation
            }
            // console.log(event)
            this.#observer.placeShip(player, event)
            return event.result
        }
    }
    
}




export default GameCoordinator;