const bcrypt = require("bcrypt");
const Token = require("../models/token");
const Admin = require("../models/admins");
const { Op } = require("sequelize");

const getHashedPassword = async (password) => {
  return await bcrypt.hash(password, bcrypt.genSaltSync(10), null);
};

const create_token = async (admin) => {
  const token = Token.build({
    userId: admin.id,
    token: `${getHashedPassword(admin.username)}`,
    expiresAt: new Date(Date.now() + 86400000),
  });
  await token.save();
  return await token;
};

const delete_tokens = async (admin) => {
  // Filter out expired token too.
  return await Token.destroy({
    where: {
      userId: admin.id,
      expiresAt: {
        [Op.gt]: Date.now(),
      },
    },
  });
};

const authenticate = async (username, password) => {
  try {
    const hashedPassword = await getHashedPassword(password);
    console.log("hashedPassword: ", hashedPassword);
    const admin = await Admin.findOne({
      where: {
        username: username,
      },
    });
    const result = await bcrypt.compare(password, admin.password);
    console.log("result: ", result);
    if (result) {
      console.log("Authenticated", result);
      await delete_tokens(admin);
      const token = await create_token(admin);
      console.log("token: ", token);
      return token;
    } else {
      console.log("Authentication failed");
      return null;
    }
  } catch (error) {
    console.log("Error in Authenticate", error);
    return null;
  }
};

const check_authentication = async (token) => {
  const tokenObj = await Token.findOne({
    where: {
      token: token,
      expiresAt: {
        [Op.gt]: Date.now(),
      },
    },
  });
  if (await tokenObj) {
    return true;
  }
  return false;
};

const is_authenticated = async (req, res, next) => {
  var token = req.cookies.token;
  if (token) {
    const auth = await check_authentication(token);
    if (auth) {
      return next();
    } else {
      return res.redirect("/hall-of-fame/login");
    }
  } else {
    console.log("Else Not Authenticated");
  }

  return res.redirect("/hall-of-fame/login");
};

// Export all the functions
module.exports = {
  getHashedPassword,
  authenticate,
  is_authenticated,
  check_authentication,
};
