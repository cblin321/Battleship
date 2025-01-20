import Gameboard from "../game_logic/Gameboard"
import Player from "../game_logic/Player"
import Ship from "../game_logic/Ship"
import GameObserver from "./GameObserver"
import UIShip from "./UIShip"
class GameCoordinator {

    BOARD_SIZE = 10
    
    #isActiveShipSelection
    #winner 
    
    #player = new Player("p", this.BOARD_SIZE)
    #computer = new Player("cpu", this.BOARD_SIZE)
    
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
    #instructionText
    boardContainer

    #observer = new GameObserver([this.#player, this.#computer, this])

    constructor(playerShipContainer, computerShipContainer, boardContainer, instructionText) {
        boardContainer.classList.add("board-container")
        playerShipContainer.classList.add("ship-container")
        computerShipContainer.classList.add("ship-container");
        [this.playerUIBoard, this.computerUIBoard] = this.#createUIBoardElement()
        boardContainer.appendChild(this.playerUIBoard)
        boardContainer.appendChild(this.computerUIBoard)
        this.#computerShips.forEach((x, i) => {
            x["ui"].container.dataset.index = i
            computerShipContainer.appendChild(x["ui"].container)
        }
    )
    this.#playerShips.forEach((x, i) => {
        x["ui"].container.dataset.index = i
        playerShipContainer.appendChild(x["ui"].container)
    })
    this.boardContainer = boardContainer
    this.#instructionText = instructionText
}

