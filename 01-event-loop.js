const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 1;

setTimeout(() => {
  console.log("Timer 1 finished");
}, 0);

setImmediate(() => console.log("Immediate 1 finished"));

fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  console.log("-----------------");

  setTimeout(() => {
    console.log("Timer 2 finished");
  }, 0);

  setTimeout(() => {
    console.log("Timer 3 finished");
  }, 3000);

  setImmediate(() => console.log("Immediate 2 finished"));

  process.nextTick(() => console.log("Process.nextTick"));
  //3. Proces.nextTick got executed first --> it is because the nextTick is part of the microtasks queue, which get executed after each phase so not just after one entire tick and so what happened here is that this callback function actually ran and the phase before that

  crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });

  crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });

  crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });

  crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  //the size of the thread pool is four so there are four threads doing the work at the same time ans so that's why these four password encryptions take approximately the same time and happen basically all at the same time

  //after declaring above process.env, there is only one thread left so the take each there time separately

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password encrypted");

//   using sync version --> now the happen in the complete synchronous way so one after the another and what is even worse is all of these timers here even nextTick and the immediate one only appeared after the password encryptions happened so this really was blocking the entire execution even the timer here is finished after the zero seconds 
});

console.log("Hello from the top level code!");
//1. on the first level --> first we get top level code and then setImmediate or setTimeout can vary up or down and read file at the last because the file was and it took some time

//2. on the second level --> so on the first phase the four outputs were not running in the event loop but on the second phase the above three setTimeout and setImmediate were actually coming out of the event loop so let's now analyze the result:
// now if you remeber the diagram from the previous lecture you will probably have thought that the timer 2 here should actually finish before the setImmediate because in the diagram it actually appeared first right at the top of the event loop so above we have setTimeout 3 with 0 seconds which should kind of be the same as setImmediate so why does setImmediate actually appear before the setTimeout?
// it is because the event loop actually waits for stuff to happen in the poll phase so in that phase where I/O callbacks are handled so when this queue of callbacks is empty which is the case in our example here so we have no I/O callbacks, all we have is these timers well then the event loop will wait in this phase until there is an expired timer but if we scheduled a callback using setImmediate then that callback will actually be executed right away after the polling phase and even before expired timers if there is one and in this case the timer expires right away so after 0s but again the event loop actually wait so it pauses in the polling phase and so that setImmediate callback is actually executed first so that is the whole reason why this happens
