import Player from "../game_logic/Player"
import Ship from "../game_logic/Ship"
import GameObserver from "./GameObserver"
import UIShip from "./UIShip"
class GameCoordinator {

    BOARD_SIZE = 10

    ORIENTATION_MAPPING = {
        1: "right",
        2: "down",
        3: "left",
        4: "up"
    }
    
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

    constructor(playerShipContainer, boardContainer, instructionText) {
        boardContainer.classList.add("board-container");
        playerShipContainer.classList.add("ship-container");
        [this.playerUIBoard, this.computerUIBoard] = this.#createUIBoardElement()
        boardContainer.appendChild(this.playerUIBoard)
        boardContainer.appendChild(this.computerUIBoard)
        this.#computerShips.forEach((x, i) => {
            x["ui"].container.dataset.index = i
        })
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
                if (event.result !== 2)  {
                    //player hit computer ship
                    [...this.computerUIBoard.children][event.coords[1] * this.BOARD_SIZE + event.coords[0]].classList.add(event.result === 1 ? "hit" : "miss")
                }
                else 
                    //player wins
                    this.#giveWin(this.#player)
            }   else {
                if (event.result !== 2) {
                    //computer hit player ship
                    [...this.playerUIBoard.children][event.coords[1] * this.BOARD_SIZE + event.coords[0]].classList.add(event.result === 1 ? "hit" : "miss")
                }
                else     
                    //player wins
                    this.#giveWin(this.#computer)
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
                    this.#getCells([parseInt(event.coords[0]), parseInt(event.coords[1])], orientation, endpoint).forEach(x => x.classList.add("placed"))
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
            const splashScreen = this.#createSplashScreen(["You", this.#winner === "p" ? "Win!" : "Lose"])
            splashScreen.classList.add(this.#winner === "p" ? "win" : "lose")
            this.#observer.notifyObservers({event_type: "reset"})
        }

        if (event.event_type === "reset") {
                //reset uiBoard
                const [playerUIBoard, computerUIBoard] = this.#createUIBoardElement();
                this.playerUIBoard.replaceWith(playerUIBoard);
                this.playerUIBoard = playerUIBoard;
                
                this.computerUIBoard.replaceWith(computerUIBoard);
                this.computerUIBoard = computerUIBoard
                
                //reset ships
                this.#playerShips.forEach((x, j) => {
                    const newShip = document.createElement("div")
                    newShip.classList.add("peg-container")
                    newShip.dataset.index = j
                    for (let i = 0; i < x.game_logic.length; i++) {
                        let newPeg = document.createElement("div")
                        newPeg.classList.add("ship-peg")
                        newShip.appendChild(newPeg)
                    }
                    x.ui.reset(newShip)
                    x.game_logic.hits = 0
                })

                this.#computerShips.forEach(x => {
                    x.game_logic.hits = 0
                })
                
        }
    }


    #createSplashScreen(words) {
        const splashContainer = document.createElement("div")
        splashContainer.classList.add("splash-container")

        words.forEach(x => {
            const ele = document.createElement("span")
            ele.classList.add("title")
            ele.textContent = x

            splashContainer.appendChild(ele)
        })

        splashContainer.addEventListener("animationend", (e) => {
            if (e.animationName === "lift")
                splashContainer.remove()
        })
        document.body.prepend(splashContainer)

        return splashContainer
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
        let unplacedPlayer = [...this.#playerShips]
        let unplacedComputer = [...this.#computerShips]
        this.#playerShipPlacement(unplacedPlayer).then(x => {
            this.#computerShipPlacement(unplacedComputer)
            this.#takeTurns()  
        })        
    }
    
    #takeTurns() {
        //while there is no winner continue to take shots
        this.#makePlayerShot().then(x =>{
            if (this.#winner) {
                this.#winner = undefined
                this.gameLoop()
                return
            }
            this.#makeComputerShot()
            if (this.#winner) {
                this.#winner = undefined
                this.gameLoop()
                return
            }
            this.#takeTurns()
        })
    }

    #computerShipPlacement(unplacedShips) {
        while (unplacedShips.length > 0) {
            let orientation = this.ORIENTATION_MAPPING[Math.floor(Math.random() * 4) + 1]
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
    
    #selectElement(ele) {
        return new Promise((resolve) => {
            ele.addEventListener("click", () => {
                resolve(ele)
            })
        })
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
        
        if (unselectedShips.length === 0) {
            return new Promise((resolve) => {
                resolve()
            })
        }
        this.#changeText("Click on a ship to select it")
        unselectedShips.forEach((x) => {
            x["ui"].container.classList.remove("selected")
        })
        
        let xPos = 0  
        let yPos = 0  
        let xVel = 0  
        let yVel = 0  
        const acceleration = 1.5 
        
        //wait until the user selects a ship
        //get 1st ship to be clicked
        const shipPromiseList = unselectedShips.map((x) => {
            
            return this.#selectElement(x["ui"].container)
        })

        
        let rotation_count = 0
        
        const selectedShip = await Promise.race(shipPromiseList)
        let orientation = "right"

        this.#changeText("Mouse over a valid cell and press LMB to place, RMB to rotate, d to deselect")
        
        const rightClickListener =  (event) => {
            if (event.button === 2) {  
                rotation_count++
                selectedShip.style.transition = "transform 0.08s ease"
                selectedShip.style.transformOrigin = 'calc(var(--cell-size) / 2) calc(var(--cell-size) / 2)'
                selectedShip.style.transform = `rotate(${90 * rotation_count}deg)`
                orientation = this.ORIENTATION_MAPPING[(rotation_count % 4) + 1]
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
                this.#getCells([parseInt(event.target.dataset.x), parseInt(event.target.dataset.y)], orientation, endpoint).forEach(x => x.classList.add(classtoApply))
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
                ele.style.left = `${mouseX - ele.offsetHeight / 2}px`
                ele.style.top = `${mouseY - ele.offsetHeight / 2}px`
                
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
            this.#getCells([parseInt(e.target.dataset.x), parseInt(e.target.dataset.y)], orientation, endpoint).forEach(x => x.classList.add(classtoApply))
        }

        const followingFunc = wrapper(selectedShip)

        selectedShip.classList.add("selected")
        document.addEventListener("mousedown", rightClickListener)
        let cellPromiseList = [...this.playerUIBoard.children].map((x) => this.#selectElement(x))
        let deselectShip
        let selectedCell
        let p = new Promise((resolve) => {
            deselectShip =  (e) => {

                if (selectedCell) {
                    document.removeEventListener("keydown", deselectShip) 
                    return
                }
                    
                if (e.key === "d" || e.key === "D") {
                    //event listener cleanup
                    document.removeEventListener("mousedown", rightClickListener)
                    selectedShip.classList.remove("selected")
                    document.removeEventListener("keydown", deselectShip)
                    document.removeEventListener("mousemove", followingFunc) // Remove listener after selection
                    selectedShip.style.position = "static"
                    document.removeEventListener("contextmenu", preventDefault)
                    const old_transition = JSON.parse(JSON.stringify(selectedShip.style.transition))
                    selectedShip.style.transition = "none"
                    selectedShip.style.transform = `rotate(0deg)`
                    selectedShip.style.transform = old_transition
                    selectedShip.style.pointerEvents = "auto";
                    [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseover", cellSillhouette));
                    [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseleave", clearCells));
                    [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseleave", this.#selectElement));
                    resolve("deselect")
                }
            }
            document.addEventListener("keydown", (e) => deselectShip(e));

        })

        cellPromiseList.push(p)
        

        document.addEventListener('contextmenu', preventDefault); 
        
        
        //selected ship will be placed on the cell the mouse is over and if the cell is clicked
        [...this.playerUIBoard.children].forEach(x => x.addEventListener("mouseover", cellSillhouette));
        [...this.playerUIBoard.children].forEach(x => x.addEventListener("mouseleave", clearCells))
        selectedCell = await Promise.race(cellPromiseList) 
        if (selectedCell === "deselect")     
            return this.#playerShipPlacement(unselectedShips)

        const placementSuccess = this.#placeShip(this.#player, selectedShip, [parseInt(selectedCell.dataset.x), parseInt(selectedCell.dataset.y)], orientation)
        document.removeEventListener("contextmenu", preventDefault)
        document.removeEventListener("mousedown", rightClickListener)
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'd',
            keyCode: 68,
            code: 'KeyD',
            which: 68,
            bubbles: true
        })) //remove revent listener        
        document.removeEventListener('mousemove', followingFunc);
        [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseover", cellSillhouette));
        [...this.playerUIBoard.children].forEach(x => x.removeEventListener("mouseleave", clearCells))
        if (placementSuccess)
            unselectedShips = unselectedShips.filter((x) => x["ui"].container != selectedShip)
        selectedShip.classList.remove("selected")
        return this.#playerShipPlacement(unselectedShips)
    }

    #getCells(coords, orientation, endpoint) {
        const x = coords[0]
        const y = coords[1]
        const cells = []
        switch (orientation) {
            case "down":
                for (let i = y; i < endpoint; i++)
                    cells.push(this.playerUIBoard.children[i * this.BOARD_SIZE + x])                 
                break
            case "up":
                for (let i = y; i >= endpoint; i--)
                    cells.push(this.playerUIBoard.children[i * this.BOARD_SIZE + x])
                break
            case "left":
                for (let i = x; i >= endpoint; i--)
                    cells.push(this.playerUIBoard.children[y * this.BOARD_SIZE + i])
                break
            case "right":
                for (let i = x; i < endpoint; i++)
                    cells.push(this.playerUIBoard.children[y * this.BOARD_SIZE + i])
                break
        }
        return cells
    }

    async #makePlayerShot() {
        if (this.#winner)
            return new Promise(resolve => resolve())
        //get where the player wants to shoot
        this.#changeText("Select a cell to shoot")

        const unselectedCells = [...this.computerUIBoard.children].filter(x => {
            let classlist = [...x.classList]
            return !(classlist.includes("hit") || classlist.includes("miss")) 
        })
        const promiseList = unselectedCells.map(x => this.#selectElement(x))
        const selectedCell = await Promise.race(promiseList);
        [...this.computerUIBoard.children].forEach(x => x.removeEventListener("click", this.#selectElement))
        this.#recieveAttack(this.#computer, [parseInt(selectedCell.dataset.x), parseInt(selectedCell.dataset.y)])
        return new Promise((resolve) => resolve([this.#computer, this.selectedCell]))
    }

    #makeComputerShot() {
        if (this.#winner) 
            return
        const unselectedCells = [...this.playerUIBoard.children].filter(x => !([...x.classList].includes("miss") || [...x.classList].includes("hit")))
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