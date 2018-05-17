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
      return Object.keys(game.config.arrowKeys).reduce((offset, arrow) => {
        return movement.add(movement.queue[arrow], offset)
      }, [0, 0])
    }
  },

  add: ([row, col], [rowOffset, colOffset]) => [row + rowOffset, col + colOffset],
  isUnset: ([rowOffset, colOffset]) => !rowOffset && !colOffset,

}
