// returns the indexes of the start of each word 
function wordStartIndexes(str) {
  const whitespaceRegex = /(\s|\()/g;

  const whitespaceMatches = [...str.matchAll(whitespaceRegex)];
  return [0].concat(whitespaceMatches.map(match => match.index + 1));
}

function caseInsensitiveEquals(str1, str2) {
  return str1.toUpperCase() == str2.toUpperCase();
}

// formats a substring match with the matched bolded
function formatSubstringMatchHTML(str, matchStartIndex, matchEndIndex) {
  const beforeMatch = str.substring(0, matchStartIndex);
  const match = str.substring(matchStartIndex, matchEndIndex);
  const afterMatch = str.substring(matchEndIndex);

  return beforeMatch + match.bold() + afterMatch;
}

// returns the list of words from matchOptions with a word that str matches the start of
// returns as a list of [option, formattedOption] pairs
export function getWordStartSubstringMatches(str, matchOptions) {
  // returns no matches for empty string
  if (!str) return [];

  const matches = [];

  for (const matchOption of matchOptions) {
    for (const wordStartIndex of wordStartIndexes(matchOption)) {
      const potentialSubstringMatch = matchOption.substring(wordStartIndex, wordStartIndex + str.length);

      if (caseInsensitiveEquals(potentialSubstringMatch, str)) {
        const formattedMatchOption = formatSubstringMatchHTML(matchOption, wordStartIndex, wordStartIndex + str.length);

        matches.push([matchOption, formattedMatchOption]);
        // break from loop so it won't return duplicates
        break;
      }
    }
  }

  return matches;
}


