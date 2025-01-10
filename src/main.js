import OBR from '@owlbear-rodeo/sdk';
import placeCurrentMonster from '/src/place-monsters/place-monsters.js';

const ID = 'dev.pages.instant-summons';
const toolID = `${ID}/tool`;
const toolModeID = `${ID}/mode`;
const toolActionID = `${ID}/action`;
const popoverID = `${ID}/popover`;


function createInstantSummonsTool() {
  OBR.tool.create({
    id: toolID,
    icons: [
      {
        icon: '/circle-question-mark.svg',
        label: 'Instant Summons',
      },
    ],
    shortcut: 'I',
    defaultMode: toolModeID,
    defaultMetadata: {
      url: null,
      size: null,
    }
  });
}

function createPlaceMonstersToolMode() {
  OBR.tool.createMode({
    id: toolModeID,
    icons: [
      {
        icon: '/arrow-down.svg',
        label: 'Place Monsters',
        filter: {
          activeTools: [toolID],
        },
      },
    ],
    preventDrag: { dragging: true },
    async onToolDoubleClick(_context, event) {
      placeCurrentMonster(event.pointerPosition);
    },
  });
}

function openChooseMonsterPopover(anchorElementId) {
  OBR.popover.open({
    id: popoverID,
    height: 55,
    width: 315,
    url: '/choose-monster.html',
    anchorElementId: anchorElementId,
    anchorOrigin: {
      horizontal: 'CENTER',
      vertical: 'BOTTOM',
    },
    transformOrigin: {
      horizontal: 'CENTER',
      vertical: 'TOP',
    },
  });
}

function createChooseMonsterToolAction() {
  OBR.tool.createAction({
    id: toolActionID,
    icons: [
      {
        icon: '/circle-question-mark.svg',
        label: 'Choose Monster',
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

OBR.onReady(async () => {
  if (await OBR.player.getRole() == 'GM') {
    createInstantSummonsTool();
    createPlaceMonstersToolMode();
    createChooseMonsterToolAction();
  }
});