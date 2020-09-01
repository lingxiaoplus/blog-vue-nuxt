var colorList = ['primary', 'teal', 'green',  'lime', ',blue', 'cyan', 'teal', 'secondary', 'green', 'red', 'orange', 'indigo',
  'blue', 'cyan', 'teal', 'lime', 'yellow', 'purple', 'light-blue'
  , 'secondary', 'green', 'cyan', 'teal', 'lime', ',blue', 'cyan', 'teal', 'lime', 'yellow', 'purple'
];
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
module.exports = {
  colorList,
  randomNum
}
