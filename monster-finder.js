export async function findMonster(name) {
  var monsterData = await fetchMonsterData()
    .then(response => response.json())
    .then(json => json[name]);
    
  if (monsterData) {
    return formatMonsterData(monsterData, name)
  } else {
    return monsterNotFoundData(name)
  }    
}

export async function allMonsterNames() {
  return fetchMonsterData()
    .then(response => response.json())
    .then(json => Object.keys(json))
}

async function fetchMonsterData() {
  return fetch('/monster-data.json')
}

function monsterNotFoundData(inputName) {
  return {
    url: 'https://5e.tools/img/MM/notrealmonster.png',
    size: 300,
    name: inputName
  }
}

const sizeMapping = {
  'T': 150, 
  'S': 240, 
  'M': 300, 
  'L': 600, 
  'H': 900, 
  'G': 1200
}

function sanitizeName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function formatMonsterData(monsterData, name) {
  return {
    url: `https://5e.tools/img/${monsterData['source']}/${sanitizeName(name)}.png`,
    size: sizeMapping[monsterData['size']],
    name: name
  }
}
