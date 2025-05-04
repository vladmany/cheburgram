import clerk from '../../../clerk/clerkClient.js';
import {camelToSnakeCase} from "../../../services/objectService.js";
import {Chat, ChatParticipant, Message} from "../../../models/index.js";

export default {
    Query: {
        users: async (_, __, { userId }) => {
            const rawUsers = await clerk.users.getUserList();
            const users = rawUsers.data.filter(u => u.id !== userId);

            const chats = await Chat.findAll({
                include: [
                    {
                        model: ChatParticipant,
                        as: 'myParticipant',
                        where: { user_id: userId },
                        attributes: [],
                    },
                    {
                        model: ChatParticipant,
                        as: 'participants',
                        required: false,
                    },
                    {
                        model: Message,
                        as: 'messages',
                        required: false,
                        order: [['sent_at', 'ASC']],
                    },
                ],
                order: [['messages', 'sent_at', 'ASC']],
            });

            return users.map(u => ({
                ...camelToSnakeCase(u),
                chat: chats.find(c => c.participants.find(p => p.user_id === u.id)),
            }));
        }
    }
};