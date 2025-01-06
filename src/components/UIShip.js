class UIShip {
    container = document.createElement("div")
    pegs = []
    length

    constructor(length) {
        this.length = length
        for (let i = 0; i < this.length; i++) {
            let peg = document.createElement("div") 
            peg.classList.add("ship-peg")
            this.container.appendChild(peg)
            this.pegs.push(peg)
        }
    }

    recieveAttack() {

    }

    sunk() {

    }



}

export default UIShip