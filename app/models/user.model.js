module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING(100)
    },
    country:{
      type: Sequelize.STRING
    },
    state:{
      type: Sequelize.STRING
    },
    city:{
      type: Sequelize.STRING
    },
    zipCode:{
      type: Sequelize.STRING
    },
    code:{
      type: Sequelize.INTEGER
    },
    status:{
      type: Sequelize.STRING
    }

  });

  return User;
};
