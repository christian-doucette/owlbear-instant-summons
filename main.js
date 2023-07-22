import OBR, { buildImage } from "@owlbear-rodeo/sdk";

const ID = "monster-selector-tool";

async function getMonsterData(monsterName) {
  const sizeMapping = {
    'T': 150, 
    'S': 240, 
    'M': 300, 
    'L': 600, 
    'H': 900, 
    'G': 1200
  }

  var monsterData = await fetch('/monster-data.json')
      .then(response => response.json())
      .then(json => json[monsterName]);
  
  if (monsterData) {
    return {
      url: `https://5e.tools/img/${monsterData['source']}/${monsterName}.png`,
      size: sizeMapping[monsterData['size']]
    }
  } else {
    return  {
      url: 'https://5e.tools/img/MM/notrealmonster.png',
      size: 300
    }
  }


}

function createTool() {
  OBR.tool.create({
    id: `${ID}/tool`,
    icons: [
      {
        icon: "/circle.svg",
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
      const monsterData = await getMonsterData(metadata.monsterName)
      const item = buildImage(
        {
          height: monsterData['size'],
          width: monsterData['size'],
          url: monsterData['url'],
          mime: "image/png",
        },
        { dpi: 300, offset: { x: -2 * event.pointerPosition.x + (monsterData['size'] / 2.0), y: -2 * event.pointerPosition.y + (monsterData['size'] / 2.0) } }
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
