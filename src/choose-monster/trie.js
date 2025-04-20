export default class Trie {    
  constructor(optionsList) {
    this.optionsList = optionsList;
    this.rootNode = new TrieNode();

    for (let i = 0; i < optionsList.length; i++) {
      this.#insertWordSuffixes(i, optionsList[i]);
    }
  }

  // inserts all word suffixes of the given string into the Trie
  // ex for "Young Black Dragon", it will insert "Young Black Dragon", "Black Dragon", and "Dragon"
  #insertWordSuffixes(index, str) {
    // uses whitespace regex pattern to find index of each word start
    const whitespaceRegex = /(\s|\()/g;
    const whitespaceMatches = [...str.matchAll(whitespaceRegex)];
    const wordStartIndices = [0].concat(whitespaceMatches.map(match => match.index + 1));

    // inserts substring starting at each word start index into the Trie
    for (const wordStartIndex of wordStartIndices) {
      this.#insertString(index, str.slice(wordStartIndex));
    }
  }

  // inserts a string into the Trie
  #insertString(index, str) {
    let node = this.rootNode;

    // propogates through the Trie by each character,
    // creating new TrieNodes as needed
    for (const char of str.toUpperCase()) {
      if (node.childNodes.has(char)) {
        node = node.childNodes.get(char);
      }
      else {
        let newChildNode = new TrieNode();
        node.childNodes.set(char, newChildNode);

        node = newChildNode;
      } 
    }

    node.endPointers.push(index);
  }

  // returns the list of strings that match prefix
  prefixMatches(prefix) {
    // returns no match for empty prefix
    if (!prefix) {
      return [];
    }

    // scans through to find location of prefix in Trie
    let node = this.rootNode;

    for (const char of prefix) {        
      node = node.childNodes.get(char.toUpperCase());

      if (!node) {
        return [];
      }
    }

    // finds all the completed strings within the Trie which match prefix
    let prefixEndPointers = node.endPointersUnderNode();
    let prefixMatches = prefixEndPointers.map((endPointer) => this.optionsList[endPointer]);
    prefixMatches.sort()

    return prefixMatches;
  }
}

class TrieNode {
  constructor() {
    // maps from characters to child TrieNodes 
    this.childNodes = new Map;
    // if this node corresponds to the ends of any strings within the trie,
    // endPointers list stores the indices of them in optionsList in the Trie
    this.endPointers = [];
  }

  endPointersUnderNode() {
    let children = Array.from(this.childNodes.values());
    let childrenEndPointers = children.flatMap((child) => child.endPointersUnderNode());

    return this.endPointers.concat(childrenEndPointers);
  }
}