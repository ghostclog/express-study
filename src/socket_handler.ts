import { Server, Socket } from 'socket.io';

interface ControlPayload {
    roomId: string;
    type: 'play' | 'pause' | 'seek';
    currentTime?: number;
}

interface User {
    id: string;
    name: string;
}

const rooms: Record<string, Map<string, User>> = {};

export default function initializeSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('a user connected:', socket.id);
        let currentRoomId: string | null = null;

        socket.on('join_room', ({ roomId, user }: { roomId: string, user: User }) => {
            currentRoomId = roomId;
            socket.join(roomId);

            if (!rooms[roomId]) {
                rooms[roomId] = new Map();
            }
            rooms[roomId].set(socket.id, { ...user, id: socket.id });
            console.log(`Socket ${socket.id} (${user.name}) joined room ${roomId}`);

            io.to(roomId).emit('update_user_list', Array.from(rooms[roomId].values()));
        });

        socket.on('host_control', (data: ControlPayload) => {
            // Emit to all clients in the room INCLUDING the sender
            io.to(data.roomId).emit('sync_control', data);
        });

        socket.on('send_message', ({ message }: { message: string }) => {
            if (currentRoomId && rooms[currentRoomId] && rooms[currentRoomId].has(socket.id)) {
                const user = rooms[currentRoomId].get(socket.id);
                if (user) {
                    io.to(currentRoomId).emit('new_message', { userName: user.name, message });
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected:', socket.id);
            if (currentRoomId && rooms[currentRoomId]) {
                rooms[currentRoomId].delete(socket.id);
                io.to(currentRoomId).emit('update_user_list', Array.from(rooms[currentRoomId].values()));
                
                if (rooms[currentRoomId].size === 0) {
                    delete rooms[currentRoomId];
                }
            }
        });
    });
}
