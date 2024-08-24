import * as net from "net";

const server = net.createServer((socket: net.Socket) => {
   console.log("Client connected");

   socket.on("data", (data: Buffer) => {
      const message = JSON.parse(data.toString());

      handleThreeWayHandshake(socket, message);

      // Placeholder
      if (message.type === "DATA") {
         console.log(`Received data: ${message.data}`);
      }
   });

   socket.on("end", () => {
      console.log("Client disconnected");
   });

   socket.on("error", (err: Error) => {
      console.error(`Socket error: ${err.message}`);
   });

   socket.on("timeout", () => {
      console.log("Handshake timed out. Closing socket.");
      socket.end(); // Close the socket if the handshake isn't completed
   });
});

const handleThreeWayHandshake = (socket: net.Socket, message: any) => {
   if (message.type === "SYN") {
      console.log("Received SYN from client. Sending SYN-ACK...");
      socket.write(
         JSON.stringify({ type: "SYN-ACK", seq: 0, ack: message.seq + 1 })
      );

      // Set a timeout for the client to respond with an ACK
      socket.setTimeout(5000);
   } else if (message.type === "ACK") {
      socket.setTimeout(0); // Disable the timeout
      console.log("Received ACK from client. Connection established.");
   }
};

server.listen(8080, () => {
   console.log("Server listening on port 8080");
});
