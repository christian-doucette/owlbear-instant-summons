import OBR, { buildImage } from "@owlbear-rodeo/sdk";

const ID = "monster-selector-tool";

function createTool() {
  OBR.tool.create({
    id: `${ID}/tool`,
    icons: [
      {
        icon: "/will-add-later.svg",
        label: "Instant Summons",
      },
    ],
    defaultMode: `${ID}/mode`
  });
}

function createMode() {
  OBR.tool.createMode({
    id: `${ID}/mode`,
    icons: [
      {
        icon: "/will-add-later.svg",
        label: "Place Monsters",
        filter: {
          activeTools: [`${ID}/tool`],
        },
      },
    ],
    preventDrag: { dragging: true },
    onToolClick: () => true,
    async onToolDoubleClick(_, event) {
      const height = 300
      const width = 300
      const metadata = await OBR.tool.getMetadata(`${ID}/tool`);
      const url = `https://5e.tools/img/MM/${metadata.monsterName}.png`
      const item = buildImage(
        {
          height: height,
          width: width,
          url: url,
          mime: "image/png",
        },
        { dpi: 300, offset: { x: -2 * event.pointerPosition.x + (width / 2.0), y: -2 * event.pointerPosition.y + (height / 2.0) } }
      )
        .plainText(metadata.monsterName)
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
        icon: "/will-add-later.svg",
        label: "Choose Monster",
        filter: {
          activeTools: [`${ID}/tool`],
        },
      },
    ],
    onClick(_, elementId) {
      OBR.popover.open({
        id: `${ID}/monster-selector`,
        height: 60,
        width: 200,
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
