const map = {

  container: document.querySelector("main"),
  movesCounter: document.getElementById("moves-counter"),
  movesCounterPadding: document.getElementById("moves-counter-padding"),

  initialMoveCount: 36,

  blueprint: Object.freeze([
    "█████████████████████",
    "█░░░█░░░░░█░░░░░█░█░█",
    "█░█░█░███░█████░█░█░█",
    "█░█░█░░░█░░░░░█░█░░░█",
    "█░███████░█░███░█░█░█",
    "█░░░░░░░░░█░░░░░█░█░█",
    "█░███░█████░█████░█░█",
    "█░█░░░█░░░█░█░░░░░█░█",
    "█░█████░█░█░█░███░█░F",
    "S░░░░░█░█░█░█░█░█░███",
    "█████░█░█░█░█░█░█░█░█",
    "█░░░░░█░█░█░░░█░█░█░█",
    "█░███████░█████░█░█░█",
    "█░░░░░░░█░░░░░░░█░░░█",
    "█████████████████████",
  ]),

  legend: {
    wall: "█",
    floor: "░",
    start: "S",
    finish: "F",
  },

  cells: [],
  player: createElement("div", { id: "player" })

}

map.create = () => {
  setTransposedKeyValuePairs(map.legend)

  map.blueprint.forEach((rowBlueprint, rowIndex) => {
    const row = createElement("div", { class: "row" });
    map.cells[rowIndex] = [];

    ([...rowBlueprint]).forEach((cellType, cellIndex) => {
      const cell = createElement("div", {
        classes: ["cell", map.legend[cellType]],
        dataset: {
          "row-index": rowIndex,
          "cell-index": cellIndex,
          "type": map.legend[cellType],
        }
      })

      if (cellType === map.legend.start)
        cell.appendChild(map.player)

      map.cells[rowIndex].push(cell)
      row.appendChild(cell)
    })

    map.container.appendChild(row)
  })

  return map.cells
}

map.player.findTargetCell = ([rowOffset, colOffset]) => {
  const targetRow = Number(map.player.parentElement.dataset.rowIndex) + rowOffset
  const targetCol = Number(map.player.parentElement.dataset.cellIndex) + colOffset

  return map.cells[targetRow] && map.cells[targetRow][targetCol]
}

map.player.move = async targetCell => {
  await targetCell.appendChild(map.player)
  if (map.movesCounter.innerHTML < 11) map.movesCounterPadding.innerHTML = "&nbsp;"
  map.movesCounter.innerHTML = map.movesCounter.innerHTML - 1
}

map.player.tryMove = async targetCell => {
  if (!targetCell) return null
  if (map.player._blinkInterval) map.player.stopBlink()

  const itIsThat = {
    targetIsNotAWall: targetCell.dataset.type !== "wall",
    targetIsFinish: targetCell.dataset.type === "finish",
    playerIsOutOfMoves: Number(map.movesCounter.innerHTML) <= 1,
  }

  if (itIsThat.targetIsFinish || itIsThat.playerIsOutOfMoves) game.stop()
  if (itIsThat.targetIsNotAWall) await map.player.move(targetCell)
  if (itIsThat.targetIsFinish) map.player.blink()
}

map.player.blink = () => {
  map.player._blinkInterval = setInterval(() => {
    map.player.style.visibility = map.player.style.visibility === "hidden" ? "visible" : "hidden"
  }, 500)
}

map.player.stopBlink = () => {
  clearInterval(map.player._blinkInterval)
  map.player._blinkInterval = null
}

const game = {
  arrowKeys: {
    up: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    left: "ArrowLeft",
  },

  keyboardListener: event => {
    const keyIsArrow = 
      Object.values(game.arrowKeys).some(arrowKey => arrowKey === event.key)

    if (keyIsArrow) {
      const direction = game._directions[event.key]
      if (movement.isUnset(movement.queue[direction])) {
        movement.queue.active = true
        movement.queue[direction] = movement.add(movement.queue[direction], movement.offsets[direction])
      }
    }
  },

  processMovementQueue: () => {
    if (movement.queue.active) {
      map.player.tryMove(
        map.player.findTargetCell(
          movement.queue.sum()
        )
      )
      movement.queue.clear()
    }
  },

  setupKeyboardListener: () => {
    game._directions = getTransposedKeyValuePairs(game.arrowKeys)

    addEventListener("keydown", game.keyboardListener)
    setInterval(game.processMovementQueue, 100)
  },

  stop: () => removeEventListener("keydown", game.keyboardListener),
  
  init: () => {
    map.create()
    map.movesCounter.innerHTML = map.initialMoveCount
    game.setupKeyboardListener()
  }
}

const movement = {

  offsets: Object.freeze({
    up: [-1, +0],
    right: [+0, +1],
    down: [+1, +0],
    left: [+0, -1],
  }),

  queue: {
    active: false,

    up: [0, 0],
    right: [0, 0],
    down: [0, 0],
    left: [0, 0],

    clear: () => {
      movement.queue.active = false
      movement.queue.up = [0, 0]
      movement.queue.down = [0, 0]
      movement.queue.right = [0, 0]
      movement.queue.left = [0, 0]
    },

    sum: () => {
      return Object.keys(game.arrowKeys).reduce((offset, arrow) => {
        return movement.add(movement.queue[arrow], offset)
      }, [0, 0])
    }
  },

  add: ([row, col], [rowOffset, colOffset]) => [row + rowOffset, col + colOffset],
  isUnset: ([rowOffset, colOffset]) => !rowOffset && !colOffset,
}

game.init()