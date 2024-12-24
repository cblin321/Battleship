class Gameboard {
    #currId = 0;
    constructor(sideLength) {
        //2 sideLength x sideLength matrices
        this.ship_grid = Array(sideLength).fill().map(() => Array(sideLength).fill(false));
        this.shots = Array(sideLength).fill().map(() => Array(sideLength).fill(-1));
        this.ships = [];
        
    }

    /**
     * Function to place a ship on this gameboard instance
     * @param {Ship} ship ship to place, should have no damage 
     * @param {Array} coords expects in (x, y) 
     * @param {String} orientation indicates where the ship's length will point  
     */
    placeShip(ship, coords, orientation) {
        if (!this.#isInBounds(ship, coords, orientation) && this.#inBoard(coords))
            throw new Error("Ship out of bounds")

        if (this.#willOverlap(ship, coords, orientation)) {
            throw new Error("Ship will overlap with other ships")
        }
        
        this.ships.push(ship)
        this.#fillGridWithShip(ship, coords, orientation)
        this.#currId++
    }

    #fillGridWithShip(ship, coords, orientation) {
        
        if (orientation === "left")
            this.ship_grid[coords[0]].fill(this.#currId, coords[1] - ship.length, coords[1])
        
        if (orientation === "right")
            this.ship_grid[coords[0]].fill(this.#currId, coords[1], coords[1] + ship.length)
        
        if (orientation === "up") {
            for (let i = coords[1] - ship.length; i < coords[1]; i++)
                this.ship_grid[i][coords[0]] = this.#currId;
        }

        if (orientation === "down") {
            for (let i = coords[1] + ship.length; i >= coords[1] ; i--)
                this.ship_grid[i][coords[0]] = this.#currId;
        }
    }

    #isInBounds(ship, coords, orientation) {
        //TODO overlapping ships
        switch(orientation) {
            case "left":
                return 0 > coords[0] - ship.length 
            case "right":
                return this.ship_grid.length > coords[0] + ship.length
            case "up":
                0 > coords[1] - ship.length
            case "down":
                return this.ship_grid.length > coords[1] + ship.length
        }
    } 

    #willOverlap(ship, coords, orientation) {
        if (orientation === "down") {
            for (let i = coords[1] + ship.length; i >= coords[1] ; i--)
                    if (this.ship_grid[i][coords[0]])
                        return false
        }

        if (orientation === "up") {
            for (let i = coords[1] - ship.length; i < coords[1]; i++)
                    if (this.ship_grid[i][coords[0]])
                        return false
        } 

        if (orientation === "left") {
            for (let i = coords[0] - ship.length; i < coords[0]; i++)
                if (this.ship_grid[coords[0]][i])
                    return false
        }

        if (orientation === "right") {
            for (let i = coords[0] - ship.length; i >= coords[0]; i--)
                if (this.ship_grid[coords[0]][i])
                    return false
        }
        
    }

    #inBoard(coords) {
        return coords[0] < this.ship_grid.length && coords[0] >= 0 &&
            coords[1] < this.ship_grid.length && coords[1] >= 0
    }


}

export default Gameboard