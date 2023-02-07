module.exports = (sequelize, Sequelize) => {
    const UserRoles = sequelize.define("user_roles", {
      roleId: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      }
  
    });
  
    return UserRoles;
  };
  