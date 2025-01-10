import OBR, { buildImage } from '@owlbear-rodeo/sdk';
import Monster from './monster.js';


const ID = 'dev.pages.instant-summons';
const toolID = `${ID}/tool`;


function roundCoordinate(coordinate, evenNumSquares, squareSize) {
  // decides rounding strategy based on whether token takes up an even number of squares or not
  if (evenNumSquares) {
    const closestSquareSide = Math.round(coordinate / squareSize) * squareSize;
    return closestSquareSide;
  } else {
    const roundedDownSquareSide = Math.floor(coordinate / squareSize) * squareSize;
    return roundedDownSquareSide + (squareSize / 2.0);
  }
}

function getRoundedPosition(pointerPosition, evenNumSquares, squareSize) {
  return {
    x: roundCoordinate(pointerPosition.x, evenNumSquares, squareSize),
    y: roundCoordinate(pointerPosition.y, evenNumSquares, squareSize)
  };
}

function buildMonsterImage(monster, pointerPosition, squareSize) {
  return buildImage(
    {
      height: monster.height(),
      width: monster.width(),
      url: monster.imageUrl(),
      mime: 'image/webp',
    },
    {
      dpi: monster.dpi(),
      offset: monster.offset()
    }
  )
    .layer('CHARACTER')
    .position(getRoundedPosition(pointerPosition, monster.evenNumSquares(), squareSize))
    .build();
}

// constructs image of monster currently in the extension metadata
// and places at the square that was clicked
export default async function placeCurrentMonster(pointerPosition) {
  const squareSize = await OBR.scene.grid.getDpi();
  const metadata = await OBR.tool.getMetadata(toolID);

  if (metadata && metadata.name && metadata.source && metadata.size) {
    const monster = new Monster(metadata.name, metadata.source, metadata.size);
    const monsterImage = buildMonsterImage(monster, pointerPosition, squareSize);
    OBR.scene.items.addItems([monsterImage]);
  }
  else {
    OBR.notification.show('No monster selected yet. Pick one with the Choose Monster tool.');
  }
}