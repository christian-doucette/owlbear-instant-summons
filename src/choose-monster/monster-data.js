async function fetchMonsterData() {
  return fetch('/monster-data.json');
}

export async function allMonsterNames() {
  return fetchMonsterData()
    .then(response => response.json())
    .then(json => Object.keys(json));
}


export async function findMonster(name) {
  var monsterData = await fetchMonsterData()
    .then(response => response.json())
    .then(json => json[name]);

  if (monsterData) {
    return {
      name: name, 
      source: monsterData.source,
      size: monsterData.size
    };
  } else {
    return {
      name: 'notrealmonster', 
      source: 'MM',
      size: 'M'
    };
  }
}