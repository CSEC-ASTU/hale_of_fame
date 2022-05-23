const User = require("../models/users");
const { Op } = require("sequelize");

const get_data = (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    facebook,
    gender,
    instagram,
    twitter,
    linkedin,
    github,
    personal,
    about,
  } = req.body;
  var image = null;
  if (req.file) {
    image = `/images/${req.file.filename}`;
  }

  const divisions = [];
  if (req.body.dev) {
    divisions.push("Dev");
  }

  if (req.body.cpd) {
    divisions.push("CPD");
  }

  if (req.body.cbv) {
    divisions.push("CBV");
  }

  const division = divisions.join(", ");
  
  const data = {}
  if (firstName) {
    data.firstName = firstName;
  }
  if (lastName) {
    data.lastName = lastName;
  }
  if (email) {
    data.email = email;
  }
  if (phoneNumber) {
    data.phoneNumber = phoneNumber;
  }
  if (gender) {
    data.gender = gender
  }
  if (facebook) {
    data.facebook = facebook
  }
  if (instagram){
    data.instagram = instagram
  }
  if (twitter){
    data.twitter = twitter
  }
  if(linkedin){
    data.linkedin = linkedin
  }
  if (github){
    data.github = github
  }
  if (personal){
    data.personal = personal
  }
  if (about){
    data.about = about
  }
  if (division){
    data.division = division
  }
  if (image){
    data.image = image
  }
  return data;
};

const create_user = async (req, res) => {
  const data = get_data(req, res);

  const user = User.build(data);

  await user.save();
  return await user;
};

const update_user = async (req, res) => {
  const data = get_data(req, res);

  const user = await User.findByPk(req.params.id);

  await user.update(data);

  return await user;
}

const delete_user = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  await user.destroy();
}

const get_user = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  return await user;
}

const get_paginated_users = async (req, res) => {
  var {
    page,
    limit,
    sort,
    order,
    search,
  } = req.query;
  
  if(!page){
    page = 1;
  }
  if(!limit){
    limit = 10;
  }
  if(!sort){
    sort = "createdAt";
  }
  if(!order){
    order = "ASC";
  }
  if(!search){
    search = "";
  }

  const offset = (page - 1) * limit;
  const { count, rows } = await User.findAndCountAll({
    where: {
      [Op.or]: [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } },
        { division: { [Op.iLike]: `%${search}%` } },
      ],
    },
    order: [[sort, order]],
    offset,
    limit,
  });

  return await { count, users: rows };
}


module.exports = {
  create_user,
  update_user,
  delete_user,
  get_user,
  get_paginated_users
}