import OBR from "@owlbear-rodeo/sdk";
import { placeCurrentMonster } from '/src/place-monsters.js';
 
const ID = "instant-summons";

function createInstantSummonsTool() {
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
      url: null,
      size: null,
    }
  });
}

function createPlaceMonstersToolMode() {
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
      placeCurrentMonster(event.pointerPosition)
    },
  });
}

function openChooseMonsterPopover(anchorElementId) {
  OBR.popover.open({
    id: `${ID}/popover`,
    height: 55,
    width: 315,
    url: "/choose-monster.html",
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

function createChooseMonsterToolAction() {
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
      openChooseMonsterPopover(elementId);
    },
  });
}

OBR.onReady(() => {
  createInstantSummonsTool();
  createPlaceMonstersToolMode();
  createChooseMonsterToolAction();
});