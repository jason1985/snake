const BG_COLOUR = 'black'
const SNAKE_COLOUR = '#22b14c'
const FOOD_COLOUR = '#e66916'

const slider = document.getElementById('slider')
console.log(slider.value)

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 400
canvas.height = 400

function updateSlider() {
  init()
}

let interv
let FR = slider.value //frame rate 10 frames per second
const S = 20 // pixels per square size
const T = canvas.width / S // SCREEN SIZE

let pos, vel, food, snake

function init() {
  if (interv) {
    clearInterval(interv)
  }

  FR = slider.value
  pos = { x: 10, y: 10 }
  vel = { x: 0, y: 0 }

  snake = [
    { x: 8, y: 10 },
    { x: 9, y: 10 },
    { x: 10, y: 10 },
  ]

  randomFood()

  interv = setInterval(() => {
    requestAnimationFrame(gameLoop)
    // gameLoop()
  }, 1000 / FR)
}

init()

chickenImg = new Image()
chickenImg.src = 'chicken.png'

snakeLeft = new Image()
snakeLeft.src = 'snek-left.png'
snakeRight = new Image()
snakeRight.src = 'snek-right.png'
snakeUp = new Image()
snakeUp.src = 'snek-up.png'
snakeDown = new Image()
snakeDown.src = 'snek-down.png'

function randomFood() {
  food = {
    x: Math.floor(Math.random() * T),
    y: Math.floor(Math.random() * T),
  }

  for (let cell of snake) {
    if (cell.x === food.x && food.y === cell.y) {
      return randomFood()
    }
  }
}

document.addEventListener('keydown', keydown)

function keydown(e) {
  switch (e.keyCode) {
    case 37: {
      if (vel.x !== 1) return (vel = { x: -1, y: 0 })
      break
    }
    case 38: {
      if (vel.y !== 1) return (vel = { x: 0, y: -1 })
      break
    }
    case 39: {
      if (vel.x !== -1) return (vel = { x: 1, y: 0 })
      break
    }
    case 40: {
      if (vel.y !== -1) return (vel = { x: 0, y: 1 })
      break
    }
  }
}

// interv = setInterval(() => {
//   requestAnimationFrame(gameLoop)
//   // gameLoop()
// }, 1000 / FR)

function gameLoop() {
  //paint canvas background
  ctx.fillStyle = BG_COLOUR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  //paint snake
  ctx.fillStyle = SNAKE_COLOUR
  // for (let cell of snake) {
  // ctx.fillRect(cell.x * S, cell.y * S, S, S)

  //head is painted last

  for (let i = 0; i < snake.length; i++) {
    if (i === snake.length - 1) {
      // painting head last
      if (vel.x === 0 && vel.y === 0)
        ctx.drawImage(snakeRight, snake[i].x * S, snake[i].y * S, S, S)
      if (vel.x === 1) {
        ctx.drawImage(snakeRight, snake[i].x * S, snake[i].y * S, S, S)
      } else if (vel.x === -1) {
        ctx.drawImage(snakeLeft, snake[i].x * S, snake[i].y * S, S, S)
      } else if (vel.y === 1) {
        ctx.drawImage(snakeDown, snake[i].x * S, snake[i].y * S, S, S)
      } else if (vel.y === -1) {
        ctx.drawImage(snakeUp, snake[i].x * S, snake[i].y * S, S, S)
      }
    } else {
      // painting body
      ctx.fillRect(snake[i].x * S, snake[i].y * S, S, S)
    }
  }

  //paint food
  // ctx.fillStyle = FOOD_COLOUR
  // ctx.fillRect(food.x * S, food.y * S, S, S)
  ctx.drawImage(chickenImg, food.x * S, food.y * S, S, S)

  pos.x += vel.x
  pos.y += vel.y

  //check if off the screen & reset if true
  if (pos.x < 0 || pos.x >= T || pos.y < 0 || pos.y >= T) {
    init()
    // vel = { x: 0, y: 0 }
  }

  //if food is eaten then make it grow one block
  if (food.x === pos.x && food.y === pos.y) {
    snake.push({ ...pos })
    pos.x += vel.x
    pos.y += vel.y
    randomFood()
  }

  if (vel.x || vel.y) {
    for (let cell of snake) {
      if (cell.x === pos.x && cell.y === pos.y) {
        return init()
        // vel = { x: 0, y: 0 }
      }
    }
    snake.push({ ...pos })
    snake.shift()
  }

  //update score
  let el = document.querySelector('.score')
  el.innerHTML = `Score: ${(snake.length - 3) * 100}`
}
