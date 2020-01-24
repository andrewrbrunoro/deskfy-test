module.exports = (sequelize, DataTypes) => {
    const Gif = sequelize.define('Gif', {
        name: DataTypes.STRING,
        date: DataTypes.DATE,
        start: DataTypes.STRING,
        duration: DataTypes.STRING,
        share: DataTypes.STRING,
        video: DataTypes.STRING,
        gif: DataTypes.STRING,
        createdAt: DataTypes.DATE
    });

    return Gif;
};
