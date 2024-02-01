import OBR, { buildImage } from "@owlbear-rodeo/sdk";

const ID = "dev.pages.instant-summons";
const toolID = `${ID}/tool`;

// pixel dimensions based off size category
const sizePixelMapping = {
  'T': 150,
  'S': 240,
  'M': 300,
  'L': 600,
  'H': 900,
  'G': 1200
};

function round(coordinate, squareSize, tokenSize) {
  // decides rounding method based on whether the token will cover an odd or even number of squares
  if (tokenSize == sizePixelMapping['L'] || tokenSize == sizePixelMapping['G']) {
    const rounded = Math.round(coordinate / squareSize) * squareSize;
    return rounded;
  } else {
    const rounded = Math.floor(coordinate / squareSize) * squareSize;
    return rounded + (squareSize / 2.0);
  }
}

function getOffset(pointerPositionX, pointerPositionY, size) {
  const centeredX = round(pointerPositionX, 150.0, size);
  const centeredY = round(pointerPositionY, 150.0, size);
  return {
    x: -2 * centeredX + (size / 2.0),
    y: -2 * centeredY + (size / 2.0)
  };
}

function buildMonsterImage(imageUrl, size, pointerPositionX, pointerPositionY) {
  const sizePixels = sizePixelMapping[size]
  return buildImage(
    {
      height: sizePixels,
      width: sizePixels,
      url: imageUrl,
      mime: "image/png",
    },
    {
      dpi: 300,
      offset: getOffset(pointerPositionX, pointerPositionY, sizePixels)
    }
  )
    .layer("CHARACTER")
    .build();
}

// constructs image of monster currently in the extension metadata
// and places at the square that was clicked
export async function placeCurrentMonster(pointerPosition) {
  const metadata = await OBR.tool.getMetadata(toolID);

  if (metadata && metadata.url && metadata.size) {
    const monsterImage = buildMonsterImage(metadata.url, metadata.size, pointerPosition.x, pointerPosition.y);
    OBR.scene.items.addItems([monsterImage]);
  }
  else {
    OBR.notification.show(`No monster selected yet. Pick one with the Choose Monster tool.`);
  }

}