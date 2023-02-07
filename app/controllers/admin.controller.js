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
const Coupon = db.coupon;
const {sequelize} = require('sequelize');


exports.orderRequests = async (req, res) => {
    try{ 

        if (req.body.filter === "none"){
        Product.findAll({
            where: {
                paymentStatus: "Paid"
            }
        
       })
       .then(data=>{
        res.status(200).send(data)
    });
            
        }

       else if(req.body.filter === "accepted"){
        const product = await Product.findAll({
            where: {
                status: "accepted"
            }
        });

        res.status(200).send(product);

       }

       else if(req.body.filter === "delivered"){
        const product = await Product.findAll({
            where: {
                status: "delivered"
            }
        });

        res.status(200).send(product);

       }

       else if(req.body.filter === "null"){
        const product = await Product.findAll({
            where: {
                status: null
            }
        });

        res.status(200).send(product);

       }

        } catch{
    res.status(500).send({message: "error.message"});
  }
  };

exports.driverRequests = async (req, res) => {
    
    try{

        if(req.body.filter === "none"){
        const driver = Driver.findAll({
            
            attributes: {exclude:['id','createdAt','updatedAt']}
            
         }).then((data)=>{
            res.status(200).send(data);
         }) ;  
        }
        else if(req.body.filter === "null"){

            const driver = await Driver.findAll({
                where: {
                    status: null
                }
            });
            res.status(200).send(driver);
        }

        else if(req.body.filter === "assigned"){

            const driver = await Driver.findAll({
                where: {
                    status: "assigned"
                }
            });
            res.status(200).send(driver);
        }
        }catch{
            res.status(500).send({message: "error.message"});
        }        
};
       
exports.manageRequests = async (req,res) => {
        
    try{
        const status = req.body.action; 
        
        if (status === "accept"){
        

        const product = await Product.findOne({
            where:{
                id: req.body.productId
            }
        });

        const driver = await Driver.findOne({
            where:{
                driverId: req.body.driverId
            }
        });


        product.update({
            status: "accepted",
            driverId: req.body.driverId
        });

        driver.update({
            status: "assigned",
            productId: req.body.productId
        });
        res.status(200).send("Job has been assigned");
    }
    else{
        product.update({
            status: "rejected"
        });
        res.status(200).send("Job has been rejected");

    }
}catch{

    res.status(500).send({message:"error.message"});
}

};
  

exports.customerReview = async (req,res) => {
        
    try{
        
       const product = await Product.findAll({
        where:{
            rating: { [Sequelize.Op.ne]: null }
        }
       });
       

       res.status(200).send({product});

    
}catch{

    res.status(500).send({message:"error.message"});
}

};
  

exports.coupons = async (req, res) => {
    
    try{

        Coupon.create({
            couponId: req.body.coupon,
            amount : req.body.amount
        });

        const coupon =  await Coupon.findAll({
            
        });
        res.status(200).send(coupon);    
        
        }catch{
            res.status(500).send({message: "error.message"});
        }        
};
  