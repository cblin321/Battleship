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
     * @returns true if the ship was placed, false otherwise
    */
    placeShip(ship, coords, orientation) {
        if (!this.#isInBounds(ship, coords, orientation) || !this.#inBoard(coords))
            return false

        if (this.#willOverlap(ship, coords, orientation)) {
            return false
        }

        if (this.ships.includes(ship))
            return false
        
        this.ships.push(ship)
        this.#fillGridWithShip(ship, coords, orientation)
        this.#currId++
        return true
    }

    #fillGridWithShip(ship, coords, orientation) {
        
        if (orientation === "left")
            this.ship_grid[coords[1]].fill(this.#currId, coords[0] - (ship.length - 1), coords[0] + 1)
        
        if (orientation === "right")
            this.ship_grid[coords[1]].fill(this.#currId, coords[0], coords[0] + ship.length)
        
        if (orientation === "up") {
            for (let i = coords[1] - (ship.length - 1); i <= coords[1]; i++)
                this.ship_grid[i][coords[0]] = this.#currId;
        }

        if (orientation === "down") {
            for (let i = coords[1] + (ship.length - 1); i >= coords[1] ; i--)
                this.ship_grid[i][coords[0]] = this.#currId;
        }
    }

    /**
     * 
     * @param {*} ship 
     * @param {*} coords 
     * @param {*} orientation 
     * @returns 
     */
    #isInBounds(ship, coords, orientation) {
        //TODO overlapping ships
        switch(orientation) {
            case "left":
                return 0 <= coords[0] - (ship.length - 1) 
            case "right":
                return this.ship_grid.length >= coords[0] + (ship.length - 1)
            case "up":
                0 <= coords[1] - (ship.length - 1)
            case "down":
                return this.ship_grid.length >= coords[1] + (ship.length - 1)
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