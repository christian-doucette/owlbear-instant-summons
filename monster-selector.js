import OBR from "@owlbear-rodeo/sdk";
import findMonster from '/monster-finder.js'

const ID = "monster-selector-tool";

async function setupInput(monsterInputField, monsterSubmitButton) {
  async function updateMonster() {
    const newMonsterName = document.getElementById("monsterInputField").value;
    const monsterData = await findMonster(newMonsterName)
    console.log(monsterData)
    await OBR.tool.setMetadata(`${ID}/tool`, { 
      url: monsterData['url'],
      size: monsterData['size'],
      name: monsterData['name']
    });
    const newMetadata = await OBR.tool.getMetadata(`${ID}/tool`)
    console.log(newMetadata)
    OBR.popover.close(`${ID}/monster-selector`)
    OBR.notification.show(`Set monster name to ${newMonsterName}`)
  };
  monsterSubmitButton.onclick = updateMonster

  const metadata = await OBR.tool.getMetadata(`${ID}/tool`)
  if (metadata && metadata.name) {
    monsterInputField.value = metadata.name
  }
}

OBR.onReady(async () => {
  setupInput(document.getElementById("monsterInputField"), document.getElementById("monsterSubmitButton"));
});
