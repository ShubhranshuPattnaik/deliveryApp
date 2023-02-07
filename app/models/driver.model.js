const UserRole = require('./user_roles');


module.exports = (sequelize, Sequelize) => {
    const Driver = sequelize.define("drivers", {
      driverId:{
        type: Sequelize.INTEGER
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.STRING
      },
      productId: {
        type: Sequelize.INTEGER
      },
      avgRating: {
        type: Sequelize.FLOAT
      },
      distance: {
        type: Sequelize.FLOAT
      }  
    });
  
    return Driver;
  };
  
