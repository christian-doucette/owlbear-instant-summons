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
    url: `https://5e.tools/img/bestiary/tokens/${source}/${sanitizeName(name)}.webp`,
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