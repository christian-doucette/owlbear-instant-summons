import OBR from "@owlbear-rodeo/sdk";
import { allMonsterNames, findMonster } from "/src/choose-monster/monster-data.js";
import { autocomplete } from "/src/choose-monster/autocomplete.js";

const ID = "monster-selector-tool";

async function updateMonsterMetadata(newMonsterName) {
    const monsterData = await findMonster(newMonsterName);

    await OBR.tool.setMetadata(`${ID}/tool`, { 
        url: monsterData['url'],
        size: monsterData['size']
    });
  
    OBR.notification.show(`Set monster to ${newMonsterName}. Double click on the map to place.`);
}

OBR.onReady(async () => {
    /*An array containing all the monster names*/
    var allMonsters = await allMonsterNames();

    const inputField = document.getElementById("monsterInputField");

    /*sets focus so all keystrokes will be directed into this input while box is open*/
    inputField.focus({ focusVisible: true });

    /*initiate the autocomplete function on the "monsterInputField" element, and pass along the monsters array as possible autocomplete values:*/
    autocomplete(inputField, allMonsters, updateMonsterMetadata);

  })