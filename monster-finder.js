export default async function findMonster(name) {
  var monsterData = await fetch('/monster-data.json')
    .then(response => response.json())
    .then(json => json[name]);
    
  if (monsterData) {
    return formatMonsterData(monsterData, name)
  } else {
    return monsterNotFoundData(name)
  }    
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

function formatMonsterData(monsterData, name) {
  return {
    url: `https://5e.tools/img/${monsterData['source']}/${name}.png`,
    size: sizeMapping[monsterData['size']],
    name: name
  }
}
