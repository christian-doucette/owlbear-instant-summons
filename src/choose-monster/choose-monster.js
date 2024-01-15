import OBR from "@owlbear-rodeo/sdk";
import { allMonsterNames, findMonster } from "/src/choose-monster/monster-data.js";
import { autocomplete } from "/src/choose-monster/autocomplete.js";

const ID = "instant-summons";

// searches for a monster by name
// if found updates extension metadata
async function updateMonsterMetadata(newMonsterName) {
    const monsterData = await findMonster(newMonsterName);

    await OBR.tool.setMetadata(`${ID}/tool`, { 
        url: monsterData['url'],
        size: monsterData['size']
    });
  
    OBR.notification.show(`Set monster to ${newMonsterName}. Double click on the map to place.`);
}

OBR.onReady(async () => {
    // An array containing all the monster names
    const allMonsters = await allMonsterNames();

    const inputField = document.getElementById("monsterInputField");

    // sets focus so all keystrokes will be directed into this input while box is open
    inputField.focus({ focusVisible: true });

    // initiate the autocomplete function on the "monsterInputField" element
    // passes along full list of options and callback function
    autocomplete(inputField, allMonsters, updateMonsterMetadata);

  })