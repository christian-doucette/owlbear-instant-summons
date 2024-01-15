import OBR from "@owlbear-rodeo/sdk";
import { allMonsterNames } from "/src/choose-monster/monster-data.js";
import { popoverSetToEmptyHeight, popoverSetToListHeight, popoverCloseAndUpdateMetadata } from "/src/choose-monster/popover-controller.js";

// Using autocomplete functionality from W3 schools here:
// https://www.w3schools.com/howto/howto_js_autocomplete.asp

function autocomplete(input, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    
    /*execute a function when someone writes in the text field:*/
    input.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();

        if (!val) { 
          popoverSetToEmptyHeight(input.offsetHeight)
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
          const whitespaceMatches = [...elt.matchAll(/(\s|\()/g)];
          const wordStartIndexes = [0].concat(whitespaceMatches.map(match => match.index + 1));

          for (const wordStartIndex of wordStartIndexes) { 

            /*check if the item starts with the same letters as the text field value:*/
            if (elt.substring(wordStartIndex, wordStartIndex + val.length).toUpperCase() == val.toUpperCase()) {
              /*create a DIV element for each matching element:*/
              b = document.createElement("DIV");
              /*make the matching letters bold:*/
              b.innerHTML = elt.substring(0, wordStartIndex);
              b.innerHTML += "<strong>" + elt.substring(wordStartIndex, wordStartIndex + val.length) + "</strong>";
              b.innerHTML += elt.substring(wordStartIndex + val.length);
              /*insert a input field that will hold the current array item's value:*/
              b.innerHTML += "<input type='hidden' value='" + elt + "'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
                  popoverCloseAndUpdateMetadata(this.getElementsByTagName("input")[0].value);
                  /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                  closeAllLists();
              });
              a.appendChild(b);
              break;
            }
          }
        }
        popoverSetToListHeight(a.offsetHeight, input.offsetHeight, window.outerHeight)
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
  
  OBR.onReady(async () => {
    /*An array containing all the monster names*/
    var monsters = await allMonsterNames();

    const inputField = document.getElementById("monsterInputField");

    /*sets focus so all keystrokes will be directed into this input while box is open*/
    inputField.focus({ focusVisible: true });

    /*initiate the autocomplete function on the "monsterInputField" element, and pass along the monsters array as possible autocomplete values:*/
    autocomplete(inputField, monsters);

  })