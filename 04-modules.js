// console.log(arguments);
// console.log(require("module").wrapper);

// module.exports
const C = require("./test-module-1");
const calc1 = new C();
console.log(calc1.add(2, 5));

// exports
const calc2 = require("./test-module-2");
console.log(calc2.add(2, 6));
console.log(calc2.multiply(2, 6));

// destructuring:
const { add, multiply, divide } = require("./test-module-2");
console.log(add(2, 3));

// Caching:
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
// we have 'Hello from the module' only once and that is because of caching so technically this module was only loaded once and so the code inside of it was also executed only once and so that's why 'Hello from the module' ran only once and the other two loggings here well they came from cache so they were stored somewhere in the Node's processes cache and once we called the function here for the second time it was simply retrieved from there instead of loading the module again
