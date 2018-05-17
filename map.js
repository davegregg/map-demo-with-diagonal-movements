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
