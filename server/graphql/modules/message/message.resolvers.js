import {Chat, ChatParticipant, Message} from "../../../models/index.js";
import { io } from '../../../socket.js';

export default {
    Query: {
        messages: () => [],
    },
    Mutation: {
        createMessage: async (_, { chatId, text }, context) => {
            const authUserId = context.userId;

            const chatParticipants = await ChatParticipant.findAll({
                where: {
                    chat_id: chatId,
                }
            });

            const authUserParticipant = chatParticipants.find(p => p.user_id === authUserId);

            const message = await Message.create({
                chat_id: chatId,
                participant_id: authUserParticipant.id,
                text,
                sent_at: new Date().getTime()
            });

            const otherParticipants = chatParticipants.filter(p => p.user_id !== authUserId);

            const sockets = await io.fetchSockets();
            sockets.forEach((socket) => {
                const socketUserId = socket.handshake.query.userId;

                otherParticipants.forEach(p => {
                    if (p.user_id === socketUserId)
                        socket.emit('new-message', message);
                });
            });

            return message;
        },
        markAsRead: async (_, { messageId }, context) => {
            const [__, [message]] = await Message.update(
                { read_at: new Date() },
                {
                    where: { id: messageId },
                    returning: true,
                }
            );

            const participant = await ChatParticipant.findByPk(message.participant_id);
            const userId = participant.user_id;

            const sockets = await io.fetchSockets();
            const userSocket = sockets.find(s => s.handshake.query.userId === userId);

            if (userSocket)
                userSocket.emit('read-message', messageId);

            return true;
        }
    }
};