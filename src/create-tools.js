import OBR, { buildImage } from "@owlbear-rodeo/sdk";
import { placeCurrentMonster } from '/src/place-monsters.js';
 
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
      placeCurrentMonster(event.pointerPosition)
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