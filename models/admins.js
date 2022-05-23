const Sequelize = require("sequelize");
const sequelize = require("../db/connections");
const bcrypt = require("bcrypt");

const Admin = sequelize.define("admin", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: Sequelize.STRING,
    // make null true
    allowNull: true,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  is_superuser: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

// Before Save
Admin.beforeCreate(async (admin, options) => {
  const hashedPassword = await bcrypt.hash(admin.password, bcrypt.genSaltSync(10), null);
  admin.password = hashedPassword;
});


Admin.sync()
  .then(() => {
    console.log("Admin table created");
  })
  .catch((err) => {
    console.log("Error creating Admin table", err);
  });

module.exports = Admin;