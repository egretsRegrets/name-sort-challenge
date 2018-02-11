'use strict';

var _data = require('../../data');

var _data2 = _interopRequireDefault(_data);

var _sortNames = require('./sortNames');

var _sortNames2 = _interopRequireDefault(_sortNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Rendering and Logging:

var sortedNames = (0, _sortNames2.default)(_data2.default.sampleInput);

// utility for rendering li's from an array
function appendLiForTxtElem(txt, appendTarget) {
  var li = document.createElement('li');
  var txtNode = document.createTextNode(txt);
  li.appendChild(txtNode);
  appendTarget.append(li);
}

function renderUnsortedNames(names) {
  var namesTarget = document.getElementById('unsortedNames');
  names.forEach(function (name) {
    return appendLiForTxtElem(name, namesTarget);
  });
}

function renderSortedNames(names) {
  var namesTarget = document.getElementById('uniqueNameList');
  names.forEach(function (name) {
    return appendLiForTxtElem(name, namesTarget);
  });
}

console.log('alpha-sorted unique names: ' + sortedNames.manualSort.join(', '));

// Will log 'Fail' if our sortedNames output does not match our expectedOutput
console.assert(sortedNames.manualSort.join(', ') === _data2.default.expectedOutput.join(', '));

renderUnsortedNames(_data2.default.sampleInput);
renderSortedNames(sortedNames.protoMethods);
