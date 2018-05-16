function log (...args) { console.log(...args); return args[args.length - 1] }

function createElement (type, { id, class: klass, classes = [], dataset = {} }) {
  const element = document.createElement(type)

  if (id) element.id = id
  if (klass) element.classList.add(klass)
  
  classes.forEach(klass => element.classList.add(klass))

  for (let key in dataset) {
    element.setAttribute("data-" + key, dataset[key])
  }
  
  return element
}

function setTransposedKeyValuePairs (object) {
  Object.entries(object).forEach(([key, value]) => {
    if (!object[value]) object[value] = key
  })

  return object
}

function getTransposedKeyValuePairs (object) {
  const newObject = {}
  Object.entries(object).forEach(([key, value]) => {
    newObject[value] = key
  })

  return newObject
}