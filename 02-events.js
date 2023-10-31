const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

//1. so remeber that event emitters can emit named events and we can then subscribe to these events so basically listen to them and then react accordingly so it's a bit like setting up an eventListener on a DOM element for ex for clicking on a button
myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

//3. let's add another one, one of the nice things about these event emitters is that we can actually set up multiple listeners for the same event:
myEmitter.on("newSale", () => {
  console.log("Customer name: Jonas");
});

myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit("newSale", 9);
//2. so we want to emit an event called newSale and using the example of clicking on a button, this .emit here is as if we were clicking on the button and so now we have to set up these listeners, look above

///////////////////////////////////////////
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request recieved!");
  console.log(req.url);
  res.end("Request received ");
});

server.on("request", (req, res) => {
  console.log("Another request 😂");
});

server.on("close", () => {
  console.log("Server closed");
});
// if you see .on anywhere in a node project well then you already know that you are listening or that the code is listening for an event

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});
