const Token = require("../models/token");

const create_token = async (admin) => {
  const token = Token.build({
    userId: admin.id,
    token: `${admin.username}`,
    expiresAt: new Date(Date.now() + 86400000),
  });
  await token.save();
  return await token;
};

const delete_tokens = async (token) => {
  return await Token.destroy({
    where: {
      token: token,
    },
  });
};

module.exports = {
    create_token,
    delete_tokens,
};
