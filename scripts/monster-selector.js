import { allMonsterNames, findMonster } from '/scripts/monster-finder.js'
import OBR from "@owlbear-rodeo/sdk";

const ID = "monster-selector-tool";
const inputField = document.getElementById("monsterInputField")

// Using autocomplete functionality from W3 schools here:
// https://www.w3schools.com/howto/howto_js_autocomplete.asp

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();

        if (!val) { 
          const emptyHeight = inputField.offsetHeight + 15
          OBR.popover.setHeight(`${ID}/monster-selector`, emptyHeight)
          return false;
        }
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (const elt of arr) {
          // get the indexes of the starts of each word
          const whitespaceMatches = [...elt.matchAll(/(\s|\()/g)]
          const wordStartIndexes = [0].concat(whitespaceMatches.map(match => match.index + 1))

          for (const wordStartIndex of wordStartIndexes) { 

            /*check if the item starts with the same letters as the text field value:*/
            if (elt.substring(wordStartIndex, wordStartIndex + val.length).toUpperCase() == val.toUpperCase()) {
              /*create a DIV element for each matching element:*/
              b = document.createElement("DIV");
              /*make the matching letters bold:*/
              b.innerHTML = elt.substring(0, wordStartIndex)
              b.innerHTML += "<strong>" + elt.substring(wordStartIndex, wordStartIndex + val.length) + "</strong>";
              b.innerHTML += elt.substring(wordStartIndex + val.length);
              /*insert a input field that will hold the current array item's value:*/
              b.innerHTML += "<input type='hidden' value='" + elt + "'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
                  updateMonster(this.getElementsByTagName("input")[0].value);
                  /*insert the value for the autocomplete text field:*/
                  //inp.value = this.getElementsByTagName("input")[0].value;
                  /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                  closeAllLists();
              });
              a.appendChild(b);
              break;
            }
          }
        }
        const listHeight = a.offsetHeight + inputField.offsetHeight + 15
        const height = Math.min(listHeight, window.outerHeight - 200)
        OBR.popover.setHeight(`${ID}/monster-selector`, height)
    });
    function closeAllLists() {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  async function updateMonster(newMonsterName) {
    const monsterData = await findMonster(newMonsterName)
    await OBR.tool.setMetadata(`${ID}/tool`, { 
      url: monsterData['url'],
      size: monsterData['size'],
      name: monsterData['name']
    });
    OBR.popover.close(`${ID}/monster-selector`)
    OBR.notification.show(`Set monster name to ${newMonsterName}. Double click on a square to place.`)
  }
  
  /*An array containing all the country names in the world:*/
  var monsters = await allMonsterNames()

  /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
  autocomplete(inputField, monsters);