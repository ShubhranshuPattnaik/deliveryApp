const UserRole = require('./user_roles');


module.exports = (sequelize, Sequelize) => {
    const Driver = sequelize.define("drivers", {
      driverId:{
        type: Sequelize.INTEGER
      },
      location: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      productId: {
        type: Sequelize.INTEGER
      },
      avgRating: {
        type: Sequelize.FLOAT
      }
  
    });
  
    return Driver;
  };
  
