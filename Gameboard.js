class Gameboard {
    constructor(sideLength) {
        //2 sideLength x sideLength matrices
        this.ship_grid = Array(sideLength).fill().map(() => Array(sideLength).fill(false));
        this.shots = Array(sideLength).fill().map(() => Array(sideLength).fill(false));
    }

    /**
     * Function to place a ship on this gameboard instance
     * @param {Ship} ship ship to place 
     * @param {Array} coords expects in (x, y) 
     * @param {String} orientation indicates where the ship's length will point  
     */
    placeShip(ship, coords, orientation) {
        if (!this.#canFit(ship, coords, orientation) && this.#inBoard(coords))
            throw new Error("Cannot place ship here")

        

    }

    #canFit(ship, coords, orientation) {
        //TODO overlapping ships
        switch(orientation) {
            case "left":
                return 0 > coords[0] - this.ship_grid.length && this.ship_grid
            case "right":
                return this.ship_grid.length > coords[0] + this.ship_grid.length
            case "up":
                0 > coords[1] - ship.length
            case "down":
                return this.ship_grid.length > coords[1] + this.ship_grid.length
        }
    } 

    #willOverlap(ship, coords, orientation) {
        if (orientation === "down") {
            for (let i = coords[1]; i < coords[1] + ship.length; i++)
                    if (this.ship_grid[i][coords[0]])
                        return false
        }

        if (orientation === "up") {
            for (let i = coords[1]; i >= coords[1] - ship.length; i--)
                    if (this.ship_grid[i][coords[0]])
                        return false
        } 

        
    }

    #inBoard(coords) {
        return coords[0] < this.ship_grid.length && coords[0] >= 0 &&
            coords[1] < this.ship_grid.length && coords[1] >= 0
    }
}

export default Gameboard