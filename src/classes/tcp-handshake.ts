import * as net from "net";

export class TCPHandshake {
   private sequenceNumber: number;
   private retries: number = 0;
   private readonly maxRetries: number;
   private socket: net.Socket;

   constructor(
      socket: net.Socket,
      sequenceNumber: number,
      maxRetries: number = 3
   ) {
      this.socket = socket;
      this.sequenceNumber = sequenceNumber;
      this.maxRetries = maxRetries;
   }

   public initiate() {
      console.log("Sending SYN...");
      this.socket.write(
         JSON.stringify({ type: "SYN", seq: this.sequenceNumber })
      );
      this.socket.setTimeout(3000); 
   }

   public handleResponse(message: any) {
      switch (message.type) {
         case "SYN":
            console.log("Received SYN. Sending SYN-ACK...");
            this.socket.write(
               JSON.stringify({ type: "SYN-ACK", seq: 0, ack: message.seq + 1 })
            );
            this.socket.setTimeout(5000); 
            break;

         case "SYN-ACK":
            console.log("Received SYN-ACK. Sending ACK...");
            this.socket.write(
               JSON.stringify({
                  type: "ACK",
                  seq: message.ack,
                  ack: message.seq + 1,
               })
            );
            this.socket.setTimeout(0); 
            console.log("Connection established.");
            break;

         case "ACK":
            this.socket.setTimeout(0); 
            console.log("Received ACK. Connection established.");
            break;

         default:
            console.log("Invalid message type. Closing connection.");
            this.socket.end();
      }
   }

   public handleTimeout() {
      if (this.retries < this.maxRetries) {
         this.retries++;
         console.log(`Retry ${this.retries}: Resending SYN...`);
         this.initiate();
      } else {
         console.log("Max retries reached. Giving up.");
         this.socket.end();
      }
   }
}
