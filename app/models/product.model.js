module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
      customerId:{
        type: Sequelize.INTEGER
      },
      driverId:{
        type: Sequelize.INTEGER
      },
      product_type: {
        type: Sequelize.STRING
      },
      phoneNumber:{
        type: Sequelize.STRING
      },
      alternateNumber:{
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.FLOAT
      },
      length: {
        type: Sequelize.FLOAT
      },
      breadth: {
        type: Sequelize.FLOAT
      },
      pickup:{
        type: Sequelize.STRING
      },
      drop:{
        type: Sequelize.STRING
      },
      latitude:{
        type: Sequelize.FLOAT
      },
      longitude:{
        type: Sequelize.FLOAT
      },
      status:{
        type: Sequelize.STRING
      },
      amount:{
        type: Sequelize.FLOAT
      },
      paymentStatus:{
        type: Sequelize.STRING
      },
      rating:{
        type: Sequelize.INTEGER
       },
      review:{
        type: Sequelize.STRING
      } 
  
    });
  
    return Product;
  };
  