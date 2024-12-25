import Gameboard from "./Gameboard.js"
import Ship from "./Ship.js"
import {beforeEach, describe, expect, test} from '@jest/globals'

describe("constructor & existence tester", () => {
    test("gameboard existence", () => expect(Gameboard).toBeTruthy())
    
    test("constructor tester", () => expect((() => {
        let board = new Gameboard(4)
        return [board.ship_grid, board.shots, board.ships] 
    })()).toEqual([Array(4).fill().map(() => Array(4).fill(false)), 
        Array(4).fill().map(() => Array(4).fill(-1)), []
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
    test("working tester", () => expect((() => {
        //TODO refactor
        const place1 = board.placeShip(ship, [3, 4], "down") //3, 4 - 3, 8
        const place2 = board.placeShip(ship2, [2, 6], "up")
        const place3 = board.placeShip(ship3, [3, 8], "left")
        const place4 = board.placeShip(ship4, [0, 0], "right")
        return [place1, place2, place3, place4, board.ship_grid, board.shots, board.ships] 
    })()).toEqual((() => {
        const expectedGrid = Array(10).fill().map(() => Array(10).fill(false))
        for (let i = 4; i < 8; i++) 
            expectedGrid[i][3] = 0 
        
        for (let i = 2; i < 7; i++) 
            expectedGrid[i][2] = 1 
        
        for (let i = 1; i < 4; i++) 
            expectedGrid[8][i] = 2
        
        for (let i = 0; i < 2; i++) 
            expectedGrid[0][i] = 3 
        
        const expectedShots = Array(10).fill().map(() => Array(10).fill(-1))
        
        const expectedShips = [ship, ship2, ship3, ship4]
        
        return [true, true, true, true, expectedGrid, expectedShots, expectedShips]
    })()))
    
    //starting point oob (all orientations)
    test("starting coordinates out of bounds (negative x)", () => expect(() => board.placeShip(ship, [-1, 0], "down").toThrow("Ship out of bounds")).toThrow("Ship out of bounds"))
    test("starting coordinates out of bounds (large x)", () => expect(() => board.placeShip(ship2, [10, 6], "up")).toThrow("Ship out of bounds"))
    test("starting coordinates out of bounds (negative y)", () => expect(() => board.placeShip(ship3, [3, -3], "left")).toThrow("Ship out of bounds"))
    test("starting coordinates out of bounds (large x)", () => expect(() => board.placeShip(ship4, [0, 10], "right")).toThrow("Ship out of bounds"))
    
    //overlapping (all orientations)
    test("overlapping ships (down orientation)", () => {
        const existingShip = new Ship(10)
        board.placeShip(existingShip, [5, 0], "right")
        board.placeShip(ship, [8, 2])
    }).toThrow("Ship will overlap with other ships")

    test("overlapping ships (up orientation)", () => {
        const existingShip = new Ship(10)
        board.placeShip(existingShip, [5, 0], "right")
    })

    test("overlapping ships (left orientation)", () => {
        const existingShip = new Ship(10)
        board.placeShip(existingShip, [5, 0], "right")
    })

    test("overlapping ships (right orientation)", () => {
        const existingShip = new Ship(10)
        board.placeShip(existingShip, [5, 0], "right")
    })
    
    //out of board but contains pts in board (all orientaitons)
    test("oob but contains pts in board (up orientation)", () => {

    })
})