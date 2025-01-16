import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})// Enable CORS for frontend connections

export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, string>(); // Map userId -> socketId

  private readonly logger = new Logger(NotificationGateway.name);

  constructor() {
    this.logger.log('WebSocket Gateway Initialized');
  }


  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string; // Assuming userId is sent in the query
    this.clients.set(userId, client.id);
    console.log(`Client connected: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.clients.entries()]
      .find(([_, socketId]) => socketId === client.id)?.[0];
    if (userId) {
      this.clients.delete(userId);
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  sendPaymentNotification(userId: string, data: any) {
    const clientId = this.clients.get(userId);
    if (clientId) {
      this.server.to(clientId).emit('paymentNotification', data);
      console.log("sent websockets succesfully")
    } else {
      console.log(`Client with userId ${userId} not connected`);
    }
  }
}

