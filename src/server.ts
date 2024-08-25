import * as net from "net";
import { TCPHandshake } from "./classes/tcp-handshake";

const server = net.createServer((socket: net.Socket) => {
   const handshake = new TCPHandshake(socket, 0);

   socket.on("data", (data: Buffer) => {
      const message = JSON.parse(data.toString());
      handshake.handleResponse(message);

      if (message.type === "DATA") {
         console.log(`Received data: ${message.data}`);
      }
   });

   socket.on("timeout", () => {
      handshake.handleTimeout();
   });

   socket.on("end", () => {
      console.log("Client disconnected");
   });

   socket.on("error", (err: Error) => {
      console.error(`Socket error: ${err.message}`);
   });
});

server.listen(8080, () => {
   console.log("Server listening on port 8080");
});
