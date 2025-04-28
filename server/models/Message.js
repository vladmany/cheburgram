import { DataTypes, Model } from '@sequelize/core';
import sequelize from "../db.js";

export const Message =  sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    participant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sent_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    read_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'messages',
});