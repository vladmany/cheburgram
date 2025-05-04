import sequelize from '../db.js';
import { Chat } from './Chat.js';
import { Message } from './Message.js';
import { ChatParticipant } from './ChatParticipant.js';

Chat.hasMany(Message, { foreignKey: 'chat_id', as: 'messages' });
Chat.hasMany(ChatParticipant, { foreignKey: 'chat_id', as: 'participants' });
Chat.hasMany(ChatParticipant, { foreignKey: 'chat_id', as: 'myParticipant' });
Message.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });
Message.belongsTo(ChatParticipant, { foreignKey: 'participant_id', as: 'author' });
ChatParticipant.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });

const init = async () => {
    await sequelize.sync({
        alter: true,
        force: false,
    });
}

export {
    init,
    Chat,
    Message,
    ChatParticipant,
};