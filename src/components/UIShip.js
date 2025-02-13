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
            if (i != this.length - 1) {
                peg.style.borderRight = "none"
                console.log(peg)
            }
        }
        this.container.classList.add("peg-container")
    }

    removeBorder() {
        this.pegs.forEach(x => x.classList.add("placed"))
    }

    reset(newContainer) {
        this.container.replaceWith(newContainer)
        this.container = newContainer
        this.pegs = [...this.container.children]
    }

}

export default UIShip