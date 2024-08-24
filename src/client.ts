import * as net from "net";

const PORT = 8080;
const sequenceNumber = 0;

// Create a new client connection
const client = net.createConnection({ port: PORT }, () => {
   // Send SYN to server as part of the 3-way handshake
   client.write(JSON.stringify({ type: "SYN", seq: sequenceNumber }));
});

client.on("data", (data: Buffer) => {
   const message = JSON.parse(data.toString());

   if (message.type === "SYN-ACK") {
      console.log("Received SYN-ACK from server. Sending ACK...");
      client.write(
         JSON.stringify({ type: "ACK", seq: message.ack, ack: message.seq + 1 })
      );
   }
});

client.on("end", () => {
   console.log("Disconnected from server");
});

client.on("error", (err: Error) => {
   console.error(`Client error: ${err.message}`);
});