/**
 * Initialize the HTML board elements
*/
    #createUIBoardElement() {
        const playerUIBoard = document.createElement("div")
        const computerUIBoard = document.createElement("div") 
        for (let i = 0; i < this.BOARD_SIZE; i++)
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                const playerCell = document.createElement("div")
                const computerCell = document.createElement("div")
                
                computerCell.classList.add("computer-cell")
                playerCell.classList.add("player-cell")

                computerCell.dataset.x = j
                computerCell.dataset.y = i
                playerCell.dataset.x = j
                playerCell.dataset.y = i
                
                playerUIBoard.appendChild(playerCell)
                computerUIBoard.appendChild(computerCell)
            }
            playerUIBoard.classList.add("ui-board")
            computerUIBoard.classList.add("ui-board")
        return [playerUIBoard, computerUIBoard]
    }

    /**
     * Updates UI based on game logic
     * @param {Object} event 
     */
    update(event) {
        if (event.event_type === "attack") {
            if (event.player.playerType === "cpu") {
                switch (event.result) {
                    case 1:
                        //player hit computer ship
                        //update UI board
                        [...this.computerUIBoard.children][event.coords[1] * this.BOARD_SIZE + event.coords[0]].classList.add("hit")
                        break
                    case 2:
                        //player wins
                        this.#giveWin(this.#player)
                        break
                    default:
                        //player missed
                        //update UI board
                        [...this.computerUIBoard.children][event.coords[1] * this.BOARD_SIZE + event.coords[0]].classList.add("miss")
                        break
                    }

            } else {
                switch (event.result) {
                    case 1:
                        //computer hit player ship
                        //update UI board
                        [...this.playerUIBoard.children][event.coords[1] * this.BOARD_SIZE + event.coords[0]].classList.add("hit")
                        break
                    case 2:
                        //computer wins
                        this.#giveWin(this.#computer)
                        break
                    default:
                        //computer missed
                        //update UI board
                        [...this.playerUIBoard.children][event.coords[1] * this.BOARD_SIZE + event.coords[0]].classList.add("miss")
                        break
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
                    const orientation = event.orientation
                    const startCoord = orientation === "down" || orientation === "up" ? event.coords[1] : event.coords[0]   
                    const endpoint = orientation === "down" || orientation === "right" ? Math.min(this.BOARD_SIZE, startCoord + event.ship.game_logic.length) 
                    : Math.max(0, startCoord - event.ship.game_logic.length + 1) 
                    clearCells()
                    switch (orientation) {
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


                } else {
                    event.ship.ui.container.style.position = "static"
                    event.ship.ui.container.style.transition = "none"
                    event.ship.ui.container.style.transform = `rotate(0deg)`
                    event.ship.ui.container.style.pointerEvents = "auto";
                }
            } 
        }

        if (event.event_type === "game_win") {
            this.#winner = event.winner
            this.#changeText(`${this.#winner === "p" ? "Player" : "Computer"} wins`)
            this.#observer.notifyObservers({event_type: "reset"})
        }

        if (event.event_type === "reset") {
                //reset uiBoard
                const [playerUIBoard, computerUIBoard] = this.#createUIBoardElement()
                this.boardContainer.replaceChild(playerUIBoard, this.playerUIBoard)
                this.playerUIBoard = playerUIBoard
                
                this.boardContainer.replaceChild(computerUIBoard, this.computerUIBoard)
                this.computerUIBoard = computerUIBoard
                
                //reset ships
                this.#playerShips.forEach((x, j) => {
                    const newShip = document.createElement("div")
                    newShip.dataset.index = j
                    for (let i = 0; i < x.game_logic.length; i++) {
                        let newPeg = document.createElement("div")
                        newPeg.classList.add("ship-peg")
                        newShip.appendChild(newPeg)
                    }
                    x.ui.reset(newShip)
                })
        }
    }


    
    #giveWin(winner) {
        const event = {
            event_type: "game_win",
            winner: winner.playerType
        }
        this.#observer.notifyObservers(event)
    }
    
    gameLoop() {
        //ship placement process
        //while there are unplaced ships, continue prompting the user to place them
        let unplaced = [...this.#playerShips]
        this.#playerShipPlacement(unplaced).then(x => {
            this.#computerShipPlacement(this.#computerShips)
            this.#takeTurns()  
        })        
    }
    
    #takeTurns() {
        //while there is no winner continue to take shots
        if (this.#winner) {
            this.#winner = undefined
                // console.log("repeat")
                this.gameLoop()
        }
        this.#makePlayerShot().then(x =>{
            // this.#makeComputerShot()
            this.#takeTurns()
        })
    }

    /**
     * Place ships randomly
     */
    #computerShipPlacement(unplacedShips) {
        while (unplacedShips.length > 0) {
            const orientationMapping = {
                1: "down",
                2: "left",
                3: "up",
                4: "right"
            }

            let orientation = orientationMapping[Math.floor(Math.random() * 4) + 1]
            let positions = this.#getValidPositions(unplacedShips[unplacedShips.length - 1]["game_logic"], orientation)
            const coords = positions[Math.floor(Math.random() * positions.length)]
            const result = this.#placeShip(this.#computer, unplacedShips[unplacedShips.length - 1]["ui"].container, coords, orientation)
            unplacedShips.pop()
        }

    }


    #getValidPositions(ship, orientation) {
        const validPositions = [];
        //highly inefficient ;PPP
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {    
                if (this.#computer.gameBoard.isInBounds(ship, [x, y], orientation) && !this.#computer.gameBoard.willOverlap(ship, [x, y], orientation)) 
                    validPositions.push([x, y]);
            }
        }
    
        return validPositions;
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
        if (unselectedShips.length === 0) {
            return new Promise((resolve) => {
                resolve()
            })
        }
        this.#changeText("Click on a ship to select")
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
                    resolve(ele)
                })
                
            })
            
        }
        
        //wait until the user selects a ship
        //get 1st ship to be clicked
        const shipPromiseList = unselectedShips.map((x) => {
            
            return selectElement(x["ui"].container)
        })

        // unselectedShips.forEach(x => console.log(x.ui))
        
        let rotation_count = 0
        
        const selectedShip = await Promise.race(shipPromiseList)
        let orientation = "down"

        this.#changeText("Drag ship to valid cell on board and click to place \nRmb to rotate, d to deselect ship")
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
                    classtoApply = this.BOARD_SIZE >= startCoord + this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length &&!this.#player.gameBoard.willOverlap(this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"], [parseInt(event.target.dataset.x), parseInt(event.target.dataset.y)], orientation) ? "valid-sillhouette" : "invalid-sillhouette"
                else 
                    classtoApply = 0 <= startCoord - this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length + 1 && !this.#player.gameBoard.willOverlap(this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"], [parseInt(event.target.dataset.x), parseInt(event.target.dataset.y)], orientation) ? "valid-sillhouette" : "invalid-sillhouette"
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
            let classtoApply
            if ( orientation === "down" || orientation === "right")
                classtoApply = this.BOARD_SIZE >= startCoord + this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length && !this.#player.gameBoard.willOverlap(this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"], [parseInt(e.target.dataset.x), parseInt(e.target.dataset.y)], orientation) ? "valid-sillhouette" : "invalid-sillhouette"
            else 
                classtoApply = 0 <= startCoord - this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"].length + 1 && !this.#player.gameBoard.willOverlap(this.#playerShips[parseInt(selectedShip.dataset.index)]["game_logic"], [parseInt(e.target.dataset.x), parseInt(e.target.dataset.y)], orientation) ? "valid-sillhouette" : "invalid-sillhouette"
            switch (orientation) {
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
                selectedShip.style.pointerEvents = "auto";
                [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseover", cellSillhouette));
                [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseleave", clearCells));
                return this.#playerShipPlacement(unselectedShips)
            }
        }
        

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
        const placementSuccess = this.#placeShip(this.#player, selectedShip, [parseInt(selectedCell.dataset.x), parseInt(selectedCell.dataset.y)], orientation)
        //ship placement success
        document.removeEventListener("contextmenu", preventDefault)
        document.removeEventListener("mousedown", rightClickListener)
        document.removeEventListener("keydown", deselectShip)
        document.removeEventListener('mousemove', followingFunc);
        [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseover", cellSillhouette));
        [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseleave", clearCells))
        if (placementSuccess)
            unselectedShips = unselectedShips.filter((x) => x["ui"].container != selectedShip)
        selectedShip.classList.remove("selected")
        this.#isActiveShipSelection = false
        return this.#playerShipPlacement(unselectedShips)
    }

    async #makePlayerShot() {
        //get where the player wants to shoot
        this.#changeText("Select a square to shoot")
        const selectElement = (ele) => {
            return new Promise((resolve) => {
                ele.addEventListener("click", () => {
                    resolve(ele)
                })  
            })
        }

        const unselectedCells = [...this.computerUIBoard.children].filter(x => {
            let classlist = [...x.classList]
            return !(classlist.includes("hit") || classlist.includes("miss")) 
        })
        const promiseList = unselectedCells.map(x => selectElement(x))
        const selectedCell = await Promise.race(promiseList)
        const result = this.#recieveAttack(this.#computer, [parseInt(selectedCell.dataset.x), parseInt(selectedCell.dataset.y)])
        return new Promise((resolve) => resolve([this.#computer, this.selectedCell]))
    }

    #makeComputerShot() {
        const unselectedCells = [...this.computerUIBoard.children].filter(x => !([...x.classList].includes("miss") || [...x.classList].includes("hit")))
        const selectedCell = unselectedCells[Math.floor(Math.random() * unselectedCells.length)]
        this.#recieveAttack(this.#player, [parseInt(selectedCell.dataset.x), parseInt(selectedCell.dataset.y)])
    }
    
    /**
     * Change instruction text meant to notify the user
     * @param {String} message the message to display to user
     */
    #changeText(textEle) {
        this.#instructionText.textContent = textEle
    }

    #placeShip(player, ship, coords, orientation) {
        ship = player.playerType === "p" ? this.#playerShips[ship.dataset.index] : this.#computerShips[ship.dataset.index] 
        const event = {
            "event_type": "place_ship",
            "player": player, 
            "ship": ship,
            "coords": coords,
            "orientation": orientation
        }
        this.#observer.placeShip(player, event)
        return event.result
    }
 
    #recieveAttack(player, coords) {
        const event = {
            "event_type": "attack",
            "player": player, 
            "coords": coords,
        }
        this.#observer.recieveAttack(player, event)
        return event.result
    }
}

export default GameCoordinator;