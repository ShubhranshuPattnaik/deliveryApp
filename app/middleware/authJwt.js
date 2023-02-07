const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

isDriver = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "driver") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require driver Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate driver role!",
    });
  }
};


isVerified = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where:{ 
        username: req.body.username

    }});
    


    if(user.status==="verified"){
      
      return next();
    }
    else{
      return res.status(500).send("user not verified");
    }
    
    } catch (error) {
    return res.status(500).send({
      message: "error.message",
    });
  }
};

isUserOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "user") {
        return next();
      }

      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate admin role!",
    });
  }
};



const authJwt = {
  verifyToken,
  isAdmin,
  isDriver,
  isVerified,
  isUserOrAdmin
};
module.exports = authJwt;
