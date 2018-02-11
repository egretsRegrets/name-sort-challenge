Hello! Thanks for evaluating this challenge solution

Clone or download and you can take a look at the rendered solution by opening up index.html in a browser.

The body of the program is in src/main.js, src/sortNames.js and src/manualSort.js

main.js handles rendering and logging the evaluated result of uniqueNamesFromCollection() with the supplied example input

sortNames.js contains the function uniqueNamesFromCollection() - this function is very heavily commented; I wanted to be sure I was explaining everything I was doing here. uniqueNamesFromCollection() returns an object with 2 props, both of which are the output of other functions - this is sort of weird, but I wanted to show 2 ways of applying an alpha sort to the unique names. The first property, protoMethods uses Array.prototype.sort() and String.prototype.localeCompare() to achieve the sort in what, without the comments, would be one line. The other prop - manualSort() - uses a pretty standard implementation of merge-sort and a helper function, alphaCompare(), that's passed as an argument to mergeSort(). mergeSort() and alphaCompare() can be found in manualSort.js . In practice protoMethods() and manualSort() return the same value given the same input, for proof of both I've used manualSort() when logging and protoMethods() when rendering to the DOM.

data.json contains the sample input provided

spec.txt contains a copy of the spec as it was provided
