const plivo = require('plivo');
const client = new plivo.Client();

const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Driver = db.driver;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const { authJwt } = require("../middleware");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  
  try {
  
    const code = Math.floor(100000 + Math.random() * 900000);

    
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      phoneNumber: req.body.phoneNumber,
      code: code,
      country:req.body.country,
      zipCode:req.body.zipCode,
      city:req.body.city,
      state:req.body.state
    });
   
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      

      const result = user.setRoles(roles);
      
      
      if (result) {

        client.messages.create({
          src: '+919876802979',
          dst: "+91"+`${req.body.phoneNumber}`,
          text: 'Please use this code to complete your registration' + `${code}`
          
      }
      

  ).then(function(code) {
      
      res.send({ message: "User verification!" });
      console.log(code)
   });

   const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400, 
  });
  req.session.token = token;


      
    }} else {
    
      const result = user.setRoles([1]);
      if (result) {

        client.messages.create({
          src: '+919876802979',
          dst: "+91"+`${req.body.phoneNumber}`,
          text: 'Please use this code to complete your registration' + `${code}`
      }

  ).then(function(code) {
    
      res.send({ message: "User verification!" });
      console.log(code)
  });

  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400, 
  });
  req.session.token = token;
    }
  }


 } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roles: authorities,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};


exports.verify = async(req,res) => {

  try {
    let token = req.session.token;
    
    const id = jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      const id = req.userId = decoded.id;
      return id;
    });   

    if (!token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }

    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    const code = req.body.code;

    if(user.code === code){
      const update = user.update({
        status: "verified"

      });
      return res.send("message: Verified");      

    }
    else{
      return res.send("message: Invalid Code");
    }
   

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

  };

