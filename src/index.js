import GameCoordinator from "./components/GameCoordinator"
import "./styles.css"

const playerShipContainer = document.createElement("div")
const computerShipContainer = document.createElement("div") 
const boardContainer = document.createElement("div")

const playerShipLabel = document.createElement("p")
const instructionText = document.createElement("p")
const playerBoardLabel = document.createElement("p")
const computerBoardLabel = document.createElement("p")

playerShipLabel.textContent = "Your Ships"
playerBoardLabel.textContent = "Your Board"

computerBoardLabel.textContent = "CPU Board"

const GC = new GameCoordinator(playerShipContainer, computerShipContainer, boardContainer, instructionText)



boardContainer.appendChild(playerBoardLabel)
boardContainer.appendChild(computerBoardLabel)
boardContainer.appendChild(GC.playerUIBoard)
boardContainer.appendChild(GC.computerUIBoard)

document.body.appendChild(playerShipLabel)
document.body.appendChild(playerShipContainer)
document.body.appendChild(instructionText)
// document.body.appendChild(computerShipContainer)

document.body.appendChild(boardContainer)

GC.gameLoop()