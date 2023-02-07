const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.driver = require("../models/driver.model.js")(sequelize, Sequelize);
db.user_roles = require("../models/user_roles.js")(sequelize, Sequelize);
db.coupon = require("../models/coupon.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

const Driver = db.driver;
const UserRole = db.user_roles;

          
sequelize.sync().then(() => {
  return UserRole.findAll({
    // attributes: ['userId', 'roleId']
    where:{
      roleId: 2
    }
  }).then(sources => {
    return Promise.all(sources.map(source => {
      return Driver.findOne({
        where: { driverId: source.userId }
      }).then(target => {
        if (!target) {
          return Driver.create({
            driverId: source.userId,
            avgRating: 0
          });
        }
      });
    }));
  });
});





db.ROLES = ["user", "admin", "driver"];


module.exports = db;
