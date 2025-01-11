const acceleration = 1.5 

const selectElement = (ele) => {
    return new Promise((resolve) => {
        ele.addEventListener("click", () => resolve(ele))
        
    })
    
}

const orientationMapping = {
    1: "down",
    2: "left",
    3: "up",
    4: "right"
}

const preventDefault = (event) => {
    event.preventDefault()         

}

export {acceleration, preventDefault, orientationMapping, selectElement}