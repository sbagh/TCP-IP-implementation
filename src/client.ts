import * as net from "net";

const PORT = 8080;

const sequenceNumber = Math.floor(Math.random() * 1000);
let retries = 0;
const maxRetries = 3;

// syn as part of the three-way handshake
const sendSyn = () => {
   console.log("Sending SYN to server...");
   client.write(JSON.stringify({ type: "SYN", seq: sequenceNumber }));
   client.setTimeout(3000); // 3-second timeout waiting for SYN-ACK from server
};

// Create a new client connection
const client = net.createConnection({ port: PORT }, () => {
   sendSyn();
});

client.on("data", (data: Buffer) => {
   const message = JSON.parse(data.toString());

   if (message.type === "SYN-ACK") {
      console.log("Received SYN-ACK from server. Sending ACK...");

      client.write(
         JSON.stringify({ type: "ACK", seq: message.ack, ack: message.seq + 1 })
      );

      client.setTimeout(0);
      console.log("Connection established.");
   }
});

client.on("end", () => {
   console.log("Disconnected from server");
});

client.on("error", (err: Error) => {
   console.error(`Client error: ${err.message}`);
});

client.on("timeout", () => {
   if (retries < maxRetries) {
      retries++;
      console.log(`Retry ${retries}: Resending SYN...`);
      sendSyn();
   } else {
      console.log("Max retries reached. Giving up.");
      client.end();
   }
});
