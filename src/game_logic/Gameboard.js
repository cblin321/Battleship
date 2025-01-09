class Gameboard {
    #currId = 1;
    constructor(sideLength) {
        this.ship_grid = Array(sideLength).fill().map(() => Array(sideLength).fill(false)); //matrix to indicate ship placement
        this.shots = Array(sideLength).fill().map(() => Array(sideLength).fill(false)); //matrix to indicate missed/hit shots
        this.ships = []; //ship list
        
    }

    /**
     * Function to place a ship on this gameboard instance
     * @param {Ship} ship ship to place, should have no damage 
     * @param {Array} coords expects in (x, y) 
     * @param {String} orientation indicates where the ship's length will point  
     * @returns true if the ship was placed, false otherwise
    */
    placeShip(ship, coords, orientation) {
        if (!this.#isInBounds(ship, coords, orientation)) {
            return false
        }

        if (!this.#inBoard(coords))
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
                return this.ship_grid.length > coords[0] + (ship.length - 1)
            case "up":
                return 0 <= coords[1] - (ship.length - 1)
            case "down":
                return this.ship_grid.length > coords[1] + (ship.length - 1)
        }
    } 

    #willOverlap(ship, coords, orientation) {
        if (orientation === "down") {
            for (let i = coords[1] + (ship.length - 1); i >= coords[1] ; i--)
                    if (this.ship_grid[i][coords[0]])
                        return true
        }

        if (orientation === "up") {
            for (let i = coords[1] - (ship.length - 1); i < coords[1]; i++)
                    if (this.ship_grid[i][coords[0]])
                        return true
        } 

        if (orientation === "left") {
            for (let i = coords[0] - (ship.length - 1); i < coords[0]; i++)
                if (this.ship_grid[coords[1]][i])
                    return true
        }

        if (orientation === "right") {
            for (let i = coords[0] + (ship.length - 1); i >= coords[0]; i--)
                if (this.ship_grid[coords[1]][i]) {
                    return true
                }
        }
        
    }

    #inBoard(coords) {
        return coords[0] < this.ship_grid.length && coords[0] >= 0 &&
            coords[1] < this.ship_grid.length && coords[1] >= 0
    }

    recieveAttack(coords) {
        const x = coords[1]
        const y = coords[0]
        if (!this.#inBoard(coords) || this.shots[x][y]) {
            return 0
        }


        if (this.ship_grid[x][y]) {
            this.shots[x][y] = this.ship_grid[x][y] 
            const hitShip = this.ships[this.ship_grid[x][y] - 1] 
            hitShip.hit()
            if (hitShip.isSunk()) {
                if (this.ships.every((x) => x.isSunk()))
                    return 2
            }
            return 1
        } else {
            this.shots[x][y] = -1
            return -1
        }
    }

    update(event) {

    }

}

export default Gameboard