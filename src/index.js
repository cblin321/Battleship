import GameCoordinator from "./components/GameCoordinator"
import "./styles.css"

const playerShipContainer = document.createElement("div")
const computerShipContainer = document.createElement("div") 

const GC = new GameCoordinator(playerShipContainer, computerShipContainer)

const boardContainer = document.createElement("div")

boardContainer.classList.add("board-container")

boardContainer.appendChild(GC.playerUIBoard)
boardContainer.appendChild(GC.computerUIBoard)

document.body.appendChild(playerShipContainer)
document.body.appendChild(computerShipContainer)

document.body.appendChild(boardContainer)