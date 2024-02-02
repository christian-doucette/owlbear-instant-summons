import OBR, { buildImage } from "@owlbear-rodeo/sdk";

const ID = "dev.pages.instant-summons";
const toolID = `${ID}/tool`;

// pixel dimensions based off size category
function sizeCategoryToPixels(sizeCategory, squareSize) {
  const numSquares = {
    'T': 1.0 / 2.0,
    'S': (4.0 / 5.0),
    'M': 1.0,
    'L': 2.0,
    'H': 3.0,
    'G': 4.0
  }[sizeCategory]

  return numSquares * squareSize
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
  const evenNumSquares = sizeCategory == 'L' || sizeCategory == 'G'
  return {
    x: roundCoordinate(pointerPositionX, evenNumSquares, squareSize),
    y: roundCoordinate(pointerPositionY, evenNumSquares, squareSize)
  }
}

function getOffset(sizePixels) {
  return {
    x: sizePixels / 2.0,
    y: sizePixels / 2.0
  }
}

function buildMonsterImage(imageUrl, sizeCategory, pointerPositionX, pointerPositionY, squareSize) {
  console.log(sizeCategory)
  const sizePixels = sizeCategoryToPixels(sizeCategory, squareSize);
  console.log(sizePixels)

  return buildImage(
    {
      height: sizePixels,
      width: sizePixels,
      url: imageUrl,
      mime: "image/png",
    },
    {
      dpi: squareSize,
      offset: getOffset(sizePixels)
    }
  )
    .layer("CHARACTER")
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
    console.log(monsterImage)
    OBR.scene.items.addItems([monsterImage]);
  }
  else {
    OBR.notification.show(`No monster selected yet. Pick one with the Choose Monster tool.`);
  }
}