var express = require("express");
var router = express.Router();
var {
  authenticate,
  is_authenticated,
  check_authentication,
} = require("../routes/utils");
const { delete_tokens } = require("../routes/token_crud");
const { create_user } = require("../routes/user_crud");

const multer = require("multer");
const upload = multer({ dest: "public/images/" });

/* users registration. */
router.get("/admin", is_authenticated, async (req, res, next) => {
  const token = req.cookies.token;
  var isLoggedIn = false;
  if (token) {
    console.log("token Before: ", token);
    if (await check_authentication(token)) {
      isLoggedIn = true;
    }
  }
  res.render("admin", {
    title: "Express",
    isLoggedIn: isLoggedIn,
  });
});

router.post(
  "/admin",
  [is_authenticated, upload.single("image")],
  async (req, res, next) => {
    console.log("POST req.file: ", req.file);
    const token = req.cookies.token;
    if (token) {
      const is_logged = await check_authentication(token);
      if (!is_logged) {
        return res.redirect("/hall-of-fame/login/");
      }
    }
    // get the user data from the form
    // upload file to the server
    // save the user data to the database
    // redirect the user to the login page
    try {
      const user = await create_user(req, res);
      console.log("user created: ", user);
      return res.redirect("/hall-of-fame/");
    } catch (error) {
      console.log("POST admin, error: ", error);
    }

    return res.render("admin", {
      title: "Member Register",
      isLoggedIn: isLoggedIn,
      error: "error has occured",
    });
  }
);

// Authentications

router.get("/login", async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    console.log("token Before: ", token);
    if (await check_authentication(token)) {
      return res.redirect("/hall-of-fame/admin/");
    }
  }
  res.render("login", { title: "Express" });
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // Redirect Authenticated user
  const token = req.cookies.token;
  if (token) {
    console.log("token Before: ", token);
    if (await check_authentication(token)) {
      return res.redirect("/hall-of-fame/admin/");
    }
  }

  const result = await authenticate(username, password);

  console.log("Login result: ", await result);

  if (await result) {
    console.log("result: ", result);
    res.cookie("token", result.token, {
      maxAge: result.expiresAt.getTime() - Date.now(),
    });
    return res.redirect("/hall-of-fame/admin/");
  } else {
    return res.render("login", {
      title: "Login",
      error: `Invalid username or password`,
      isLoggedIn: false,
    });
  }
});

router.all("/logout", async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    // remove token fromm database
    await delete_tokens(token);
  }
  // remove token from cookie
  res.clearCookie("token");
  res.redirect("/hall-of-fame/login");
});

module.exports = router;
