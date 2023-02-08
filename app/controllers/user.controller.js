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
const { PhoneNumber } = require("plivo/dist/resources/numbers");
const Coupon = db.coupon;


const plivo = require('plivo');
const client = new plivo.Client();

const axios = require('axios');
var NodeGeocoder = require('node-geocoder');

var Publishable_Key = 'pk_test_51MYMrQSAG3bWCL5SXWYyw66rrN6IpsttcdND462YInSb95Yp9X8Yr3WpAIPEJOtFTiZ71loB5l3A5pGNuT0rSn5400rmsuzNni'
var Secret_Key = 'sk_test_51MYMrQSAG3bWCL5SEZ5Wkm1OlWS3Ki2ZC6v6xFEjGUNJgKsHnY7LRwPhYLVPHAZGvSJlKImtuaOedP1eugU1ev7x002rNpISiv'
const stripe = require('stripe')(Secret_Key) 



exports.userBoard = async (req, res) => {
  try{ 
    let token = req.session.token;
    let amount = 0;
    const id = jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      const uid = req.userId = decoded.id;
      return uid;
    });   

  const product = await Product.create({
    customerId: id,
    product_type: req.body.product_type,
    weight: req.body.weight,
    length: req.body.length,
    breadth: req.body.breadth,
    pickup: req.body.pickup,
    drop: req.body.drop,
    phoneNumber: req.body.phoneNumber,
    alternateNumber: req.body.alternateNumber
  });



  var geocoder = NodeGeocoder({
    provider: 'opencage',
    apiKey: '383a76e0784f4ae5b7bee19f0b4dd004'
  });
  
  const location = await geocoder.geocode(product.pickup, function(err, res) {
    const res1 = res[0];
    return res1;
  });
  let cords = location[0];
  let latitude = cords.latitude;
  let longitude = cords.longitude;

  product.update({
      latitude: latitude,
      longitude: longitude
  });
  
  

  amount = product.weight*product.length*product.breadth;
   if(req.body.coupon === null){
    product.update({amount: amount});
    res.status(200).send({Amount: amount,
      Next: "Details Saved, please proceed to payment"
    });

   }
  else{
  const coupon = await Coupon.findOne({
    where:{
      couponId: req.body.coupon
    }
  });
  
  if(coupon){

  finalAmount = amount - coupon.amount

  product.update({amount: amount});
  res.status(200).send({Total_Amount: amount,
    Discount: coupon.amount,
    Final_Amount: finalAmount,
    Next: "Details Saved, please proceed to payment"
  });
}
else{
  res.status(201).send("Invalid Coupon")
}
  }
}catch{
  res.status(500).send({message: "error.message"});
}
};

exports.orderStatus = async (req, res) => {
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
    
    const product = await Product.findAll({
    where:{
      customerId: id
    }
  });
  let data = product[0];
  
 
  
    const trackingId = data.dataValues.id;
    const status = data.dataValues.status;

    if(data.dataValues.status ==="rejected"){
      console.log(status);
      res.status(200).send({status:status});
    }

    if(data.dataValues.status==="delivered"){

      res.status(200).send("Your order has been delivered, please rate the driver.")
    }
    //res.redirect(/feedback)
    else{
    res.status(200).send({trackingId:trackingId, status:status});
    console.log(status);
  }
}catch{
  res.status(500).send({message: "error.message"});
 }
};


exports.postPayment = async (req, res) => {
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

      const user = await User.findOne({
        where:{
          id: id
        }
      });
      const product = await Product.findOne({
        where:{
          customerId: id
        }
      });
      
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],

      line_items: [{
        "price_data": {
          "currency": "inr",
          "product_data": {
            "name": product.id,
            "description": product.product_type
          },
          "unit_amount": product.amount*100 //100
        },
        "quantity": 1
      }],
      phone_number_collection: {
        enabled: true,
      },
      mode: 'payment',
      success_url: `${req.protocol}://${req.get("host")}/`,
      cancel_url: `${req.protocol}://${req.get("host")}/`
    });

    product.update({
      paymentStatus: "Paid"
            
    });
    const phoneNumber =  product.phoneNumber;
    console.log(phoneNumber);
    const link = session.url;
    res.status(200).send({Payment_link:session.url});
      client.messages.create({
      src: '+919876802979',
      dst: "+91"+`${phoneNumber}`,
      text: 'Payment link for orderId: ' + `${product.id}` + '-' +  `${link}`
  });
    
}catch{
  product.update({
    paymentStatus: "Declined"

  });
  res.status(500).send({message: "error.message"});
}
};


exports.feedback = async (req, res) => {
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
     
     const product = await Product.findOne({
     where:{
       customerId: id
     }
   });
 
   product.update({
    rating: req.body.rating,
    review: req.body.review
   });
   
   const driver = await Driver.findOne({
      where:{
        driverId: product.driverId
      }
   });

   let avgRating = driver.avgRating;
   avgRating = (avgRating + req.body.rating)/2;

   driver.update({
      avgRating: avgRating
   });

  res.status(200).send("Thanks for your feedback.")
 }catch{
   res.status(500).send({message: "error.message"});
  }
 };

 