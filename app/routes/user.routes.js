const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.post(
    "/api/user",
    [authJwt.verifyToken],
    controller.userBoard
  );


  app.get(
    "/api/user/orderstatus",
    [authJwt.verifyToken],
    controller.orderStatus
  );

  app.post(
    "/api/user/payment",
    [authJwt.verifyToken],
    controller.postPayment
  );

  
  app.post(
    "/api/user/feedback",
    [authJwt.verifyToken],
    controller.feedback
  );

};
