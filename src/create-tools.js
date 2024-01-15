import OBR, { buildImage } from "@owlbear-rodeo/sdk";
const ID = "monster-selector-tool";

export function createInstantSummonsTool() {
  OBR.tool.create({
    id: `${ID}/tool`,
    icons: [
      {
        icon: "/circle-question-mark.svg",
        label: "Instant Summons",
      },
    ],
    disabled: {
      roles: ["PLAYER"]
    },
    shortcut: 'I',
    defaultMode: `${ID}/mode`,
    defaultMetadata: { 
      url: "https://5e.tools/img/MM/notrealmonster.png",
      size: 300
    }
  });
}

function getOffset(pointerPositionX, pointerPositionY, size) {
  const centeredX = round(pointerPositionX, 150.0, size);
  const centeredY = round(pointerPositionY, 150.0, size);
  return {
    x: -2 * centeredX + (size / 2.0),
    y: -2 * centeredY + (size / 2.0)
  };
}

function round(coordinate, squareSize, tokenSize) {
  if (tokenSize == 600.0 || tokenSize == 1200.0) {
    const rounded = Math.round(coordinate / squareSize) * squareSize;
    return rounded;
  } else {
    const rounded = Math.floor(coordinate / squareSize) * squareSize;
    return rounded + (squareSize / 2.0);
  }
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

export function createPlaceMonstersToolMode() {
  OBR.tool.createMode({
    id: `${ID}/mode`,
    icons: [
      {
        icon: "/arrow-down.svg",
        label: "Place Monsters",
        filter: {
          activeTools: [`${ID}/tool`],
        },
      },
    ],
    preventDrag: { dragging: true },
    onToolClick: () => true,
    async onToolDoubleClick(_, event) {
      const metadata = await OBR.tool.getMetadata(`${ID}/tool`);
      const monsterImage = buildMonsterImage(metadata.url, metadata.size, event.pointerPosition.x, event.pointerPosition.y);
      OBR.scene.items.addItems([monsterImage]);
    },
  });
}

function openMonsterSelectorPopover(anchorElementId) {
  OBR.popover.open({
    id: `${ID}/monster-selector`,
    height: 55,
    width: 315,
    url: "/monster-selector.html",
    anchorElementId: anchorElementId,
    anchorOrigin: {
      horizontal: "CENTER",
      vertical: "BOTTOM",
    },
    transformOrigin: {
      horizontal: "CENTER",
      vertical: "TOP",
    },
  });
}

export function createChooseMonsterToolAction() {
  OBR.tool.createAction({
    id: `${ID}/action`,
    icons: [
      {
        icon: "/circle-question-mark.svg",
        label: "Choose Monster",
        filter: {
          activeTools: [`${ID}/tool`],
        },
      },
    ],
    onClick(_, elementId) {
      openMonsterSelectorPopover(elementId);
    },
  });
}