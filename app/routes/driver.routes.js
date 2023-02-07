const { authJwt } = require("../middleware");
const controller = require("../controllers/driver.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

app.get(
    "/api/driver/jobs",
    [authJwt.verifyToken, authJwt.isDriver],//,authJwt.isVerified],
    controller.jobAssigned
  );

app.post(
    "/api/driver/update",
    [authJwt.verifyToken, authJwt.isDriver],
    controller.updateOrder
);
app.post(
  "/api/driver/location",
  [authJwt.verifyToken, authJwt.isDriver],
  controller.location
);


}
