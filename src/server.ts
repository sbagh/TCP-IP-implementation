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
});

const handleThreeWayHandshake = (socket: net.Socket, message: any) => {
   if (message.type === "SYN") {
      console.log("Received SYN from client. Sending SYN-ACK...");
      socket.write(
         JSON.stringify({ type: "SYN-ACK", seq: 0, ack: message.seq + 1 })
      );
   } else if (message.type === "ACK") {
      console.log("Received ACK from client. Connection established.");
   }
};

server.listen(8080, () => {
   console.log("Server listening on port 8080");
});
