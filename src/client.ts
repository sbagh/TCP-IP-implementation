import * as net from "net";

const client = net.createConnection({ port: 8080 }, () => {
   console.log("Connected to server");
   client.write("Hello, server!");
});

client.on("data", (data: Buffer) => {
   console.log(`Received: ${data.toString()}`);
   client.end(); // Close the connection after receiving data
});

client.on("end", () => {
   console.log("Disconnected from server");
});

client.on("error", (err: Error) => {
   console.error(`Client error: ${err.message}`);
});
