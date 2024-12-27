import Gameboard from "./Gameboard.js"
import Ship from "./Ship.js"
import {beforeEach, describe, expect, test} from '@jest/globals'

describe("constructor & existence tester", () => {
    test("gameboard existence", () => expect(Gameboard).toBeTruthy())
    
    test("constructor tester", () => expect((() => {
        let board = new Gameboard(4)
        return [board.ship_grid, board.shots, board.ships] 
    })()).toEqual([Array(4).fill().map(() => Array(4).fill(false)), 
        Array(4).fill().map(() => Array(4).fill(false)), []
    ]))

})

describe("placeShip tester", () => {
    
    let ship = new Ship(4)
    let ship2 = new Ship(5)
    let ship3 = new Ship(3)
    let ship4 = new Ship(2)
    let board = new Gameboard(10)
    
    beforeEach(()=> {
        ship = new Ship(4)
        ship2 = new Ship(5)
        ship3 = new Ship(3)
        ship4 = new Ship(2)
        board = new Gameboard(10)
    })
    
    //working case (all orientations)
    test("working tester", () => {
        expect(board.placeShip(ship, [3, 4], "down")).toBeTruthy()
        expect(board.placeShip(ship2, [2, 6], "up")).toBeTruthy()
        expect(board.placeShip(ship3, [3, 8], "left")).toBeTruthy()
        expect(board.placeShip(ship4, [0, 0], "right")).toBeTruthy()

        const expectedGrid = Array(10).fill().map(() => Array(10).fill(false))
        for (let i = 4; i < 8; i++) 
            expectedGrid[i][3] = 1 
        
        for (let i = 2; i < 7; i++) 
            expectedGrid[i][2] = 2 
        
        for (let i = 1; i < 4; i++) 
            expectedGrid[8][i] = 3
        
        for (let i = 0; i < 2; i++) 
            expectedGrid[0][i] = 4 
        
        const expectedShots = Array(10).fill().map(() => Array(10).fill(false))
        
        const expectedShips = [ship, ship2, ship3, ship4]

        expect([board.ship_grid, board.shots, board.ships]).toEqual([expectedGrid, expectedShots, expectedShips])
        
        
    })
    
    //starting point oob (all orientations)
    test("starting coordinates out of bounds (negative x)", () => expect(board.placeShip(ship, [-1, 0], "down")).toBeFalsy()) 
    test("starting coordinates out of bounds (large x)", () => expect(board.placeShip(ship2, [10, 6], "up")).toBeFalsy())
    test("starting coordinates out of bounds (negative y)", () => expect(board.placeShip(ship3, [3, -3], "left")).toBeFalsy())
    test("starting coordinates out of bounds (large x)", () => expect(board.placeShip(ship4, [0, 10], "right")).toBeFalsy())
    
    //overlapping (all orientations)
    test("overlapping ships (right orientation)", () => {
        const existingShip = new Ship(5)
        const place = board.placeShip(existingShip, [5, 8], "up")
        expect(board.placeShip(ship, [2, 5], "right")).toBeFalsy()
    })
    test("overlapping ships (up orientation)", () => {
        const existingShip = new Ship(5)
        const place = board.placeShip(existingShip, [5, 0], "right")
        expect(board.placeShip(ship, [9, 3], "up")).toBeFalsy()
    })
    test("overlapping ships (left orientation)", () => {
        const existingShip = new Ship(5)
        board.placeShip(existingShip, [5, 0], "right")
        expect(board.placeShip(ship, [8, 0])).toBeFalsy()
    })
    test("overlapping ships (down orientation)", () => {
        const existingShip = new Ship(5)
        board.placeShip(existingShip, [5, 8], "right")
        expect(board.placeShip(ship, [9, 5])).toBeFalsy()
    })
    
    //out of board but contains pts in board (all orientaitons)
    test("oob but contains pts in board (up orientation)", () => {
        expect(board.placeShip(ship, [7,2], "up")).toBeFalsy()
    })
    test("oob but contains pts in board (down orientation)", () => {
        expect(board.placeShip(ship, [3, 8])).toBeFalsy()
    })
    test("oob but contains pts in board (left orientation)", () => {
        expect(board.placeShip(ship, [2, 0])).toBeFalsy()
    })
    test("oob but contains pts in board (right orientation)", () => {
        expect(board.placeShip(ship, [0, 8])).toBeFalsy()
    })

    //test recieveAttack
    test("missed attacks", () => {
        const existingShip = new Ship(5)
        board.placeShip(existingShip, [5, 8], "right")
        expect(board.recieveAttack([9, 9])).toEqual(-1)
        expect(board.shots[9][9]).toEqual(-1)
        expect(board.recieveAttack([6, 4])).toEqual(-1)
        expect(board.shots[4][6]).toEqual(-1)
        expect(board.recieveAttack([4, 8])).toEqual(-1)
        expect(board.shots[8][4]).toEqual(-1)
    })

    test("invalid attacks", () => {
        const existingShip = new Ship(5)
        board.placeShip(existingShip, [5, 8], "right")
        expect(board.recieveAttack([9, 9])).toEqual(-1)
        expect(board.recieveAttack([20, 10])).toEqual(0)
        expect(board.shots[9][9]).toEqual(-1)
        expect(board.recieveAttack([9, 9])).toEqual(0)
        expect(board.shots[9][9]).toEqual(-1)
    })

    test("hits", () => {
        const existingShip = new Ship(5)
        board.placeShip(ship, [4, 6], "right")
        board.placeShip(existingShip, [5, 8], "right")
        expect(board.recieveAttack([5, 8])).toEqual(1)
        expect(board.shots[8][5]).toEqual(2)
        expect(board.recieveAttack([9, 8])).toEqual(1)
        expect(board.shots[8][9]).toEqual(2)
        expect(existingShip.hits).toEqual(2)
        expect(ship.hits).toEqual(0)
    })

    test("sink one", () => {
        const existingShip = new Ship(5)
        board.placeShip(ship, [4, 6], "right")
        board.placeShip(existingShip, [5, 8], "right")
        for (let i = 5; i < existingShip.length + 5; i++) {
            expect(board.recieveAttack([i, 8])).toEqual(1)
            expect(board.shots[8][i]).toEqual(2)
            expect(existingShip.hits).toEqual(i - 4)            
        }
        expect(existingShip.isSunk()).toBeTruthy()
        expect(ship.hits).toEqual(0)
    })

    test("sink all", () => {
        const existingShip = new Ship(5)
        board.placeShip(ship, [4, 6], "right")
        board.placeShip(existingShip, [5, 8], "right")
        for (let i = 5; i < existingShip.length + 5; i++) {
            expect(board.recieveAttack([i, 8])).toEqual(1)
            expect(board.shots[8][i]).toEqual(2)
            expect(existingShip.hits).toEqual(i - 4)            
        }
        expect(existingShip.isSunk()).toBeTruthy()
        for (let i = 4; i < ship.length + 3; i++) {
            expect(board.recieveAttack([i, 6])).toEqual(1)
            expect(board.shots[6][i]).toEqual(1)
            expect(ship.hits).toEqual(i - 3)
        }
        expect(board.recieveAttack([7, 6])).toEqual(2)
        expect(board.shots[6][7]).toEqual(1)
        expect(ship.isSunk()).toBeTruthy()
        expect(ship.hits).toEqual(4)
    })
})