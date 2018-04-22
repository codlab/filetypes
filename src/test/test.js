const FileTypes = require("../filetypes");


const test1 = new FileTypes("./src/test/file.png");
const test2 = new FileTypes("./src/test/file.mov");
const test3 = new FileTypes("./src/test/file.unknown");
const promises = [
  test1.read(),
  test2.read(),
  test3.read()
]

Promise.all(promises)
.then(results => {
  if(test1.guessMineType().extension != "png") throw "Invalid test result 1";
  if(test2.guessMineType().extension != "mov") throw "Invalid test result 2";
  if(test3.guessMineType().extension != "mov") throw "Invalid test result 3";
})
.catch(err => console.error(err))
