import { DataTypes, Model } from '@sequelize/core';
import sequelize from "../db.js";

export const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    tableName: 'chats',
});