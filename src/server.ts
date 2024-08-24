// import net from "net";

// const server = net.createServer((socket: net.Socket) => {
//    console.log("Client connected");

//    // Handle incoming messages from clients.
//    socket.on("data", (data: Buffer) => {
//       console.log(`Received: ${data.toString()}`);

//       socket.write("Echo: " + data);
//    });

//    // Handle client disconnects.
//    socket.on("end", () => {
//       console.log("Client disconnected");
//    });

//    // Handle errors
//    socket.on("error", (err: Error) => {
//       console.error(`Socket error: ${err.message}`);
//    });
// });

import * as net from "net";

const server = net.createServer((socket: any) => {
   console.log(socket instanceof net.Socket); // This will log `true`
});

server.listen(8080);
