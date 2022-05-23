var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/images/" });

var { check_authentication, is_authenticated } = require("../routes/utils");
const { get_paginated_users, get_user, delete_user, update_user } = require("../routes/user_crud");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const token = req.cookies.token;
  var isLoggedIn = false;
  if (token) {
    console.log("token Before: ", token);
    if (await check_authentication(token)) {
      isLoggedIn = true;
    }
  }

  try {
    var { count, users } = await get_paginated_users(req, res);
    // pagination paramters
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var sort = req.query.sort || "createdAt";
    var order = req.query.order || "ASC";
    var search = req.query.search || "";
    var pages = Math.ceil(count / limit);
    var offset = (page - 1) * limit;
    var nextPage = page + 1;
    var prevPage = page - 1;

    if (nextPage > pages && pages !== page) {
      nextPage = pages;
    } else if (nextPage > pages) {
      nextPage = false;
    } else if (nextPage === page) {
      nextPage = false;
    }
    if (prevPage < 1) {
      prevPage = false;
    } else if (prevPage === page) {
      prevPage = false;
    }

    var prev = page - 1;
    var next = page + 1;
    var pagination = {
      page: page,
      limit: limit,
      sort: sort,
      order: order,
      search: search,
      pages: pages,
      prev: prev,
      next: next,
    };
    console.log("pagination: ", pagination);

    console.log("users: ", users, count);
  } catch (error) {
    console.log("index error: ", error);
  }

  res.render("hall-of-fame", {
    title: "Hall of Fame",
    users: users,
    count: count,
    isLoggedIn: isLoggedIn,
    pagination: pagination,
  });
});

// user details
router.get("/user/:id", async (req, res, next) => {
  const token = req.cookies.token;
  var isLoggedIn = false;
  if (token) {
    console.log("token Before: ", token);
    if (await check_authentication(token)) {
      isLoggedIn = true;
    }
  }

  const user = await get_user(req, res);

  return res.render("user-details", {
    title: "User Details",
    user: user,
    isLoggedIn: isLoggedIn,
  });
});

// Detele user
router.post("/user/:id/delete", is_authenticated, async (req, res, next) => {
  await delete_user(req, res);
  return res.redirect("/");
});

// Edit User
router.get("/user/:id/edit", is_authenticated, async(req, res, next) => {
  const user = await get_user(req, res)
  return res.render(
    "edit-user",
    {
      title: "Edit User",
      user: user,
      isLoggedIn: true,
    }
  )
})

router.post("/user/:id/edit", [is_authenticated, upload.single("image")], async(req, res, next) => {
  await update_user(req, res);
  return res.redirect("/");
})

module.exports = router;
