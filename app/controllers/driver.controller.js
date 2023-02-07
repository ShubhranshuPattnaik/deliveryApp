
const plivo = require('plivo');
const client = new plivo.Client();

const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Product = db.product;
const Driver = db.driver;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const { authJwt } = require("../middleware");
const bcrypt = require("bcryptjs");
const { product, Sequelize } = require("../models");
const UserRole = db.user_roles;

const {sequelize, Association} = require('sequelize');


exports.jobAssigned = async (req, res) => {
    try{ 
        let token = req.session.token;
    
        const id = jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
            message: "Unauthorized!",
        });
      }
      const uid = req.userId = decoded.id;
      return uid;
    });   
          
    const driver = await Driver.findAll({
        where: {
            driverId: id
        }
    });

    let data = driver[0]

    if (data.dataValues.status === "assigned"){
        Product.findAll({
            where: {
                id: data.dataValues.productId
            }
        }).then((data=>{
            res.status(200).send(data);
        }));
    }
    else{
        res.status(200).send("No jobs found");
    }

    

    } catch{
   res.status(500).send({message: "error.message"});
 }
  };

  exports.updateOrder = async (req, res) => {
    try{ 
        let token = req.session.token;
    
        const id = jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
            message: "Unauthorized!",
        });
      }
      const uid = req.userId = decoded.id;
      return uid;
    });   
          
    const driver = await Driver.findOne({
        where: {
            driverId: id
        }
    });

    const product = await Product.findOne({
        where: {
            id: driver.productId
        }
    });
        
        product.update({
            status: req.body.status
        });
        const phoneNumber = product.phoneNumber;
        const status = req.body.status; 

        client.messages.create({
            src: '+919876802979',
            dst: "+91"+`${phoneNumber}`,
            text: 'Order Status: ' +  `${status}`
        });

        res.status(200).send(product);


    
    } catch{
   res.status(500).send({message: "error.message"});
  }
  };
  exports.location = async (req, res) => {
    try{ 
        let token = req.session.token;
    
        const id = jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
            message: "Unauthorized!",
        });
      }
      const uid = req.userId = decoded.id;
      return uid;
    });   
          
    const driver = await Driver.findOne({
        where: {
            driverId: id
        }
    });

    driver.update({
        latitude: req.body.latitude,
        longitude: req.body.longitude

    });

        res.status(200).send("location updated");


    
    } catch{
   res.status(500).send({message: "error.message"});
  }
  };

