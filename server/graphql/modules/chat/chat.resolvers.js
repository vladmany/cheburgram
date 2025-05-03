import {Chat, ChatParticipant, Message} from "../../../models/index.js";
import {Sequelize} from "@sequelize/core";
import {io} from "../../../socket.js";

export default {
    Query: {
        chats: () => [],
    },
    Mutation: {
        createChat: async (_, { userId }, context) => {
            const authUserId = context.userId;

            const existingChats = await Chat.findAll({
                include: [
                    {
                        association: Chat.associations.participants,
                        where: {
                            user_id: { [Sequelize.Op.in]: [authUserId, userId] }
                        },
                        required: true
                    }
                ]
            });

            for (const chat of existingChats) {
                const participants = await chat.getParticipants();
                const participantIds = participants.map(p => p.user_id).sort();
                const targetIds = [authUserId, userId].sort();

                if (
                    participants.length === 2 &&
                    JSON.stringify(participantIds) === JSON.stringify(targetIds)
                ) {
                    return Chat.findByPk(chat.id, {
                        include: [
                            { association: Chat.associations.participants },
                            { model: Message },
                        ],
                    });
                }
            }

            let newChat = await Chat.create();

            await ChatParticipant.create({ chat_id: newChat.id, user_id: authUserId });
            await ChatParticipant.create({ chat_id: newChat.id, user_id: userId });

            newChat = await Chat.findByPk(newChat.id, {
                include: [
                    { association: Chat.associations.participants },
                    { model: Message },
                ],
            });

            const sockets = await io.fetchSockets();
            const socket = sockets.find(s => s.handshake.query.userId === userId);
            if (socket) {
                socket.emit('new-chat', {userId: authUserId, chat: newChat});
            }

            return newChat;
        }
    }
};