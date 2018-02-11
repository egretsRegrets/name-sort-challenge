const sampleInput = [
  'Nick',
  'jake',
  'RAY',
  'Kate',
  'Nick',
  'Jeremy',
  'Ryan',
  'nick',
  'AMOL',
  'rAY',
  'VIANNEY',
  'Samuel',
  'ryan',
  'Shilpika',
  'nick',
  'THOMAS',
  'tom',
  'james',
  'JERM',
  'amOl',
  'kate',
  'SCOTT',
  'Jenifer',
  'bill',
  'jenny',
  'STEVEN'
];

const expectedOutput = [
  'bill',
  'jake',
  'james',
  'jenifer',
  'jenny',
  'jeremy',
  'jerm',
  'samuel',
  'scott',
  'shilpika',
  'steven',
  'thomas',
  'tom',
  'vianney'
];

function uniqueNamesFromCollection(collection) {
  // map names in collection to lowercase
  const lowerCaseCollection = collection.map(name => name.toLowerCase());
  const uniqueNames = lowerCaseCollection.reduce((uniqueNames, name, nameIndex, allNames) => {
    /**
     * allNames.slice(0, nameIndex) gives us a look at the left-hand side of our input array
     * allNames.slice(nameIndex + 1) gives us a look at the right-hand side of our input array
     * if we dont see another instance of our current name either behind or ahead of it, we can safely push it onto the accumulator
     */
    if (!allNames.slice(0, nameIndex).includes(name) && !allNames.slice(nameIndex + 1).includes(name)) {
      return uniqueNames.concat(name);
    }
    /*
    because uniqueNames is the accumulator, even if we don't add a name to the uniqueNames array we need to return it as it is
    otherwise there will be an implicit return of undefined, and we will no longer be able to perform concat ops with it
    */
    return uniqueNames;
  }, []);

  /**
   * array.prototype.sort is a utility method for carrying out in-place sorts on arrays (the sort is merge-sort)
   * it takes a sorting func as an arg, which is expected to compare 2 contiguous elems of the arr and return a neg or pos int
   * if the res of the sorting func is negative, the 1st arg of the sorting func is moved to the left of the 2nd arg;
   * if the res is positive, the 2nd arg is moved to the left of the 1st,
   * if the res is 0, the elems remain in their current position/indexes
   */
  const alphaSortedNames = uniqueNames.sort(
    /**
     * string.prototype.localeCompare() compares a reference string to a given string and returns a number
     * it's second argument is a string or array of strings describing the language or languages (locale) to use in the comparison
     * for language reference see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
     */
    (leftName, rightName) => leftName.localeCompare(rightName, 'en')
  );
  // to test manual merge sort implementation replace the above alphaSortedNames assignment with: const alphaSortedNames = mergeSort(uniqueNames, alphaCompare);
  return alphaSortedNames;
}

// Rendering and Logging:

const sortedNames = uniqueNamesFromCollection(sampleInput);

// utility for rendering li's from an array
function appendLiForTxtElem(txt, appendTarget) {
  const li = document.createElement('li');
  const txtNode = document.createTextNode(txt);
  li.appendChild(txtNode);
  appendTarget.append(li);
}

function renderUnsortedNames(names) {
  const namesTarget = document.getElementById('unsortedNames');
  names.forEach(name => appendLiForTxtElem(name, namesTarget));
}

function renderSortedNames(names) {
  const namesTarget = document.getElementById('uniqueNameList');
  names.forEach(name => appendLiForTxtElem(name, namesTarget));
}

console.log(`alpha-sorted unique names: ${sortedNames.join(', ')}`);

// Will log 'Fail' if our sortedNames output does not match our expectedOutput
console.assert(sortedNames.join(', ') === expectedOutput.join(', '));

renderUnsortedNames(sampleInput);
renderSortedNames(sortedNames);

// manual merge sort implementation - not used above, tested just the same

function alphaCompare(left, right, wordLength) {
  // if left[0] has a lesser character code than right[0] we can exit with -1, signaling that left will be sorted to the left
  if (left.charCodeAt(0) < right.charCodeAt(0)) {
    return -1;
  }
  // if our two letters have the same charCode and are therefore the same, we need to compare the next letter
  if (left.charCodeAt(0) === right.charCodeAt(0)) {
    /**
     * We track the length of our shortest word to make sure we don't accidentally unshift all the letters of a word.
     * wordLength will only be passed in as an arg if we run alphaCompare recursively,
     * if it's not present we assign shortestWordLength the length of whichever word is shorter.
     */
    let shortestWordLength;
    if (!wordLength) {
      shortestWordLength = left.length > right.length ? left.length : right.length;
    } else {
      shortestWordLength = wordLength;
    }
    if (shortestWordLength > 1) {
      // we'll run alphaCompare again, comparing the next letters of left and right
      return alphaCompare(left.slice(1), right.slice(1), shortestWordLength - 1);
    }
    return 0;
  }
  return 0;
}

// The usual mergeSort implementation wrapped in an outer func layer that accepts a custom sort-determining func
function mergeSort(
  array,
  // a default sortFun if none is passed in
  sortFunc = (left, right) => {
    if (left < right) return -1;
    return 1;
  }
) {
  function merge(left, right) {
    const result = [];
    let iLeft = 0;
    let iRight = 0;
    while (iLeft < left.length && iRight < right.length) {
      if (sortFunc(left[iLeft], right[iRight]) === -1) {
        result.push(left[iLeft]);
        iLeft += 1;
      } else {
        result.push(right[iRight]);
        iRight += 1;
      }
    }

    return result.concat(left.slice(iLeft), right.slice(iRight));
  }

  function sort(arr) {
    if (arr.length === 1) {
      return arr;
    }
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(sort(left), sort(right));
  }

  return sort(array);
}
