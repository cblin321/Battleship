class Ship {
    constructor(length) {
        this.hits = 0
        this.length = length
        this.sunk = this.hits === this.length
    }

    hit() {
        this.hits++
    }

    isSunk() {
        return this.hits === this.length
    }

}

export default Ship