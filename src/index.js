import GameCoordinator from "./components/GameCoordinator"
import "./styles.css"

const playerShipContainer = document.createElement("div")
const computerShipContainer = document.createElement("div") 
const playerShipLabel = document.createElement("p")
const boardContainer = document.createElement("div")
const instructionText = document.createElement("p")

const GC = new GameCoordinator(playerShipContainer, computerShipContainer, boardContainer, instructionText)

playerShipLabel.textContent = "player ships"



boardContainer.appendChild(GC.playerUIBoard)
boardContainer.appendChild(GC.computerUIBoard)

document.body.appendChild(instructionText)
document.body.appendChild(playerShipLabel)
document.body.appendChild(playerShipContainer)
document.body.appendChild(computerShipContainer)

document.body.appendChild(boardContainer)

GC.gameLoop()