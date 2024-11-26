import Ship from "./Ship.js"
import {describe, expect, test} from '@jest/globals'

test("Sunk Test", () => {
    const ship = new Ship(5);
    expect(ship.isSunk()).toBeFalsy();
})

test("Hit Test (don't sink ship)", () => {
    const ship = new Ship(5);
    ship.hit()
    ship.hit()
    ship.hit()
    ship.hit()
    expect(ship.isSunk()).toBeFalsy();
})

test("Hit Test (sink ship)", () => {
    const ship = new Ship(5);
    ship.hit()
    ship.hit()
    ship.hit()
    ship.hit()
    ship.hit()
    expect(ship.isSunk()).toBeTruthy();
})
