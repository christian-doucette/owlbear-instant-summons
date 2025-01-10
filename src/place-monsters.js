import OBR, { buildImage } from '@owlbear-rodeo/sdk';

const ID = 'dev.pages.instant-summons';
const toolID = `${ID}/tool`;

function sizeCategoryToPixelSize(sizeCategory) {
  return {
    'T': 280,
    'S': 280,
    'M': 280,
    'L': 560,
    'H': 560,
    'G': 560
  }[sizeCategory];
}

function sizeCategoryToDpi(sizeCategory) {
  const numSquares = {
    'T': 1.0,
    'S': 1.0,
    'M': 1.0,
    'L': 2.0,
    'H': 3.0,
    'G': 4.0
  }[sizeCategory];

  return sizeCategoryToPixelSize(sizeCategory) / numSquares;
}

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

function getRoundedPosition(pointerPositionX, pointerPositionY, sizeCategory, squareSize) {
  const evenNumSquares = sizeCategory == 'L' || sizeCategory == 'G';
  return {
    x: roundCoordinate(pointerPositionX, evenNumSquares, squareSize),
    y: roundCoordinate(pointerPositionY, evenNumSquares, squareSize)
  };
}

function getOffset(sizeCategory) {
  return {
    x: sizeCategoryToPixelSize(sizeCategory) / 2.0,
    y: sizeCategoryToPixelSize(sizeCategory) / 2.0
  };
}

function buildMonsterImage(imageUrl, sizeCategory, pointerPositionX, pointerPositionY, squareSize) {
  return buildImage(
    {
      height: sizeCategoryToPixelSize(sizeCategory),
      width: sizeCategoryToPixelSize(sizeCategory),
      url: imageUrl,
      mime: 'image/webp',
    },
    {
      dpi: sizeCategoryToDpi(sizeCategory),
      offset: getOffset(sizeCategory)
    }
  )
    .layer('CHARACTER')
    .position(getRoundedPosition(pointerPositionX, pointerPositionY, sizeCategory, squareSize))
    .build();
}

// constructs image of monster currently in the extension metadata
// and places at the square that was clicked
export async function placeCurrentMonster(pointerPosition) {
  const squareSize = await OBR.scene.grid.getDpi();
  const metadata = await OBR.tool.getMetadata(toolID);

  if (metadata && metadata.url && metadata.size) {
    const monsterImage = buildMonsterImage(metadata.url, metadata.size, pointerPosition.x, pointerPosition.y, squareSize);
    OBR.scene.items.addItems([monsterImage]);
  }
  else {
    OBR.notification.show('No monster selected yet. Pick one with the Choose Monster tool.');
  }
}