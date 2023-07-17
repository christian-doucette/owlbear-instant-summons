import OBR from "@owlbear-rodeo/sdk";

const ID = "monster-selector-tool";

async function setupInput(monsterInputField, monsterSubmitButton) {
  const updateMonster = (_) => {
    const newMonsterName = document.getElementById("monsterInputField").value;
    OBR.tool.setMetadata(`${ID}/tool`, { monsterName: newMonsterName });
    OBR.notification.show(`Set monster name to ${newMonsterName}`)
  };
  monsterSubmitButton.onclick = updateMonster

  const metadata = await OBR.tool.getMetadata(`${ID}/tool`)
  if (metadata.monsterName) {
    monsterInputField.value = metadata.monsterName
  }
}

OBR.onReady(async () => {
  setupInput(document.getElementById("monsterInputField"), document.getElementById("monsterSubmitButton"));
});
