import data from '../../data';
import uniqueNamesFromCollection from './sortNames';

// Rendering and Logging:

const sortedNames = uniqueNamesFromCollection(data.sampleInput);

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

console.log(`alpha-sorted unique names: ${sortedNames.manualSort.join(', ')}`);

// Will log 'Fail' if our sortedNames output does not match our expectedOutput
console.assert(sortedNames.manualSort.join(', ') === data.expectedOutput.join(', '));

renderUnsortedNames(data.sampleInput);
renderSortedNames(sortedNames.protoMethods);
