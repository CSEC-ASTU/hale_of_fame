// declare the user model using sequelize
const Sequelize = require('sequelize');
const sequelize = require('../db/connections');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phoneNumber: {
        type: Sequelize.STRING,
    },
    gender: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'active',
    },
    about: {
        type: Sequelize.TEXT,
    },
    division: {
        type: Sequelize.STRING,
    },
    image: {
        type: Sequelize.STRING,
    },
    facebook: {
        type: Sequelize.STRING,
    },
    twitter: {
        type: Sequelize.STRING,
    },
    instagram: {
        type: Sequelize.STRING,
    },
    linkedin: {
        type: Sequelize.STRING,
    },
    github: {
        type: Sequelize.STRING,
    },
    personal: {
        type: Sequelize.STRING,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
});

// create the table
User.sync({ force: false })
    .then(() => {
        console.log("User table created");
    }
);

module.exports = User;