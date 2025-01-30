import GameCoordinator from "./components/GameCoordinator"
import "./styles.css"
const gameTitle = document.createElement("h1")
const playerShipContainer = document.createElement("div")
const computerShipContainer = document.createElement("div") 
const boardContainer = document.createElement("div")
const banner = document.createElement("nav")

const playerShipLabel = document.createElement("p")
const instructionText = document.createElement("p")
const playerBoardLabel = document.createElement("p")
const computerBoardLabel = document.createElement("p")

playerShipLabel.classList.add("header-text")
instructionText.classList.add("header-text")

gameTitle.textContent = "Battleship"

playerShipLabel.textContent = "Your Ships"
playerBoardLabel.textContent = "Your Board"

computerBoardLabel.textContent = "CPU Board"

const GC = new GameCoordinator(playerShipContainer, boardContainer, instructionText)



boardContainer.appendChild(playerBoardLabel)
boardContainer.appendChild(computerBoardLabel)
boardContainer.appendChild(GC.playerUIBoard)
boardContainer.appendChild(GC.computerUIBoard)

banner.appendChild(gameTitle)

document.body.appendChild(banner)
document.body.appendChild(instructionText)
// document.body.appendChild(computerShipContainer)

document.body.appendChild(boardContainer)
document.body.appendChild(playerShipLabel)
document.body.appendChild(playerShipContainer)

GC.gameLoop()