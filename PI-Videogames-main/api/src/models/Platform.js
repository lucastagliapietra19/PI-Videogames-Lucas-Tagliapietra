const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Platform = sequelize.define('Platform', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    });

    return Platform;
};