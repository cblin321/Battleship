class Ship {
    constructor(length) {
        this.hits = 0
        this.length = length
    }

    hit() {
        this.hits++
    }

    isSunk() {
        return this.hits === this.length
    }

}

export default Ship