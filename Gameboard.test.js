import Gameboard from "./Gameboard.js"
import {describe, expect, test} from '@jest/globals'

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
    //oob (all orientations)
    //overlapping (all orientations)
    //out of board but contains pts in board (all orientaitons)
    //working case (all orientations)

    test("working case", () => {
        
    })
    test("starting coordinates out of bounds", () => {

    })
    test("overlapping ships",)
    test("oob but contains pts in board",)
})