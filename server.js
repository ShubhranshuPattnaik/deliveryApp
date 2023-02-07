const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

require('dotenv').config();

const app = express();

app.use(cors());


app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    secret: "COOKIE_SECRET", 
    httpOnly: true,
    sameSite: 'strict'
  })
);


const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();


app.get("/", (req, res) => {
  res.json({ message: "Welcome to PackDel." });
});


require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/driver.routes")(app);

app.listen(8080, () => {
  console.log(`Server is running on port ${8080}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "driver",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
