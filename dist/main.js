/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/GameCoordinator.js":
/*!*******************************************!*\
  !*** ./src/components/GameCoordinator.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _game_logic_Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game_logic/Player */ \"./src/game_logic/Player.js\");\n/* harmony import */ var _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../game_logic/Ship */ \"./src/game_logic/Ship.js\");\n/* harmony import */ var _GameObserver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameObserver */ \"./src/components/GameObserver.js\");\n/* harmony import */ var _UIShip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UIShip */ \"./src/components/UIShip.js\");\n/* harmony import */ var _UIShip__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_UIShip__WEBPACK_IMPORTED_MODULE_3__);\n\r\n\r\n\r\n\r\nclass GameCoordinator {\r\n\r\n    BOARD_SIZE = 10\r\n    \r\n    #isPlayerTurn\r\n    #isActiveShipSelection\r\n    \r\n    #player = new _game_logic_Player__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"p\", BOARD_SIZE)\r\n    #computer = new _game_logic_Player__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"c\", BOARD_SIZE)\r\n    \r\n    #playerShips = [{\"game_logic\": new _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](5), \"ui\": new (_UIShip__WEBPACK_IMPORTED_MODULE_3___default())(5)}, \r\n        {\"game_logic\": new _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](4), \"ui\": new (_UIShip__WEBPACK_IMPORTED_MODULE_3___default())(4)}, \r\n        {\"game_logic\": new _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](3), \"ui\": new (_UIShip__WEBPACK_IMPORTED_MODULE_3___default())(3)}, \r\n        {\"game_logic\": new _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](3), \"ui\": new (_UIShip__WEBPACK_IMPORTED_MODULE_3___default())(3)}, \r\n        {\"game_logic\": new _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](2), \"ui\": new (_UIShip__WEBPACK_IMPORTED_MODULE_3___default())(2)},\r\n    ]\r\n    #computerShips = [{\"game_logic\": new _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](5), \"ui\": new (_UIShip__WEBPACK_IMPORTED_MODULE_3___default())(5)}, \r\n        {\"game_logic\": new _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](4), \"ui\": new (_UIShip__WEBPACK_IMPORTED_MODULE_3___default())(4)}, \r\n        {\"game_logic\": new _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](3), \"ui\": new (_UIShip__WEBPACK_IMPORTED_MODULE_3___default())(3)}, \r\n        {\"game_logic\": new _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](3), \"ui\": new (_UIShip__WEBPACK_IMPORTED_MODULE_3___default())(3)}, \r\n        {\"game_logic\": new _game_logic_Ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](2), \"ui\": new (_UIShip__WEBPACK_IMPORTED_MODULE_3___default())(2)},\r\n    ]\r\n    \r\n    playerUIBoard\r\n    computerUIBoard \r\n\r\n    #observer = new _GameObserver__WEBPACK_IMPORTED_MODULE_2__[\"default\"]([this.#player, this.#computer, this])\r\n\r\n    constructor() {\r\n        this.#createUIBoardElement()\r\n    }\r\n\r\n    #playerShot = (e) => {\r\n        if (turn) {\r\n            const x = e.target.x   \r\n            const y = e.target.y   \r\n            \r\n            const event = {\r\n                event_type: \"attack\",\r\n                isPlayerTurn: this.#isPlayerTurn,\r\n                coords: [x, y],\r\n                result: undefined\r\n            } \r\n\r\n\r\n            this.#observer.playerShot(this.#computer, event)\r\n\r\n        }\r\n\r\n        e.target.removeEventListener(\"click\", this.#playerShot)\r\n    }\r\n    \r\n    /**\r\n     * Initialize the HTML board elements\r\n     */\r\n    #createUIBoardElement() {\r\n        this.playerUIBoard = document.createElement(\"div\")\r\n        this.computerUIBoard = document.createElement(\"div\") \r\n        for (let i = 0; i < this.BOARD_SIZE; i++)\r\n            for (let j = 0; j < this.BOARD_SIZE; j++) {\r\n                const playerCell = document.createElement(\"div\")\r\n                const computerCell = document.createElement(\"div\")\r\n                \r\n                computerCell.classList.add(\"computer-cell\")\r\n                playerCell.classList.add(\"player-cell\")\r\n\r\n                playerCell.addEventListener(\"click\", () => {\r\n\r\n                })\r\n\r\n                computerCell.x = j\r\n                computerCell.y = i\r\n                playerCell.x = j\r\n                playerCell.y = i\r\n\r\n                \r\n                this.playerUIBoard.appendChild(playerCell)\r\n                this.computerUIBoard.appendChild(computerCell)\r\n            }\r\n    }\r\n\r\n    /**\r\n     * Updates UI based on game logic\r\n     * @param {Object} event \r\n     */\r\n    #update(event) {\r\n        if (event.event_type === \"attack\") {\r\n            if (this.#isPlayerTurn) {\r\n                switch (event.result) {\r\n                    case 1:\r\n                        //player hit computer ship\r\n                        //update UI board\r\n\r\n                    case 2:\r\n                        //player wins\r\n                        \r\n                    default:\r\n                        //player missed\r\n                        //update UI board\r\n                    }\r\n\r\n            } else {\r\n                switch (event.result) {\r\n                    case 1:\r\n                        //computer hit player ship\r\n                        //update UI board\r\n                    case 2:\r\n                        //computer wins\r\n\r\n                    default:\r\n                        //computer missed\r\n                        //update UI board\r\n                }\r\n            }\r\n        }\r\n\r\n        if (event.event_type === \"place_ship\") {\r\n            if (this.#isPlayerTurn) {\r\n                if (event.result) {\r\n                    //TODO display placed ship\r\n                } else {\r\n                    //TODO notify the user of error\r\n                    //TODO deselect ship\r\n                }\r\n            }\r\n        }\r\n    }\r\n\r\n    \r\n    #giveWin(winner) {\r\n        const event = {\r\n            event_type: \"game_win\",\r\n            winner: \"\"\r\n        }\r\n        this.#observer.notifyObservers()\r\n    }\r\n    \r\n    gameLoop() {\r\n        //ship placement process\r\n            //while there are unplaced ships, continue prompting the user to place them\r\n\r\n        \r\n    }\r\n    \r\n    async #playerShipPlacement() {\r\n        \r\n        //TODO notify the user to select a ship\r\n        this.#playerShips.forEach((x) => x.classList.remove(\"selected\"))\r\n        \r\n        \r\n        const selectElement = (ele) => {\r\n            return new Promise((resolve) => {\r\n                const clickHandler = () => {\r\n                    resolve(ele); // Resolve with the clicked element\r\n                    ele.removeEventListener(\"click\", clickHandler); // Remove listener after selection\r\n                }\r\n                ele.addEventListener(\"click\", clickHandler)\r\n            })\r\n        }\r\n\r\n        const deselectShip =  (e) => {\r\n            if (e.key === \"d\" || e.key === \"D\") {\r\n                //event listener cleanup\r\n                document.removeEventListener(\"mousedown\", rightClickListener);\r\n                // this.#playerShips.forEach((x) => x[\"ui\"].remove(\"click\", selectElement))\r\n                document.removeEventListener(\"keydown\", deselectShip);\r\n                //restart playerSelection Process\r\n                this.#isActiveShipSelection = true\r\n                this.#playerShipPlacement()\r\n            }\r\n        }\r\n        \r\n        \r\n        \r\n        //wait until the user selects a ship\r\n        //get 1st ship to be clicked\r\n        const shipPromiseList = this.#playerShips.map((x) => selectElement(x[\"ui\"]))\r\n        \r\n        let ORIENTATIONS = [0, 90, 180, 270]\r\n        let orientation_index = 1\r\n        \r\n        const selectedShip = await Promise.race(shipPromiseList)\r\n        selectedShip[\"ui\"].classList.add(\"selected\")\r\n        //TODO notify user to ship selection controls:\r\n        //right clicking to rotate ship\r\n        //presss d to selected current ship, restart selection (recursion)\r\n        \r\n        document.addEventListener(\"mousedown\", (event) => {\r\n            if (event.button === 2) {  \r\n                orientation_index = (orientation_index + 1) % ORIENTATIONS.length\r\n                selectedShip[\"ui\"].style.transform = `rotate(${ORIENTATIONS[orientation_index]}deg)`\r\n            }\r\n        });\r\n        \r\n        document.addEventListener(\"keydown\", (e) => deselectShip(e))\r\n        \r\n        //ship selection is over for current ship\r\n        if (!this.#isActiveShipSelection)\r\n            return\r\n        \r\n        //TODO notify the user to select a cell\r\n        \r\n        //selected ship will be placed on the cell the mouse is over and if the cell is clicked\r\n        \r\n        //TODO have a silhouette of where the ship will be\r\n        const cellPromiseList = [...this.playerUIBoard.children].map((x) => selectElement(x))\r\n        const selectedCell = await Promise.race(cellPromiseList)\r\n        \r\n        this.#placeShip(this.#player, selectedShip, [selectedCell[\"ui\"].x, selectedCell[\"ui\"].y])\r\n        \r\n        //ship placement success\r\n        document.removeEventListener(\"keydown\", deselectShip);\r\n        this.#isActiveShipSelection = false\r\n        \r\n    }\r\n    \r\n    #placeShip(player, ship, coords, orientation) {\r\n        if (player === \"p\") {\r\n            const event = {\r\n                \"player\": player, \r\n                \"ship\": ship,\r\n                \"coords\": coords,\r\n                \"orientation\": orientation\r\n            }\r\n            this.#observer.placeShip(event)\r\n        }\r\n    \r\n    }\r\n    \r\n}\r\n\r\n\r\n\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({playerBoard, computerBoard});\n\n//# sourceURL=webpack://battleship/./src/components/GameCoordinator.js?");

