import { useAzureSocketIO } from "@azure/web-pubsub-socket.io";
import { createServer } from "http";
import { NextRequest, NextResponse } from "next/server";
import { Server } from "socket.io";

export function GET(req: NextRequest, res: NextResponse) {
  const httpServer = createServer();
  let io = new Server(httpServer);

  // Use the following line to integrate with Web PubSub for Socket.IO
  useAzureSocketIO(io, {
    hub: "Hub", // The hub name can be any valid string.
    connectionString: process.env.SOCKET_URL!,
  });

  io.on("connection", (socket: any) => {
    // Sends a message to the client
    socket.emit("hello", "world");

    // Receives a message from the client
    socket.on("howdy", (arg: any) => {
      console.log(arg); // Prints "stranger"
    });
  });
  httpServer.listening;
  return {} 
}
