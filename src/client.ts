import * as net from "net";

const PORT = 8080;

const sequenceNumber = 0;
let retries = 0;
const maxRetries = 3;

// Create a new client connection
const client = net.createConnection({ port: PORT }, () => {
   // Send SYN to server as part of the 3-way handshake
   sendSyn();
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

const sendSyn = () => {
   client.setTimeout(3000); // 3-second timeout for the SYN-ACK
   client.write(JSON.stringify({ type: "SYN", seq: sequenceNumber }));
};
