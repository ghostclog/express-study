import { Server, Socket } from 'socket.io';

interface ControlPayload {
    roomId: string;
    type: 'play' | 'pause' | 'seek';
    currentTime?: number;
}

export default function initializeSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('a user connected:', socket.id);

        socket.on('join_room', (roomId: string) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });

        socket.on('host_control', (data: ControlPayload) => {
            // Emit to all other clients in the room except the sender
            socket.to(data.roomId).emit('sync_control', data);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected:', socket.id);
        });
    });
}
