// Now let's say that for some reason in our application we need to read a large text file from the file system and then send it to the client, there are multiple ways and we're gonna explore or few of them starting with the most basic one and moving all the way to the best way of doing this
const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) console.log(err);
  //     res.end(data);
  //   });
  // in this solution the problem is that node will actually have to load the entire file into memory, because only after that's ready it can then send that data now this is a problem when the file is big and also when there are a ton of requests hitting your server, because the node process will very quickly run out of resources and your app will quit working, everything will crash and your users will not be happy so this solution does work when we're just creating something small locally for just ourselves but in a production-ready application, you cannot use a piece of code like this

  //   // Solution 2: Using Streams
  //   // the idea here is that we actually don't really need to read this data from the file into a variable, we don't need 'data' variable so instead of reading the data into a variable and having to store that variable into memory, we will just create a readable stream then as we recieve each chunk of data we send it to the client as a response which is a writable stream:

  //   const readable = fs.createReadStream("test-file.txt");
  //   readable.on("data", (chunk) => {
  //     res.write(chunk);
  //     // response is a writable stream and so we can now use the write method to send every single piece of data into that stream and with this effectively we're streaming the content from the file right to the client. So before we write everything at once into a variable and once that was ready we then sent that entire piece of data back to the client but in this situation with the stream it is different, we're effectively streaming the file so we read one piece of the file and as soon as that's available we send it right to the client using the write method of the respond stream then when the next piece is available then that piece will be sent and all the way until the entire file is read and streamed to the client, now just to finish we also have to handle the event when all the data is read so when the stream is basically finished reading the data from the file:
  //     readable.on("end", () => {
  //       res.end();
  //       //   res is also a stream and the end method signals that no more data will be written to this writable stream, so up all we did was actually use res.end with the data in it so we did no streaming all we did was in the end to send some data, now in this case we're not passing anything into this end method because we already sent all the data using res.write chunk by chunk and so when the readable stream is finished reading it's file well all we have to do is to then signal that we're ready using res.end like this
  //     });
  //   });

  //   readable.on("error", (err) => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end("File not found");
  //   });

  // But there still is a problem with this approach and the problem is that our readable stream so the one that we're using to read the file from the disk is much faster than actually sending the result with the response writable stream over the network and this will overwhelm the response stream which cannot handle all this incoming data so fast and this problem is called backpressure and it's a real problem that can happen in real situations so in this case bacpressure happens when the response cannot send the data neary as fast as it is receiving it from the file so we have to fix that solution and come up with a even better one:

  // Solution 3:
  // the secret here is to actually use the pipe operator so the pipe operator is available on all readable streams and it allows us to pipe the output of a readable stream right into the input of a writable stream and that will then fix the problem of backpressure because it will automatically handle the speed basically of the data coming in and the speed of the data going out:
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  //   readableSource.pipe(writeableDestination)
  // so the readableSource this is where the data comes from and it has to readable stream and that we can then pipe into a writeable destination so in this case our destination is the response
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
