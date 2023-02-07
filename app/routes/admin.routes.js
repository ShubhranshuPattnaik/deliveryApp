const { authJwt } = require("../middleware");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

app.post(
    "/api/admin/orders",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.orderRequests
  );


app.post(
    '/api/admin/drivers', 
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.driverRequests
);
app.post(
    '/api/admin/manage',
    [authJwt.verifyToken,authJwt.isAdmin],
    controller.manageRequests
    
);

app.get(
    '/api/admin/customerreview',
    [authJwt.verifyToken,authJwt.isAdmin,authJwt.isUserOrAdmin],
    controller.customerReview
);

app.post(
  '/api/admin/coupons',
  [authJwt.verifyToken,authJwt.isAdmin,authJwt.isUserOrAdmin],
  controller.coupons
);

};
