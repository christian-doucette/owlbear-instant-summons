async function fetchMonsterData() {
  return fetch('/monster-data.json');
}

export async function allMonsterNames() {
  return fetchMonsterData()
    .then(response => response.json())
    .then(json => Object.keys(json));
}

function sanitizeName(name) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function formatMonsterData(name, size, source) {
  return {
    url: `https://raw.githubusercontent.com/ariestae/5etools/refs/heads/master/img/${source}/${sanitizeName(name)}.png`,
    size: size
  };
}

export async function findMonster(name) {
  var monsterData = await fetchMonsterData()
    .then(response => response.json())
    .then(json => json[name]);

  if (monsterData) {
    return formatMonsterData(name, monsterData.size, monsterData.source);
  } else {
    return formatMonsterData('notrealmonster', 'M', 'MM');
  }
}