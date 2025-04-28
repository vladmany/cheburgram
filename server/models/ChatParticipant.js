import { DataTypes, Model } from '@sequelize/core';
import sequelize from "../db.js";

export const ChatParticipant = sequelize.define('ChatParticipant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'chat_participants',
});