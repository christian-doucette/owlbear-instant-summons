async function fetchMonsterData() {
  return fetch("/monster-data.json");
}

export async function allMonsterNames() {
  return fetchMonsterData()
    .then(response => response.json())
    .then(json => Object.keys(json));
}

const monsterNotFoundData = {
  url: "https://5e.tools/img/MM/notrealmonster.png",
  size: 'M'
};

function sanitizeName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function formatMonsterData(name, size) {
  return {
    url: `https://5e.tools/img/MM/${sanitizeName(name)}.png`,
    size: size
  };
}

export async function findMonster(name) {
  var monsterSize = await fetchMonsterData()
    .then(response => response.json())
    .then(json => json[name]);

  if (monsterSize) {
    return formatMonsterData(name, monsterSize);
  } else {
    return monsterNotFoundData;
  }
}