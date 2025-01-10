import OBR from '@owlbear-rodeo/sdk';
import { getWordStartSubstringMatches } from './find-substring-matches.js';
import { allMonsterNames, findMonster } from './monster-data.js';

const ID = 'dev.pages.instant-summons';
const popoverID = `${ID}/popover`;
const toolID = `${ID}/tool`;

// sets popover to the height of the current list of autocomplete items
function popoverSetToListHeight(listOffsetHeight, inputFieldOffsetHeight, windowOuterHeight) {
  const emptyHeight = inputFieldOffsetHeight + 15;
  const listHeight = listOffsetHeight + emptyHeight;
  const cutOffListHeight = Math.min(listHeight, windowOuterHeight - 250);

  OBR.popover.setHeight(popoverID, cutOffListHeight);
}

// searches for a monster by name
// if found updates extension metadata
async function updateMonsterMetadata(newMonsterName) {
  const monsterData = await findMonster(newMonsterName);

  await OBR.tool.setMetadata(toolID, {
    name: monsterData.name,
    source: monsterData.source,
    size: monsterData.size
  });
}

// executes when an option from autocomplete list is clicked
// closes popover, updates metadata with the new monster and notifies
async function onOptionClick(newMonsterName) {
  OBR.popover.close(popoverID);

  await updateMonsterMetadata(newMonsterName);

  OBR.notification.show(`Set monster to ${newMonsterName}. Double click on the map to place.`);
}

// autocomplete function
function autocomplete(inputField, autocompleteList, matchOptions) {
  const inputText = inputField.value;

  // removes current list of options
  autocompleteList.replaceChildren();

  // adds list of matched options based on input
  for (let [match, htmlFormattedMatch] of getWordStartSubstringMatches(inputText, matchOptions)) {
    const matchElement = document.createElement('DIV');
    matchElement.innerHTML = htmlFormattedMatch;
    matchElement.addEventListener('click', async function (_) {
      onOptionClick(match);
    });

    autocompleteList.appendChild(matchElement);
  }

  // sets popover height based on new list length
  popoverSetToListHeight(autocompleteList.offsetHeight, inputField.offsetHeight, window.outerHeight);
}

OBR.onReady(async () => {
  // Gets array containing all the possible monster names
  const allMonsters = await allMonsterNames();

  const inputField = document.getElementById('monsterInputField');
  const autocompleteList = document.getElementById('monsterInputAutocomplete');

  // sets focus so all keystrokes will be directed into this input while box is open
  inputField.focus({ focusVisible: true });

  // initiates the autocomplete function on the input field
  inputField.addEventListener('input', function (_) {
    autocomplete(inputField, autocompleteList, allMonsters);
  });
});
