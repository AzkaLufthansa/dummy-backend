const express = require('express');
const { Sequelize } = require("sequelize");

const UserRoutes = require("./auth/routes");

const UserModel = require("./common/models/User")

const { port } = require("./config");


const app = express ();
app.use(express.json());

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./storage/data.db",
});

// Initialising the Model on sequelize
UserModel.initialize(sequelize);

sequelize
    .sync()
    .then(() => {
        console.log("Sequelize Initialised!!");

        // Attaching the Authentication and User Routes to the app.
        app.use("/auth", UserRoutes);

        app.listen(port, () => {
            console.log("Server Listening on PORT:", port);
        });
    })
    .catch((err) => {
        console.error("Sequelize Initialisation threw an error:", err);
    });