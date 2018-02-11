import { mergeSort, alphaCompare } from './manualSort';

export default function uniqueNamesFromCollection(collection) {
  // map names in collection to lowercase
  const lowerCaseCollection = collection.map(name => name.toLowerCase());

  const uniqueNames = lowerCaseCollection.reduce((outputArr, name, nameIndex, inputArr) => {
    /**
     * lowerCaseCollection.slice(0, nameIndex) gives us a look at the left-hand side of our input array
     * lowerCaseCollection.slice(nameIndex + 1) gives us a look at the right-hand side of our input array
     * if we dont see another instance of our current name either behind or ahead of it, we can safely filter it into our return array
     */
    if (!inputArr.slice(0, nameIndex).includes(name) && !inputArr.slice(nameIndex + 1).includes(name)) {
      return outputArr.concat(collection[nameIndex]);
    }
    return outputArr;
  }, []);

  function protoSort() {
    /**
     * array.prototype.sort is a utility method for carrying out in-place sorts on arrays (the sort is merge-sort)
     * it takes a sorting func as an arg, which is expected to compare 2 contiguous elems of the arr and return a neg or pos int
     * if the res of the sorting func is negative, the 1st arg of the sorting func is moved to the left of the 2nd arg;
     * if the res is positive, the 2nd arg is moved to the left of the 1st,
     * if the res is 0, the elems remain in their current position/indexes
     */
    return uniqueNames.sort(
      /**
       * string.prototype.localeCompare() compares a reference string to a given string and returns a number
       * it's second argument is a string or array of strings describing the language or languages (locale) to use in the comparison
       * for language reference see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
       */
      (leftName, rightName) => leftName.toLowerCase().localeCompare(rightName.toLowerCase(), 'en')
    );
  }

  function manualSort() {
    return mergeSort(uniqueNames, alphaCompare);
  }

  return {
    protoMethods: protoSort(),
    manualSort: manualSort()
  };
}
