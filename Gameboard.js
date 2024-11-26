class Gameboard {
    constructor(sideLength) {
        //2 sideLength x sideLength matrices
        this.ships = Array(sideLength).fill().map(() => Array(sideLength).fill(false));
        this.shots = Array(sideLength).fill().map(() => Array(sideLength).fill(false));
    }
}

export default Gameboard