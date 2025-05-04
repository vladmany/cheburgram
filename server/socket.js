import { Server } from 'socket.io';

let io = null;

function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        }
    });

    bindEvents();

    return io;
}

async function broadcastOnline() {
    const sockets = await io.fetchSockets();
    const onlineUsers = sockets.map(s => s.handshake.query.userId);

    io.emit('online-users', onlineUsers);
}

function bindEvents() {
    io.on('connection', async (socket) => {
        setTimeout(async () => await broadcastOnline(), 1000);


        socket.on('disconnect', async () => {
            setTimeout(async () => await broadcastOnline(), 1000);
        });
    });
}

export {io, initSocket};