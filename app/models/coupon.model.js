
module.exports = (sequelize, Sequelize) => {
    const Coupon = sequelize.define("coupons", {
      couponId:{
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      }
  
    });
  
    return Coupon;
  };
  
