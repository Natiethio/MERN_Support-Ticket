const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoute");
const cookieParser = require("cookie-parser");
const session = require('express-session'); 
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;   
// const RedisStore = require('connect-redis')(   session);
// const redis = require('redis');  

app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
};

// Middleware
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json("Node BackEnd");
})

app.get('/favicon.ico', (req, res) => res.status(204).end()); 



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use("/api/user", userRoutes);  //base route is /api/user in UserRoutes it will have a child route to to have the controller function 


// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });

if (process.env.NODE_ENV !== "production") {
  // const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

module.exports = app;






