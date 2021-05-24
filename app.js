document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0

  // The tetrominoes
  const lTeromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTeromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTeromino, zTeromino, tTetromino, oTetromino, iTetromino]
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let currentPos = 4
  let currentRot = 0
  let current = theTetrominoes[random][currentRot]

  // draw the tetrominoes
  function draw () {
    current.forEach(index => {
      squares[currentPos + index].classList.add('tetromino')
    })
  }

  // undraw the tetromino
  function undraw () {
    current.forEach(index => {
      squares[currentPos + index].classList.remove('tetromino')
    })
  }
  // make the tetromino remove
  // timeId = setInterval(moveDown, 100)

  function moveDown () {
    undraw()
    currentPos += width
    draw()
    freeze()
  }

  function freeze () {
    if (current.some(index => squares[currentPos + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPos + index].classList.add('taken'))
      // start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRot]
      currentPos = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // move the tetromino left unless it cant
  function moveLeft () {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPos + index) % width === 0)
    if (!isAtLeftEdge) currentPos -= 1
    if (current.some(index => squares[currentPos + index].classList.contains('taken'))) {
      currentPos += 1
    }
    draw()
  }

  function moveRight () {
    undraw()
    const isAtRightEdge = current.some(index => (currentPos + index) % width === width - 1)
    if (!isAtRightEdge) currentPos += 1
    if (current.some(index => squares[currentPos + index].classList.contains('taken'))) {
      currentPos -= 1
    }
    draw()
  }

  function isAtRight () {
    return current.some(index => (currentPos + index + 1) % width === 0)
  }
  function isAtLeft () {
    return current.some(index => (currentPos + index) % width === 0)
  }
  function checkRotatedPosition (P) {
    P = P || currentPos
    if ((P + 1) % width < 4) {
      if (isAtRight()) {
        currentPos += 1
        checkRotatedPosition(P)
      }
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPos -= 1
        checkRotatedPosition(P)
      }
    }
  }

  function rotate () {
    undraw()
    currentRot++
    if (currentRot === current.length) {
      currentRot = 0
    }
    current = theTetrominoes[random][currentRot]
    checkRotatedPosition()
    draw()
  }

  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
  ]

  function displayShape () {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }

  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 750)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })


  function addScore () {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }


  function gameOver () {
    if (current.some(index => squares[currentPos + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }

  function control (e) {
    if (e.keyCode === 37 || e.KeyCode === 65) {
      moveLeft()
    } else if (e.keyCode === 38 || e.KeyCode === 87) {
      rotate()
    } else if (e.keyCode === 39 || e.KeyCode === 65) {
      moveRight()
    } else if (e.keyCode === 40 || e.keyCode === 83) {
      moveDown()
      moveDown()
      moveDown()
      moveDown()
    }
  }

  document.addEventListener('keyup', control)
})
