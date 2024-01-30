import OBR, { buildImage } from "@owlbear-rodeo/sdk";

const ID = "dev.pages.instant-summons";
const toolID = `${ID}/tool`;

function round(coordinate, squareSize, tokenSize) {
  if (tokenSize == 600.0 || tokenSize == 1200.0) {
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
  return buildImage(
    {
      height: size,
      width: size,
      url: imageUrl,
      mime: "image/png",
    },
    {
      dpi: 300,
      offset: getOffset(pointerPositionX, pointerPositionY, size)
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