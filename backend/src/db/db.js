const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

module.exports= connectDB