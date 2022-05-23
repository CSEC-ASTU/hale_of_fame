const Sequelize = require("sequelize");
const sequelize = require("../db/connections");
const bcrypt = require("bcrypt");
const Admin = require("./admins");

const Token = sequelize.define("token", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    token: {
        type: Sequelize.STRING,
        unique: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    expiresAt: {
        type: Sequelize.DATE
    },  
});

Token.beforeCreate(async (token, options) => {
    const hashedPassword = await bcrypt.hash(token.token, bcrypt.genSaltSync(10), null);
    token.token = hashedPassword;
    }
);


// Make Foregin Key to Admin Table
Token.belongsTo(Admin, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Token.sync()
    .then(() => {
        console.log("Token table created");
    }
);

// export Token
module.exports = Token;