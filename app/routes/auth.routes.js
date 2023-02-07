const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middleware");



module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmailOrPhone,
      verifySignUp.checkRolesExisted
    ],
    controller.signup

    );

  app.post("/api/auth/verify",controller.verify);

  app.post("/api/auth/signin",
  [authJwt.isVerified],
  controller.signin);

  app.post("/api/auth/signout", controller.signout);
  
};