/***/ }),

/***/ "./src/components/GameObserver.js":
/*!****************************************!*\
  !*** ./src/components/GameObserver.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n//mediator class - mediates actions that happen on the frontend with the backend\r\nclass GameMediator {\r\n\r\n    #observers = []\r\n\r\n    constructor(observers) {\r\n        this.#observers = observers\r\n    }\r\n\r\n    notifyObservers(event) {\r\n        this.#observers.forEach(x => x.update(event))\r\n    }\r\n\r\n    playerShot(player, event) {\r\n        event.result = player.recieveAttack(event.coords)\r\n        this.notifyObservers(event) \r\n    }\r\n\r\n    placeShip(player, event) {\r\n        event.result = player.placeShip(event.coords)\r\n        this.notifyObservers(event)\r\n    }\r\n\r\n    addObserver(observer) {\r\n        this.#observers = [...this.#observers, observer]\r\n    }\r\n    \r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameMediator);\n\n//# sourceURL=webpack://battleship/./src/components/GameObserver.js?");

/***/ }),

/***/ "./src/components/UIShip.js":
/*!**********************************!*\
  !*** ./src/components/UIShip.js ***!
  \**********************************/
/***/ (() => {

eval("class UIShip {\r\n    container = document.createElement(\"div\")\r\n    pegs = []\r\n    length\r\n\r\n    constructor(length) {\r\n        this.length = length\r\n    }\r\n\r\n    #createPegs() {\r\n        for (let i = 0; i < this.length; i++) {\r\n            let peg = document.createElement(\"div\") \r\n            this.container.appendChild(peg)\r\n            this.pegs.push(peg)\r\n        }\r\n    }\r\n\r\n    recieveAttack() {\r\n        \r\n    }\r\n\r\n    sunk() {\r\n\r\n    }\r\n\r\n\r\n\r\n}\n\n//# sourceURL=webpack://battleship/./src/components/UIShip.js?");

/***/ }),

