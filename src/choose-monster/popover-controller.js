import OBR from "@owlbear-rodeo/sdk";
import { findMonster } from '/src/choose-monster/monster-data.js';

const ID = "monster-selector-tool";
const popoverID = `${ID}/monster-selector`

export async function popoverCloseAndUpdateMetadata(newMonsterName) {
    OBR.popover.close(popoverID)

    const monsterData = await findMonster(newMonsterName);
    await OBR.tool.setMetadata(`${ID}/tool`, { 
        url: monsterData['url'],
        size: monsterData['size']
    });

    OBR.notification.show(`Set monster to ${newMonsterName}. Double click on the map to place.`);
}

function emptyHeight(inputFieldOffsetHeight) {
    return inputFieldOffsetHeight + 15
}

export function popoverSetToEmptyHeight(inputFieldOffsetHeight) {
    OBR.popover.setHeight(popoverID, emptyHeight(inputFieldOffsetHeight));
}

export function popoverSetToListHeight(listOffsetHeight, inputFieldOffsetHeight, windowOuterHeight) {
    const listHeight = listOffsetHeight + emptyHeight(inputFieldOffsetHeight);
    const cutOffListHeight = Math.min(listHeight, windowOuterHeight - 200);
    OBR.popover.setHeight(popoverID, cutOffListHeight);
}