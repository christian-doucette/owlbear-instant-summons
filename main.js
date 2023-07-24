import OBR, { buildImage } from "@owlbear-rodeo/sdk";

const ID = "monster-selector-tool";

function createTool() {
  OBR.tool.create({
    id: `${ID}/tool`,
    icons: [
      {
        icon: "/circle.svg",
        label: "Instant Summons",
      },
    ],
    defaultMode: `${ID}/mode`,
    defaultMetadata: { 
      url: 'https://5e.tools/img/MM/notrealmonster.png',
      size: 300,
      name: ''
    }
  });
}

function getOffset(pointerPositionX, pointerPositionY, size) {
  const centeredX = round(pointerPositionX, 150.0, size)
  const centeredY = round(pointerPositionY, 150.0, size)
  return {
    x: -2 * centeredX + (size / 2.0),
    y: -2 * centeredY + (size / 2.0)
  }
}

function round(coordinate, squareSize, tokenSize) {
  if (tokenSize == 600.0 || tokenSize == 1200.0) {
    const rounded = Math.round(coordinate / squareSize) * squareSize
    return rounded
  } else {
    const rounded = Math.floor(coordinate / squareSize) * squareSize
    return rounded + (squareSize / 2.0)
  }

}

function createMode() {
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
      const item = buildImage(
        {
          height: metadata.size,
          width: metadata.size,
          url: metadata.url,
          mime: "image/png",
        },
        { 
          dpi: 300, 
          offset: getOffset(event.pointerPosition.x, event.pointerPosition.y, metadata.size)
        }
      )
        .plainText(metadata.name)
        .build();
      OBR.scene.items.addItems([item]);
    },
  });
}

function createAction() {
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
      OBR.popover.open({
        id: `${ID}/monster-selector`,
        height: 120,
        width: 400,
        url: "/monster-selector.html",
        anchorElementId: elementId,
        anchorOrigin: {
          horizontal: "CENTER",
          vertical: "BOTTOM",
        },
        transformOrigin: {
          horizontal: "CENTER",
          vertical: "TOP",
        },
      });
    },
  });
}

OBR.onReady(() => {
  createTool();
  createMode();
  createAction();
});