/***/ "./src/game_logic/Player.js":
/*!**********************************!*\
  !*** ./src/game_logic/Player.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Player {\r\n    playerType\r\n    #gameBoard\r\n    constructor(type, sideLength) {\r\n        this.playerType = type\r\n        this.#gameBoard = new Gameboard(sideLength)\r\n    }\r\n\r\n    update(event) {\r\n        //reset in event of game end\r\n        //recieve attack\r\n    }\r\n\r\n    placeShip(coords) {\r\n        return this.#gameBoard.placeShip(coords)\r\n    }\r\n\r\n    recieveAttack(coords) {\r\n\r\n    }\r\n\r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);\n\n//# sourceURL=webpack://battleship/./src/game_logic/Player.js?");

/***/ }),

/***/ "./src/game_logic/Ship.js":
/*!********************************!*\
  !*** ./src/game_logic/Ship.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Ship {\r\n    constructor(length) {\r\n        this.hits = 0\r\n        this.length = length\r\n    }\r\n\r\n    hit() {\r\n        this.hits++\r\n    }\r\n\r\n    isSunk() {\r\n        return this.hits === this.length\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);\n\n//# sourceURL=webpack://battleship/./src/game_logic/Ship.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_GameCoordinator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/GameCoordinator */ \"./src/components/GameCoordinator.js\");\n\r\n\r\nconst test = document.createElement(\"p\")\r\ntest.textContent = \"hi\"\r\ndocument.body.appendChild(test)\r\nconst test2 = document.createElement(\"p\")\r\ntest2.textContent = \"hi2\"\r\ndocument.body.appendChild(test2)\r\n\r\nconst GC = new _components_GameCoordinator__WEBPACK_IMPORTED_MODULE_0__[\"default\"]()\r\n\r\ndocument.body.appendChild(GC.playerUIBoard)\r\ndocument.body.appendChild(GC.computerUIBoard)\r\n\n\n//# sourceURL=webpack://battleship/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;