const game = {

  config: {

    arrowKeys: {
      up: "ArrowUp",
      right: "ArrowRight",
      down: "ArrowDown",
      left: "ArrowLeft",
    },

    movementDelay: 100,

  },

  keyboardListener: event => {
    const keyIsArrow = 
      Object.values(game.config.arrowKeys).some(arrowKey => arrowKey === event.key)

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
    game._directions = getTransposedKeyValuePairs(game.config.arrowKeys)

    addEventListener("keydown", game.keyboardListener)
    setInterval(game.processMovementQueue, game.config.movementDelay)
  },

  stop: () => removeEventListener("keydown", game.keyboardListener),
  
  init: () => {
    map.create()
    map.movesCounter.innerHTML = map.initialMoveCount
    game.setupKeyboardListener()
  }
}
