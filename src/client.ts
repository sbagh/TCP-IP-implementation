import * as net from "net";
import { TCPHandshake } from "./classes/tcp-handshake";

const PORT = 8080;
const sequenceNumber = Math.floor(Math.random() * 1000);

const client = net.createConnection({ port: PORT }, () => {
   const handshake = new TCPHandshake(client, sequenceNumber);
   handshake.initiate();

   client.on("data", (data: Buffer) => {
      const message = JSON.parse(data.toString());
      handshake.handleResponse(message);
   });

   client.on("timeout", () => {
      handshake.handleTimeout();
   });
});

client.on("end", () => {
   console.log("Disconnected from server");
});

client.on("error", (err: Error) => {
   console.error(`Client error: ${err.message}`);
});
