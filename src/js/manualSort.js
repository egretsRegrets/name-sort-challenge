// The usual mergeSort implementation wrapped in an outer func layer that accepts a custom sort-determining func
export function mergeSort(
  array,
  // a default sortFunc is provided if none is passed in
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

export function alphaCompare(left, right, wordLength) {
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
